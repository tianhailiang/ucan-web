$(".comm-i a").toggle(function () {
	$(".stu-comment").animate({
		"width": "0"
	}, 300);
	$(".videoContent").animate({
		"width": "100%"
	}, 300);
	$(".triangle-right").css("background", "url(../../img/left-right-san.png) no-repeat");
}, function () {
	$(".stu-comment").animate({
		"width": "20%"
	}, 300);
	$(".videoContent").animate({
		"width": "80%"
	}, 300);
	$(".triangle-right").css("background", "url(../../img/left-right-san.png) no-repeat -17px");
});
//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};
//重新转换为对象
var userN = userStr.user.groups;
var teacherId = "";
var courseId = "";
var roomId = getQueryString("roomId");
var str = "";
var courseStr = "";
var roomUrl = "";
var index;

//获取直播室rtmp地址
$.ajax({
	type: "post",
	url: "/api/view/user/weik/one?token=" + token,
	dataType: "json",
	async: false,
	data: {
		"t":new Date().getTime(),
		roomId: roomId
	},
	success: function (data) {
		notlogin(data);
		if(data.code==6012){return false;}
		roomUrl = data.data.liveUrlOfPC;
		teacherId = data.data.teacherId;
		courseId = data.data.cost.coursePlans.courses.id;
		
		var datas = data.data.cost.coursePlans;

		if(datas.courses.ucanFile){
			datas.courses.ucanFile = datas.courses.ucanFile.newUrl;
		}else{
			datas.courses.ucanFile = "../../img/default-course.png";
		}
		if(datas.courses.teacher.courseMode == "ooo"){
			datas.courses.teacher.courseMode = "一对一";
		}else{
			datas.courses.teacher.courseMode = "直播课";
		}
		
		var beginTime = datas.beginDate.split(" ")[0];
		var endTime = datas.endDate.split(" ")[0];
		
		courseStr += '<div class="c-title-l fl"><img src="' + datas.courses.ucanFile + '" width="100%" height="100%" alt=""></div><div class="c-title-r fl"><h3 class="fn-c0 fn-s0 fn-w6">' + datas.courses.name + '</h3><p class="teach-name fn-c0 fn-w4">授课教师：' + datas.courses.teacher.name + '</p><div class="teach-time fn-s2"><p>' + beginTime + '开课 - ' + endTime + '结课</p><p>' + datas.courses.teacher.courseMode + '</p></div><div class="c-renzheng">';
		if ((datas.courses.teacher.regFlag & 4) != 0) {
			courseStr += '<img src="../../img/real-name.png" alt="">';
		}
		if ((datas.courses.teacher.regFlag & 8) != 0) {
			courseStr += ' <img src="../../img/renzheng.png" alt="">';
		}
		if ((datas.courses.teacher.regFlag & 32) != 0) {
			courseStr += ' <img src="../../img/suishi.png" alt="">';
		}
		courseStr += '</div></div>';

		$(".course-title").html(courseStr);
	},
	error: function () {
		console.log("出错了");
	}
});

//将new Date格式的时间转换成yyyy-mm-dd hh:mm
	function chgToTime(str) {
		 var y = str.getFullYear();
		 var mth = str.getMonth() + 1;
		 var d = str.getDate();
		 var h = str.getHours();
		 h < 10 ? ( h="0" + h ) :  h ;
		 var m = str.getMinutes();
		m < 10 ? ( m="0" + m ) :  m ;
		 var s = str.getSeconds();
		s < 10 ? ( s="0" + s ) :  s ;
		return y + "-" + mth + "-" + d + " " + h + ":" + m +":" + s;
	}
	setInterval('updateTime()',1000);
	function updateTime(){
			$("p.currentTime").html(chgToTime(new Date()));
	}
