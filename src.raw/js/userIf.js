$.getScript("../../js/json.js");
if (sessionStorage.obj) {
	//获取token 
	var userStr = JSON.parse(sessionStorage.obj);
	var token = userStr.user.userToken;
	var userPhoto = "../../img/body-header.png";
	if (userStr.user.photoUrl) {
		userPhoto = userStr.user.photoUrl;
	}
	if (userStr.user.name == null) {
		userStr.user.name = "优看教育";
	}
}
userMode();
//	搜索类型 判断 跳转搜索结果
var searchType = "";
var optionValue = 0;
$(".search>select").change(function () {
	optionValue = $(this).val();
});
$(".search>a").click(function () {
	var value = "../search/search.html?searchType=" + optionValue + "&value=";
	value += $(".search>input").val();
	window.open(value, "_self");
});

function userMode() {
	//	学生列表的url
	var userObjStu = {
		myTimetable: "../myTimetable/myTimetable.html",
		personalInfo: "../studentPersonalInfo/studentPersonalInfo.html",
		courseMan: "../myCourseVideo/myCourseVideo.html"
	};
	//	教师列表的url
	var userObjTea = {
		myTimetable: "../myTimetable/T_myTimetable.html",
		personalInfo: "../teacherPersonalInfo/teacherPersonalInfo.html",
		courseMan: "../courseOpt/courseOpt.html"
	};
	var str = "";
	var leftNav = "";
	//	判断登陆user身份
	if (!sessionStorage.obj) {
		str = '<aside class="no-login"><ul><li><a href="../register/register.html">免费注册</a></li><li><a href="../login/login.html">用户登录</a></li></ul></aside>';
	} else if (userStr.user.groups == "teacher") {
		str = '<aside class="is-login"><div class="head-photo"><a href="' + userObjTea.personalInfo + '"><img width="100%" height="100%" src="' + userPhoto + '" alt=""></a></div><div class="user-box"><p class="user-name">' + userStr.user.name + '</p><div class="user-info-box"><a href="#" class="a user-notice-btn"></a><div class="a user-drop-down-btn" id="user-drop-down-btn"><span class="ico-profile"></span><div class="user-drop-down" id="user-drop-down"><div class="little-arrow"></div><div class="shadow-arrow"></div><ul class="true-list"><li><a href="' + userObjTea.myTimetable + '"><span class="ico-img ico-home"></span> 我的主页</a></li><li><a href="' + userObjTea.courseMan + '"><span class="ico-img ico-class-m"></span> 课程管理</a></li><li><a href="' + userObjTea.personalInfo + '"><span class="ico-img ico-setup"></span> 个人设置</a></li><li><a href="#"><span class="ico-img ico-go-away"></span> 退出登录</a></li></ul></div></div></div></div></aside>';

		if ($(".homePage")) {
			$(".homePage").attr("href", userObjTea.myTimetable);
			$(".setting").attr("href", userObjTea.personalInfo);

			//获取username&id
			getUsername();

			leftNav = '<ul><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myTimetable/T_myTimetable.html">我的课表</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../courseOpt/courseOpt.html">课程设置</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myCourseVideo/myCourseVideoTeacher.html">直播回放</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myStudent/myStudent.html">学生管理</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../teacherEvaluate/teacherEvaluate.html">评价管理</a></li></ul>';

			$(".left-nva").html(leftNav);
		}

	} else if (userStr.user.groups == "student") {
		str = '<aside class="is-login"><div class="head-photo"><a href="' + userObjStu.personalInfo + '"><img width="100%" height="100%" src="' + userPhoto + '" alt=""></a></div><div class="user-box"><p class="user-name">' + userStr.user.name + '</p><div class="user-info-box"><a href="#" class="a user-notice-btn"></a><div class="a user-drop-down-btn" id="user-drop-down-btn"><span class="ico-profile"></span><div class="user-drop-down" id="user-drop-down"><div class="little-arrow"></div><div class="shadow-arrow"></div><ul class="true-list"><li><a href="' + userObjStu.myTimetable + '"><span class="ico-img ico-home"></span> 我的主页</a></li><li><a href="' + userObjStu.courseMan + '"><span class="ico-img ico-class-m"></span>课程管理</a></li><li><a href="' + userObjStu.personalInfo + '"><span class="ico-img ico-setup"></span> 个人设置</a></li><li><a href="#"><span class="ico-img ico-go-away"></span> 退出登录</a></li></ul></div></div></div></div></aside>';

		if ($(".homePage")) {
			$(".homePage").attr("href", userObjStu.myTimetable);
			$(".setting").attr("href", userObjStu.personalInfo);

			//获取username&id
			getUsername();

			leftNav = '<ul><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myTimetable/myTimetable.html">我的课表</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myTeacher/myTeacher.html">我的老师</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myCourseVideo/myCourseVideo.html">我的视频课</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../studentEvaluate/studentEvaluate.html">我的评价</a></li><li class="left-nva-a bg-c2"><a class="fn-c0" href="../myCollection/myCollection.html">我的收藏</a></li></ul>'

			$(".left-nva").html(leftNav);
		}
	}
	$(".logo").after(str);

	//判断页面地址
	var url = location.href;
	switch (!0) {
		case /T_myTimetable\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="t"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(0).addClass('bg-c3');
			break;

		case /myTeacher\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="s"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(1).addClass('bg-c3');
			break;

		case /myCourseVideo\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="s"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(2).addClass('bg-c3');
			break;

		case /studentEvaluate\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="s"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(3).addClass('bg-c3');
			break;

		case /myCollection\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="s"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(4).addClass('bg-c3');
			break;

		case /myTimetable\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="s"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(0).addClass('bg-c3');
			break;

		case /courseOpt\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="t"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(1).addClass('bg-c3');
			break;

		case /myCourseVideoTeacher\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="t"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(2).addClass('bg-c3');
			break;

		case /myStudent\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="t"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(3).addClass('bg-c3');
			break;

		case /teacherEvaluate\.html/.test(url):
			var iden=notlogin();
			if(iden&&iden!="t"){
				alert("权限不足，请更换账号后重试");
				window.history.go(-1);
			}
			$(".left-nva>ul>li").eq(4).addClass('bg-c3');
			break;

		case /courseList\.html/.test(url):
			$('header>nav>ul>li:eq(3)>a').addClass('current');
			break;

		case /teacherList\.html/.test(url):
			$('header>nav>ul>li:eq(2)>a').addClass('current');
			break;
	}

	//	鼠标经过显示隐藏
	var timer = null;
	var $dropDownList = $('#user-drop-down'),
		$dropDownMenu = $('#user-drop-down-btn');
	$dropDownMenu.hover(
		function () {
			if (timer) {
				clearTimeout(timer);
			}
			$dropDownList.show();
		},
		function () {
			timer = setTimeout(function () {
				$dropDownList.hide();
			}, 300)
		}
	);
	//	退出登录
	var len = $(".true-list>li").length;
	$(".true-list>li").eq(len - 1).click(function () {
		$.post("/api/logout", {
			token: token
		});
		sessionStorage.obj = "";
		window.location = "../../index.html";
	});
}

//用户登录验证
function notlogin(data) {
	if ((data&&data.code != 0)||(!sessionStorage.obj)) {
		if (data&&data.code == 6012) {
			//console.log("notlogin");
			sessionStorage.obj="";
			alert(data.message);
			location.href = "../login/login.html";
			return  false;
		}else if(!sessionStorage.obj){
			alert("您尚未登陆，将前往登陆页面...");
			location.href = "../login/login.html";
			return  false;
		}else{
			alert(data.message);
			return false;
		}
	}else if(userStr.user.groups == "teacher"){
		return "t";
	}else if(userStr.user.groups == "student"){
		return "s";
	}else{
		return "n";
	}
}

//追加学生信息
function getUsername() {
	var studentUser = userStr.user.name;
	var studentI = userStr.user.id;
	var zeroNum1 = "ID：";
	var zeroNum2 = "0";
	studentI = studentI.toString();
	var len = 5 - studentI.length;
	for (var b = 0; b < len; b++) {
		zeroNum1 += zeroNum2
	}
	studentI = zeroNum1 + studentI;
	$(".frame-user>p").eq(0).text(studentUser);
	$(".frame-user>p").eq(1).text(studentI);
	$(".frame-head>img").attr("src", userPhoto);
}