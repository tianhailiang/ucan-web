var $ = require('/modules/lib/jquery.js');


module.exports = {
    init: function () {
        this.showNav();
        this.userIf();
        this.searchType();
        this.dropMenu();

    },

    showNav: function () {
        var $nav = $('#main-nav');
        var url = location.href;
        // if(/(index|quxue)\.html/.test(location.href))){
        //     $nav.find('.nav-' + RegExp.$1).addClass('current');
        // }
        switch (!0) {
            case /index\.html/.test(url) || location.pathname === '/':
                $nav.find('.nav-index').addClass('current');
                break;

            case /quxue\.html/.test(url):
                $nav.find('.nav-quxue').addClass('current');
                break;

            case /about\.html/.test(url):
                $nav.find('.nav-about').addClass('current');
                break;

            case /classroom\.html/.test(url):
                $nav.find('.nav-classroom').addClass('current');
                break;
        };
    },

    userIf: function () {
       
        if (sessionStorage.obj) {
            //获取token 
            var userStr = JSON.parse(sessionStorage.obj);
            var token = userStr.user.userToken;
            var userPhoto = "./img/body-header.png";
            if (userStr.user.photoUrl) {
                userPhoto = userStr.user.photoUrl;
            }
			if (userStr.user.name == null) {
				userStr.user.name = "优看教育";
			}
        }
        //	学生列表的url
        var userObjStu = {
            myTimetable: "./pages/myTimetable/myTimetable.html",
            personalInfo: "./pages/studentPersonalInfo/studentPersonalInfo.html",
            courseMan:"./pages/myCourseVideo/myCourseVideo.html"
        };
        //	教师列表的url
        var userObjTea = {
            myTimetable: "./pages/myTimetable/T_myTimetable.html",
            personalInfo: "./pages/teacherPersonalInfo/teacherPersonalInfo.html",
            courseMan:"./pages/courseOpt/courseOpt.html"
        };
        var str = "";
        //	判断登陆user身份

        if (!sessionStorage.obj) {

            str = '<aside class="no-login"><ul><li><a href="./pages/register/register.html">免费注册</a></li><li><a href="./pages/login/login.html">用户登录</a></li></ul></aside>';
        } else if (userStr.user.groups == "teacher") {
            str = '<aside class="is-login"><div class="head-photo"><a href="' + userObjTea.personalInfo + '"><img width="100%" height="100%" src="' + userPhoto + '" alt=""></a></div><div class="user-box"><p class="user-name">' + userStr.user.name + '</p><div class="user-info-box"><a href="#" class="a user-notice-btn"></a><div class="a user-drop-down-btn" id="user-drop-down-btn"><span class="ico-profile"></span><div class="user-drop-down" id="user-drop-down"><div class="little-arrow"></div><div class="shadow-arrow"></div><ul class="true-list"><li><a href="' + userObjTea.myTimetable + '"><span class="ico-img ico-home"></span> 我的主页</a></li><li><a href="' + userObjTea.courseMan + '"><span class="ico-img ico-class-m"></span> 课程管理</a></li><li><a href="' + userObjTea.personalInfo + '"><span class="ico-img ico-setup"></span> 个人设置</a></li><li><a href="javascript:;"><span class="ico-img ico-go-away"></span> 退出登录</a></li></ul></div></div></div></div></aside>';
        } else if (userStr.user.groups == "student") {
            str = '<aside class="is-login"><div class="head-photo"><a href="' + userObjStu.personalInfo + '"><img width="100%" height="100%" src="' + userPhoto + '" alt=""></a></div><div class="user-box"><p class="user-name">' + userStr.user.name + '</p><div class="user-info-box"><a href="#" class="a user-notice-btn"></a><div class="a user-drop-down-btn" id="user-drop-down-btn"><span class="ico-profile"></span><div class="user-drop-down" id="user-drop-down"><div class="little-arrow"></div><div class="shadow-arrow"></div><ul class="true-list"><li><a href="' + userObjStu.myTimetable + '"><span class="ico-img ico-home"></span> 我的主页</a></li><li><a href="' + userObjStu.courseMan + '"><span class="ico-img ico-class-m"></span>课程管理</a></li><li><a href="' + userObjStu.personalInfo + '"><span class="ico-img ico-setup"></span> 个人设置</a></li><li><a href="javascript:;"><span class="ico-img ico-go-away"></span> 退出登录</a></li></ul></div></div></div></div></aside>';
        }
        
        $(".logo").after(str);

        //	退出登录
        var len = $(".true-list>li").length;

        $(".true-list>li").eq(len - 1).click(function () {

            $.post("/api/logout", {
                token: token
            });
            sessionStorage.obj = "";
            window.location = "../../index.html";
        });
    },
    searchType: function () {
        var searchType = 0;
        $(".search>select").change(function () {
            searchType = $(this).val();
        });
        $(".search>a").click(function () {
            var value = $(".search>input").val();
            var url = "./pages/search/search.html?value=" + value + "&searchType=" + searchType;
            window.open(url);
        })
    },

    dropMenu: function () {
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
    }

};
