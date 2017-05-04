$(function() {
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
		ClassCourse();
	}
	function ClassCourse() {
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: "/api/view/user/courseRooms/findPage",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data.rows;
				if(data.length>0){
					var len = data.length;
					for(var i = 0; i < len; i++) {
						if(data[i].cost.coursePlans.courses.ucanFile == null) {
							newUrl = '../../img/default-course.png';
						} else {
							newUrl = data[i].cost.coursePlans.courses.ucanFile.newUrl
						}
						if(data[i].recCourses.rtmpRecUrl1){
							createTr(newUrl,data[i].cost.coursePlans.courses.name,data[i].cost.beginTime,data[i].cost.endTime,data[i].id,data[i].cost.coursePlans.courses.mode,i,data[i].cost.coursePlans.id,data[i].cost.coursePlans.courses.id);
						}
					}
				}
				if(!$("#courseListBox").html()){
					var imgStr = "<img src='../../img/result.png'>"
					$("#courseListBox").css({
						textAlign: "center"
					});
					$("#courseListBox").html(imgStr);
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}

	//	创建tr
	function createTr(img, courseName, beginDate, endDate, courseId,mode,i,costId,coursesId) {
		//console.log(courseId);
		var $tr = $("<tr></tr>");
		var str = '<td><img src="' + img + '"/></td><td class="txt-l br-r coursePhotoText">';
		str += '<p class="tName">' + courseName + '</p>';
		str += '<p class="f-sizeimg13">约课编号：' + fillPre(costId) + '</p>';
		str += '<p class="f-sizeimg13">班内序号：' + fillPre(coursesId) + '</p>';
		str += '<p class="f-size13">在线授课</p>';
		str += '<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y"></span></p>';
		str += '</td><td class="br-r">';
		str += '<p class="f-size13">'+formatTime(beginDate).monthTime+'月'+formatTime(beginDate).dayTime+'号</p>';
		str+='<p class="f-size16">'+formatTime(beginDate).hourTime+':'+formatTime(beginDate).minuteTime+'-'+formatTime(endDate).hourTime+':'+formatTime(endDate).minuteTime+'</p>';
		str += '<p class="f-size13"></p></td>';
		str += '<td class="br-r w25">';
		str += '<p class="f-size13"><a href="../tapedLessons/tapedLessons.html?roomId='+courseId+'" class="btn fn-c0">回放</a></p>';
		str += '<p class="f-size13 mt35"><a href="javascript:void(0);" onclick="SendCourse('+courseId+')" class="btn fn-c0">发布精品课</a></td>';//2017-03-17
		$tr.html(str);
		$("#courseListBox").append($tr);
		(mode=="ooo")?$(".courseMake").eq(i).text('1对1'):$(".courseMake").eq(i).text('班课');
	}

	//	时间格式处理
	//		yyyy-mm-dd HH:MM:ss---->yyyy,mm,dd,hh,mm,ss
	function formatTime(time) {
		var yearTime = time.substring(0, 4);
		var monthTime = time.substring(5, 7);
		var dayTime = time.substring(8, 10);
		var hourTime = time.substring(11, 13);
		var minuteTime = time.substring(14, 16);
		return {
			'yearTime': yearTime,
			'monthTime': monthTime,
			'dayTime': dayTime,
			'hourTime': hourTime,
			'minuteTime': minuteTime,
		}
	};
	//	计算现在时间于开课时间的差值
	function computationTime(beginDate) {
		var nowTime = new Date();
		var chaHours = parseInt(formatTime(beginDate).hourTime) - parseInt(nowTime.getHours());
		var chaMinutes = parseInt(formatTime(beginDate).minuteTime) - parseInt(nowTime.getMinutes());
		if(chaHours < 0) {
			chaHours = 0;
		}
		if(chaMinutes < 0) {
			chaMinutes = 0;
		}
		return {
			'chaHours': chaHours,
			'chaMinutes': chaMinutes
		}
	}
	//	却换table
	$("#courseListBoxHeader").on("click", "span", function() {
			var _index = $(this).index();
			$(this).addClass("active").siblings("span").removeClass("active");
			$("#table_content .table").eq(_index).removeClass('disnone').siblings('.table').addClass('disnone');
		});
		//	课程详情
	var mark = true;
	$("#courseListBox").on("click", function(ev) {
		var _this = ev.target;
		var $this = $(_this);
		if(_this.className.indexOf('CourseDetailsBtn') != -1) {
			if(mark) {
				console.log();
				$this.parents(".downTr").find(".CourseDetailsBox").slideDown(600, function() {});
				$this.children('.icon-up').addClass("rotate180");
				mark = false;
			} else {
				$this.parents(".downTr").find(".CourseDetailsBox").slideUp(600);
				$this.children('.icon-up').removeClass("rotate180");
				mark = true;
			}
		}
	})
});


//发布精品课程
function SendCourse(roomId){
	//console.log("come on");
	$.ajax({
		type:"POST",
		url:"/api/view/user/courseRooms/update?token="+token,
		data:{
			"t":new Date().getTime(),
			roomId:roomId
		},
		success:function(data){
			notlogin(data);
			if(data.code==0){
				var text="发布成功";
				$(".canbox-2 .sc-date").html(text);
				$(".canbox-2").slideDown();
			}
		},
		error:function(){
			alert("发布失败，请稍后重试");
		}
	});
	//发布成功后的弹框中的确定按钮
	$(".canbox-2 .bg-c1").on("click",function(){
		$(".canbox").slideUp();
		window.location.reload();
	});
}