//	获取直播间成员
$.ajax({
	type: "get",
	url: "/api/view/user/courseRooms/findUser?token=" + token,
	dataType: "json",
	data: {
		"t":new Date().getTime(),
		roomId: roomId
	},
	success: function (data) {
		notlogin(data);
		if(data.code==6012){return false;}
		for (var i = 0; i < data.data.length; i++) {
			if(!data.data[i].user.ucanFile){
				data.data[i].user.ucanFile = "../../img/body-header.png";
			}else{
				data.data[i].user.ucanFile = data.data[i].user.ucanFile.newUrl;
			}
			str += '<div class="talk-user"><img src="' + data.data[i].user.ucanFile + '" width="26px" height="26px" alt=""><span class="talk-username c-o">' + data.data[i].user.name + '</span></div>';
		}
		$(".stu-talk").html(str);
	},
	error: function () {
		console.log("出错了");
	}
});
setInterval(function findUser(){
		str="";
		$.ajax({
			type: "get",
			url: "/api/view/user/courseRooms/findUser?token=" + token,
			dataType: "json",
			data: {
				"t":new Date().getTime(),
				"roomId": roomId
			},
			success: function (data) {
				notlogin(data);
				if(data.code==6012){return false;}
				if(data.code == 0){
					for (var i = 0; i < data.data.length; i++) {
						if(!data.data[i].user.ucanFile){
							data.data[i].user.ucanFile = "../../img/body-header.png";
						}else{
							data.data[i].user.ucanFile = data.data[i].user.ucanFile.newUrl;
						}
						str += '<div class="talk-user"><img src="' + data.data[i].user.ucanFile + '" width="26px" height="26px" alt=""><span class="talk-username c-o">' + data.data[i].user.name + '</span></div>';
					}
					// $("p.currentTime").html(chgToTime(new Date()));
					$(".stu-talk").html(str);
				}
				
			},
			error: function() {
				console.log("出错了");
			}
		});
	},3000);
//	*****************弹出框&& 评价的提交
//	评价小红花
$(".c-score img").click(function () {
	for (var i = 0; i < $(this).index(); i++) {
		$(".c-score img").eq(i).attr("src", "../../img/flower.png");
		$(this).nextAll().attr("src", "../../img/flower-g.png");
	}
	index = $(this).index();
});

//	学生提交评价
$(".s-submit").click(function () {
	var value = $(".text-area").val();
	if (index == undefined) {
		index = 1;
	}
	if (value.length > 200) {
		alert("字数太多了，请不要超过200");
	}else if(value == "请输入对老师本堂课的评价..."){
		alert("评价不能为空!");
	}else {
		$.post("/api/view/user/courses/evaluations/add?token=" + token, {
			teacherId: teacherId,
			evaluationFraction: index,
			evaluation: value,
			courseId: courseId
		}, function (data) {
			if(data.code == 0){
				$(".popup-fix").slideToggle();
				history.go(-1);
			}else{
				alert(data.message);
			}
		});
	}
});

//	弹出框 居中
$(function () {
	var popupW = ($(".popup-fix").width()) / 2;
	var popupH = ($(".popup-fix").height()) / 2;
	$(".popup-fix").css("margin-left", -popupW);
	$(".popup-fix").css("margin-top", -popupH);

	$(".s-off").on("click", function () {
		$(".popup-fix").slideToggle();
	});
});
//	*****************弹出框&& 评价的提交

//单击退出
$(".stu-out").click(function () {
	offRoom(roomId);
	$(".popup-fix").slideToggle();
});

//关闭浏览器事件
$(window).bind('unload', function () {
	offRoom(roomId);
	if (window.is_confirm !== false)
		return '您可能有数据没有保存';
});

//	视频播放器插件
//$("#videoArea source").attr("src", roomUrl);
var myPlayer = videojs('videoArea');
videojs("videoArea").ready(function () {
	var myPlayer = this;
	myPlayer.src({
            type : "rtmp/flv",  
            src : roomUrl  
        });
//  myPlayer.reset();
	$(".vjs-play-control").hide();
    myPlayer.load();  
	myPlayer.play();
	$(".videoArea-dimensions,.video-js").css({
		"width":"100%",
		"height":"100%"
	})
});

//发送学生退出直播间状态
function offRoom(roomId) {
	var t=new Date().getTime();
	$.ajax({
		type: "post",
		url: "/api/view/user/courseRooms/closeRoom?token=" + token,
		async: false,
		data: {
			"t":t,
			roomId: roomId
		},
		success: function (data) {
			notlogin(data);
			if(data.code==6012){return false;}
		}
	});
}

//	2017-2-21 换算成 2月21日
function DateS(time) {
	var date = new Date(time);
	var mon = date.getMonth() + 1;
	var day = date.getDate();
	var nowDay = mon + "月" + day + "日";
	return nowDay
}
