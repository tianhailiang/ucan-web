//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};
function fillPre(num) {//不足5位在前补0
		var str = "0000" + num;
		str = str.slice(str.length - 5);
		return str;
}

$(function() {
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
		var url = (obj.user.groups == "student") ? "/api/view/user/course/schedules/findNewDateList" : "/api/view/user/costs/findNewDateList";
		serchCourse();
	}


	
	//	ajax动态加载数据
	

	function serchCourse() {
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: url,
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"removeFlag":0
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data;
				if(data.length!=0){
					var costId=data[0].id;
					if(!data[0].courseCosts){
						// if(obj.user.groups == "student" && data.length != 0) {
						// 	if(!data[0].courseCosts.coursePlans.courses.ucanFile) {
						// 		newUrl = '../../img/default-course.png';
						// 	} else {
						// 		newUrl = data[0].courseCosts.coursePlans.courses.ucanFile.newUrl
						// 	}
						// 	var EndTime = new Date(data[0].courseCosts.beginTime);
						// 	var NowTime = new Date();
						// 	var t = (EndTime.getTime() - NowTime.getTime()) / 60000;
						// 	//				默认在开课30分钟前提示
						// 	promptContentBox(costId,courseId,newUrl, data[0].courseCosts.coursePlans.courses.name, data[0].courseCosts.coursePlans.courses.id, data[0].courseCosts.beginTime, data[0].courseCosts.rooms, data[0].courseCosts.beginTimeStr, data[0].courseCosts.endTimeStr,mode);
						// }
						if(obj.user.groups == "teacher" && data.length != 0) {
							var rooms = data[0].rooms;
							var courseId=data[0].coursePlans.courses.id;
							var mode = data[0].coursePlans.courses.mode;
							if(data[0].coursePlans.courses.ucanFile == null) {
								newUrl = '../../img/default-course.png';
							} else {
								newUrl = data[0].coursePlans.courses.ucanFile.newUrl
							}
							var EndTime = new Date(data[0].beginTime);
							var NowTime = new Date();
							var t = (EndTime.getTime() - NowTime.getTime()) / 60000;
							//				默认在开课30分钟前提示
							if(rooms!=null&&rooms.status==1){
								return false;
							}else{
								promptContentBox(newUrl, data[0].coursePlans.courses.name, data[0].coursePlans.courses.id, data[0].beginTime, data[0].rooms, data[0].beginTimeStr, data[0].endTimeStr,costId,courseId,mode);
							}
						}
					}else{
						//学生端
						var rooms = data[0].courseCosts.rooms;
						var courseId=data[0].courseCosts.coursePlans.courses.id;
						var costId=data[0].courseCosts.id;
						var mode = data[0].courseCosts.coursePlans.courses.mode;
						if(obj.user.groups == "student" && data.length != 0) {
							if(!data[0].courseCosts.coursePlans.courses.ucanFile) {
								newUrl = '../../img/default-course.png';
							} else {
								newUrl = data[0].courseCosts.coursePlans.courses.ucanFile.newUrl;
							}
							var EndTime = new Date(data[0].courseCosts.beginTime);
							var NowTime = new Date();
							var t = (EndTime.getTime() - NowTime.getTime()) / 60000;
							//				默认在开课30分钟前提示
							if(rooms!=null&&rooms.status==1){
								return false;
							}else{
								promptContentBox(newUrl, data[0].courseCosts.coursePlans.courses.name, data[0].courseCosts.coursePlans.courses.id, data[0].courseCosts.beginTime, data[0].courseCosts.rooms, data[0].courseCosts.beginTimeStr, data[0].courseCosts.endTimeStr,costId,courseId,mode);							
							}
						}
					}
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}
	//	创建提示框
	var textTyp = '';
	function promptContentBox(img, courseName, classId, beginDate, roomID, beginTimeStr, endTimeStr, costId, courseId,mode) {
		var promptBox = $('<div id="promptBox"></div>');
		var promptBoxContent = '<ul><span id="closeBtn"></span>';
		promptBoxContent += '<li><img src="' + img + '" class="photo"/></li>';
		promptBoxContent += '<li class="br-r padl0">';
		promptBoxContent += '<p class="courseName">' + courseName + '</p>';
		promptBoxContent += '<p class="f-size13">约课编号：' + fillPre(costId) + '</p>';
		promptBoxContent += '<p class="f-size13">班内序号：' + fillPre(courseId) + '</p>';
		promptBoxContent += '<p class="f-size13">在线授课</p>';
		promptBoxContent += '<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y">班课</span></p></li>';
		promptBoxContent += '<li class="br-r texc"><p class="f-size13">' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '号</p>';
		promptBoxContent += '<p class="f-size16">' + beginTimeStr + '-' + endTimeStr + '</p></li>';
		promptBoxContent += '<li class="br-r texc"><p class="f-size13" id="typeP">等待上课</p>';
		promptBoxContent += '<p class="f-size13" id="distanceTIme">距离上课还有</p>';
		promptBoxContent += '<p class="f-size13"><span id="t_h"></span><span id="t_m"></span></p></li>';
		promptBoxContent += '<li class="texc"><p><a class="btn fn-c0" id="goToRoom"></a></p>';
		promptBoxContent += '</li></ul>';
		promptBox.html(promptBoxContent);
		promptBox.appendTo('body');
		var roomID = roomID;
		if(mode=="ooo"){
			$(".courseMake").text("一对一")
		}else{
			$(".courseMake").text("班课")
		}
		if(roomID == null && obj.user.groups == "teacher") {
			$("#goToRoom").text("创建教室");
			if(mode=="ooo"){
				
				$("#goToRoom").on("click", function() {
					if ("FF" == mb || "Chrome" == mb) {
				   		SetClassRoomOoo(costId, courseId,courseName);
					}else{
						 alert("您的浏览器版暂不支持该功能，请使用Chrome浏览器或者Firefox浏览器！！！");
				    	window.open("http://www.firefox.com.cn/");
				    	return false;
					}
				})
			}else{
				$("#goToRoom").on("click", function() {
					SetClassRoom(costId, courseId);
				})
			}
		}
		if(roomID == null && obj.user.groups == "student") {
			if(mode=="ooo"){
				$("#goToRoom").text("暂无教室");
				$("#goToRoom").attr("href", "#");
			}else{
				$("#goToRoom").text("暂无教室");
				$("#goToRoom").attr("href", "#");
			}
		}
		if(roomID != null&& obj.user.groups == "student") {
			var roomId = roomID.id;
			$("#goToRoom").text("进入教室");
			if(mode=="ooo"){
				if ("FF" == mb||"Chrome" == mb) {
				  $("#goToRoom").attr("href", "../oooCourse/Student.html?roomId="+roomId+"&courseId="+courseId);
				}else{
					  alert("您的浏览器版暂不支持该功能，请使用Chrome浏览器或者Firefox浏览器！！！");
					  window.open("http://www.firefox.com.cn/");
					    return false;
				}
			}else{
				$("#goToRoom").attr("href", "../tapedLessons-b/tapedLessons-b.html?roomId="+roomId);
			}
		}
		if(roomID != null && obj.user.groups == "teacher") {
			var roomId = roomID.id;
			$("#goToRoom").text("进入教室");
			if(mode=="ooo"){
				if ("FF" == mb||"Chrome" == mb) {
				    $("#goToRoom").attr("href", "../oooCourse/Teacher.html?roomId="+roomId+"&courseId="+courseId+"&costId="+costId);
				}else{
					alert("您的浏览器版暂不支持该功能，请使用Chrome浏览器或者Firefox浏览器！！！");
				    window.open("http://www.firefox.com.cn/");
				    return false;
				}
			}else{
				$("#goToRoom").attr("href", "../liveRoom/T_liveRoom.html?roomId="+roomId);
			}
		}
		//		设置开始动画
		var top = $("#promptBox").innerHeight();
		$("#promptBox").css({
			"bottom": -top
		});
		$("#promptBox").animate({
			"bottom": 0
		}, 600);
		//	点击关闭按钮
		$("#closeBtn").on("click", function() {
			$("#promptBox").animate({
				"bottom": -top
			}, 600);
		})
		GetRTime(beginDate);
		time1 = setInterval(function() {
			GetRTime(beginDate)
		}, 1000);
	};
	//	创建一对一教室
	function SetClassRoomOoo(costId, courseId,courseName) {
		var t=new Date().getTime();
		$.ajax({
			type: "post",
			url: "/api/view/user/courseRooms/createRoom",
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"costId": costId,
				"courseId": courseId
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				if(data.code==0){
					var ucandomain = data.data.domain;
					var ucanport = data.data.port;
					var ucanlocation = data.data.location;
					var ucanroomID = data.data.id;
                    window.location.href = "../oooCourse/Teacher.html?domain="+ucandomain+"&port="+ucanport+"&location="+ucanlocation+"&roomId="+ucanroomID+"&courseId="+courseId+"&costId="+costId;
				}
			},
			async: true,
			error: function(data) {
				alert("创建失败")
			}
		});
	}
	//	创建教室
	function SetClassRoom(costId, courseId) {
		var t=new Date().getTime();
		$.ajax({
			type: "post",
			url: "/api/view/user/courseRooms/add",
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"costId": costId,
				"courseId": courseId
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var pushRtmpUrl = data.data.pushRtmpUrl;
				if(data.code==0){
                    window.location.href = "../liveRoom/T_liveRoom.html?pushRtmpUrl="+pushRtmpUrl+"&roomId="+data.data.id;
				}
			},
			async: true,
			error: function(data) {
				alert("创建失败")
			}
		});
	}
	//倒计时
	var time1 = null;

	function GetRTime(beginDate) {//2017-03-04 12:00:00
		NowTime = new Date();

		var str=beginDate.replace(/-/g,':').replace(' ',':');
		str=str.split(':');
		EndTime = new Date(str[0],(str[1]-1),str[2],str[3],str[4],str[5]);
		t = EndTime.getTime() - NowTime.getTime();
		var d = 0;
		var h = 0;
		var m = 0;
		var s = 0;
		if(t > 0) {
			d = Math.floor(t / 1000 / 60 / 60 / 24);
			h = Math.floor(t / 1000 / 60 / 60 % 24);
			m = Math.floor(t / 1000 / 60 % 60);
			s = Math.floor(t / 1000 % 60);
			document.getElementById("typeP").innerHTML = "即将上课";
		}
		if(t <= 0) {
			h = "00";
			m = "00";
			// document.getElementById("distanceTIme").innerHTML = "距离上课时间已过"
			clearInterval(time1);
			// document.getElementById("typeP").innerHTML = "正在上课"
		}
		document.getElementById("t_h").innerHTML = h + "时";
		document.getElementById("t_m").innerHTML = (m +1)+ "分";
	}
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
			'minuteTime': minuteTime
		}
	};
	function myBrowser(){
	    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isOpera = userAgent.indexOf("Opera") > -1;
	    if (isOpera) {
	        return "Opera"
	    }; //判断是否Opera浏览器
	    if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    } //判断是否Firefox浏览器
	    if (userAgent.indexOf("Chrome") > -1){
	  return "Chrome";
	 }
	    if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    } //判断是否Safari浏览器
	    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    }; //判断是否IE浏览器
	}
		// //以下是调用上面的函数
	var mb = myBrowser();
})

$(function() {
	//	左面导航点击切换
	$(".left-nva ul li").click(function() {
		$(this).siblings(".left-nva-a").removeClass('bg-c3');
		$(this).addClass('bg-c3');
	});

})


//	***崔杰***