$(function(){
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
	//	ajax动态加载数据
		serchCourse()
		serchTeacher()
	}
	function serchCourse(){
		var t=new Date().getTime();
		$.ajax({
			type:"get",
			url:"/api/view/user/favorite/courses/findList",
			async:true,
			dataType: 'json',
			data:{
				"t":t,
				"token":userToken,
			},
			success:function(data){
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data;
				var len = data.length;
				var id;
				if(len==0){
					$("#courseListBox").append('<div class="picBg" style="text-align:center"><img src="../../img/result.png" /></div>')
				}
				for(var i=0;i<len;i++){
					id = data[i].course.id;
					if(data[i].course.ucanFile == null) {
						newUrl = '../../img/default-course.png';
					} else {
						newUrl = data[i].course.ucanFile.newUrl
					}
					createTr(newUrl,data[i].course.name,data[i].course.mode,data[i].createdAt,data[i].course.coursePlans.length,i,data[i].course.coursePlans , id);
				}
			},
			error:function(){
				console.log("错误")
			}
		});
	}
	function serchTeacher(){
		var t=new Date().getTime();
		$.ajax({
			type:"get",
			url:"/api/view/user/favorite/teachers/query",
			async:true,
			dataType: 'json',
			data:{
				"t":t,
				"token":userToken
			},
			success:function(data){
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data;
				var len = data.length;
				if(len==0){
				$("#courseListBox2").append('<div class="picBg" style="text-align:center"><img src="../../img/result.png" /></div>')
			}
			for(var i=0;i<len;i++){
					if(data[i].teacher.ucanFile == null) {
						newUrl = '../../img/teacher-header.png';
					} else {
						newUrl = data[i].teacher.ucanFile.newUrl
					}
					createTr2(newUrl,data[i].teacher.name,data[i].teacherId);
					
				}
			},
			error:function(){
				console.log("错误")
			}
		});
	}
//	创建tr
	function createTr(img,courseName,mode,beginDate,len,i,coursePlans , id){
		
		
		
		var $tr = $("<tr></tr>");
		var str = '<td><img src="'+img+'"/></td><td class="txt-l br-r coursePhotoText">';
		str+='<p class="tName">'+courseName+'</p>';
		str+='<p class="f-sizeimg13" style="display:none;">约课编号：'+formatTime(beginDate).yearTime+formatTime(beginDate).monthTime+formatTime(beginDate).dayTime+'</p>';
		str+='<p class="f-size13">班内序号：</p>';
		str+='<p class="f-size13">在线授课</p>';
		str+='<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y"></span></p>';
		str+='</td><td class="br-r"><p class="f-size16"><span class="courseStatrDate f-size13"></span> 至</p>';
		str+='<p class="f-size16"><span class="courseEndDate f-size13"></span></p></td>';
		str+='<td class="br-r"><span class="courseStyle">课程已结束</span></td>';
		str+='<td><p><a class="btn fn-c0" href="../../course.html?courseId='+id+'">立即学习</a></p></td>';
		$tr.html(str);
		$("#courseListBox").append($tr);
		(mode=="ooo")?$(".courseMake").eq(i).text('1对1'):$(".courseMake").eq(i).text('班课');
		createDownTr(len,i,coursePlans);
	}
	function createTr2(img,name,ID){
		var $tr = $("<tr></tr>");
		var str = '<td><img src="'+img+'"/></td><td class="txt-l coursePhotoText">';
		str+='<p class="tName">'+name+'</p>';
		str+='<p class="f-sizeimg13">ID：'+ID+'</p>';
		str+='<p class="f-size13">课程状态：</p>';
		str+='<p class="f-size13"></p>';
		str+='<p class="f-size13 mt3 fn-c0"></p>';
		str+='</td><td></td><td></td><td><p class="mt35"><a class="btn fn-c0" href="../teacherHome/teacherHome.html?teacherId='+ID+'">查看个人资料</a></p></td>';	
		$tr.html(str);
		$("#courseListBox2").append($tr);
	}
	//创建下拉tr
	function createDownTr(len,i,coursePlans){
		var $downTr = $("<tr class='downTr'></tr>");
		var downTr = '<td class="br-r"><ul class="CourseDetailsBox show">';
		downTr+='<li class="CourseDetailsHeader"><span class="">共'+len+'节课</span></li>';
		var roomNull_Size = 0;

		for(var j=0;j<len;j++){
			var dataTime = coursePlans[j].courseCosts.beginTime;
			var size = coursePlans[j].courseCosts.length;

			var coursStatreDate = coursePlans[0].courseCosts[0].beginTime;
			var courseEndDate = coursePlans[j].courseCosts[(size-1)].endTime;
			for(var s=0;s<size;s++){
				
				var dataTime =coursePlans[j].courseCosts[s].beginTime;
				var beginTimeStr =coursePlans[j].courseCosts[s].beginTimeStr;
				var endTimeStr = coursePlans[j].courseCosts[s].endTimeStr;
				downTr+='<li><span class="">第'+(j+1)+'节课</span><span class="">'+formatTime(dataTime).yearTime+'年'+formatTime(dataTime).monthTime+'月'+formatTime(dataTime).dayTime+'日'+beginTimeStr+'-'+endTimeStr+'</span>';
				
				if(coursePlans[j].courseCosts[s].rooms==null){
					roomNull_Size++;
					if(roomNull_Size==len){
						$(".courseStyle").eq(i).text("课程未开始");
					}
					downTr+='<span class="typeP">未开课</span></li>';
				}
				if(coursePlans[j].courseCosts[s].rooms!=null&&coursePlans[j].courseCosts[s].rooms.status==0){
					downTr+='<span class="typeP">正在上课</span></li>';
					$(".courseStyle").eq(i).text("正在进行中");
				}
				if(coursePlans[j].courseCosts[s].rooms!=null&&coursePlans[j].courseCosts[s].rooms.status==1){
					downTr+='<span class="typeP">已结束</span></li>';
				}
				
			}
			$(".courseStatrDate").eq(i).text(coursStatreDate);
			$(".courseEndDate").eq(i).text(courseEndDate);

		}
		downTr+='</ul></td><td class="pos-r">';
		downTr+='<a class="CourseDetailsBtn fn-c0 pos-a" maker="true" falge="0">课程详情<i class="icon-up"></i></a></td>';
		$downTr.html(downTr);
		$("#courseListBox").append($downTr);
	}
//	时间格式处理
	//		yyyy-mm-dd HH:MM:ss---->yyyy,mm,dd,hh,mm,ss
	function formatTime(time){
		var yearTime = time.substring(0,4);
		var monthTime =  time.substring(5,7);
		var dayTime =  time.substring(8,10);
		var hourTime =  time.substring(11,13);
		var minuteTime = time.substring(14,16);
		return {'yearTime':yearTime,'monthTime':monthTime,'dayTime':dayTime,'hourTime':hourTime,'minuteTime':minuteTime}
	};
//	却换table
	$("#courseListBoxHeader").on("click","span",function(){
		var _index = $(this).index();
		$(this).addClass("active").siblings("span").removeClass("active");
		$("#table_content .table").eq(_index).removeClass('disnone').siblings('.table').addClass('disnone');
	})
	//	课程详情
var mark = true;
	$("#courseListBox").on("click", function(ev) {
		var _this = ev.target;
		var $this = $(_this)
		if(_this.className.indexOf('CourseDetailsBtn') != -1||_this.className.indexOf('icon-up') !=-1) {
			var maker = $this.attr("maker");
			var falge = $this.attr("falge");
			if(maker == "true") {
				if(falge == "0") {
					$this.attr("falge", "1")
				}
				$this.parents(".downTr").find(".CourseDetailsBox").slideDown(600, function() {});
				$this.children('.icon-up').addClass("rotate180");
				$this.attr("maker", "false")
			} else {
				$this.parents(".downTr").find(".CourseDetailsBox").slideUp(600);
				$this.children('.icon-up').removeClass("rotate180");
				$this.attr("maker", "true")
			}
		}
	})
});