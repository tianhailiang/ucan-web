$(function(){
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
		serchCourse()
		serchCourse2()
	}
//	ajax动态加载数据
	function serchCourse(){
		var t=new Date().getTime();
		$.ajax({
			type:"get",
			url:"/api/view/user/teachers/findCourseSchedulesList",
			async:true,
			dataType: 'json',
			data:{
				"t":t,
				"token":userToken,
				"mode":"live"
			},
			success: function(data) {
				notlogin(data);
				if(data.code!=0){return false;}
				var data = data.data;
				if(data) {
					var len = data.length;
					for(var i = 0; i < len; i++) {
						if(!data[i].ucanFile){
							var srcUrl='../../img/default-course.png';
						}else{
							var srcUrl=data[i].ucanFile.newUrl;
						}
						createTr(srcUrl, data[i].name, data[i].id);

					}
				}
			},
			error:function(){
				console.log("错误")
			}
		});
	}
	function serchCourse2(){
		var t=new Date().getTime();
		$.ajax({
			type:"get",
			url:"/api/view/user/teachers/findCourseSchedulesList",
			async:true,
			dataType: 'json',
			data:{
				"t":t,
				"token":userToken,
				"mode":"ooo"
			},
			success:function(data){
				notlogin(data);
				if(data.code!=0){return false;}
				var data = data.data;
				if(data){
					var len = data.length;
					for(var i = 0; i < len; i++) {
						if(!data[i].ucanFile){
							var srcUrl='../../img/default-course.png';
						}else{
							var srcUrl=data[i].ucanFile.newUrl;
						}
						createTr2(srcUrl, data[i].name, data[i].id);
					}
				}
			},
			error:function(){
				console.log("错误")
			}
		});
	}
//	创建tr
	function createTr(img,name,id){
		var $tr = $("<tr></tr>");
		var str = '<td><img src="'+img+'"/></td><td class="txt-l coursePhotoText">';
		str+='<p class="tName">'+name+'</p>';
		str+='<p class="f-sizeimg13">ID：'+id+'</p>';
		str+='<p class="f-size13">课程状态：正在进行</p>';
		str+='<p class="f-size13"></p>';
		str+='<p class="f-size13 mt3 fn-c0"></p>';
		str+='</td><td></td><td></td><td><p class="mt35"><a class="btn fn-c0" href="../teacherHome/teacherHome.html?teacherId='+id+'">查看个人资料</a></p></td>';	
		$tr.html(str);
		$("#courseListBox").append($tr);
	}
	//	创建tr
	function createTr2(img,name,id,beginDate){
		var $tr = $("<tr></tr>");
		var str = '<td><img src="'+img+'"/></td><td class="txt-l coursePhotoText">';
		str+='<p class="tName">'+name+'</p>';
		str+='<p class="f-sizeimg13">ID：'+id+'</p>';
		str+='<p class="f-size13">课程状态：正在进行</p>';
		str+='<p class="f-size13"></p>';
		str+='<p class="f-size13 mt3 fn-c0"></p>';
		str+='</td><td></td><td></td><td><p class="mt35"><a class="btn fn-c0" href="../teacherHome/teacherHome.html?teacherId='+id+'">查看个人资料</a></p></td>';	
		$tr.html(str);
		$("#courseListBox2").append($tr);
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
//	计算现在时间于开课时间的差值
	function computationTime(beginDate){
		var nowTime = new Date ();
		var chaHours = parseInt(formatTime(beginDate).hourTime) - parseInt(nowTime.getHours());
		var chaMinutes = parseInt(formatTime(beginDate).minuteTime) - parseInt(nowTime.getMinutes());
		if(chaHours<0){
			chaHours = 0;
		}
		if(chaMinutes<0){
			chaMinutes = 0;
		}
		return {'chaHours':chaHours,'chaMinutes':chaMinutes}
	}
//	却换table
	$("#courseListBoxHeader").on("click","span",function(){
		var _index = $(this).index();
		$(this).addClass("active").siblings("span").removeClass("active");
		$("#table_content .table").eq(_index).removeClass('disnone').siblings('.table').addClass('disnone');
	})
});
