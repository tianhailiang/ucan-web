//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};

var userN = userStr.user.groups;
var rtmpUrl = "";
var roomId = getQueryString("roomId");
var rtmpRecUrl1 = getQueryString("rtmpUrl");
var str = "";
var datas = "";
var t=new Date().getTime();

if(roomId){
$.ajax({
	type: "get",
	url: "/api/view/user/rec/one?token=" + token,
	async: false,
	data: {
		"t":t,
		roomId: roomId
	},
	success: function (data) {
		notlogin(data);
		if(data.code==6012){return false;}
		if(data.data.hlsRecUrl1){
			rtmpUrl = data.data.hlsRecUrl1;
		}else{
			$(".canbox").show();
		}
	}
});
}else if(rtmpRecUrl1){
	rtmpUrl = rtmpRecUrl1;
}else{
	$(".canbox").show();
}

$(".ok").click(function(){
	if(userN == "student"){
		window.location.href = "../myCourseVideo/myCourseVideo.html";
	}else{
		window.location.href = "../myCourseVideo/myCourseVideoTeacher.html";
	}
});
$(".stu-out").click(function(){
	if(userN == "student"){
		window.location.href = "../myCourseVideo/myCourseVideo.html";
	}else{
		window.location.href = "../myCourseVideo/myCourseVideoTeacher.html";
	}
})
//	切换右侧栏目
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

//	判断登陆用户类型
userN == "student" ? getFind("/api/view/user/rec/findstudent") : getFind("/api/view/user/rec/finduser");

//	请求往期课程列表
function getFind(url) {
	var t=new Date().getTime();
	$.ajax({
		type: "get",
		url: url + "?token=" + token+"&t="+t,
		dataType: "json",
		async: false,
		success: function (data) {
			notlogin(data);
			if(data.code==6012){return false;}
			datas = data.data.rows;
			for (var i = 0; i < datas.length; i++) {
				str += '<a class="currentTime-a c-y fn-s2" href="tapedLessons.html?rtmpUrl=' + datas[i].hlsRecUrl1 + '">第' + (i + 1) + '节课 ' + datas[i].name + '</a>';
			}
			$(".stu-talk").append(str);
		},
		error: function () {
			console.log("出错了");
		}
	});
};

var myPlayer = videojs('videoArea');
videojs("videoArea").ready(function () {
	var myPlayer = this;
//	myPlayer.src(rtmpUrl);
    myPlayer.load();
	myPlayer.src({
        type : "video/mp4",
        src : rtmpUrl
 	});
    myPlayer.load();
	myPlayer.play();
	$(".videoArea-dimensions,.video-js").css({
		"width":"100%",
		"height":"100%"
	})
});