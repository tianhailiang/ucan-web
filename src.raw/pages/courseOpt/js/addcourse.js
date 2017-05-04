var picId = null, //用户上传图片时返回的id
	topic, //课程科目ID
	model, //课程类型
	TOTAL, //已发布的课程总数
	pageSize, //分多少页展示
	SIZE = 2, //每页展示的数量
	roomUrl = []; //点击创建房间后返回的房间URL
	var flagchongtu=false;
//将yyyy-mm-dd转换成{day:"mm月dd日",stime:"hh:mm"}
function chgToZh(str) {
	var time = str.split(" "),
	obj = {};
	var day = time[0].split("-");
	day = day[1] + "月" + day[2] + "日";
	obj.day = day;
	day = time[1].slice(0, time[1].lastIndexOf(":"));
	obj.stime = day;
	return obj;
}
var deepCopy = function(o) {
    if (o instanceof Array) {
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;

    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
}
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
//以下是调用上面的函数
var mb = myBrowser();
//	创建一对一教室
var courseName = '';
function SetClassRoomOoo(costId, courseId) {
		var t=new Date().getTime();
		$.ajax({
			type: "post",
			url: "/api/view/user/courseRooms/createRoom",
			dataType: 'json',
			data: {
				"t":t,
				"token": token,
				"costId": costId,
				"courseId": courseId
			},
			success: function(data) {
				notlogin(data);
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
//点击创建教室
$(".frame-rg.bg-c2").on("click", "ul.sc-kuang .createRoomooo", function() {
		var costId = $(this).parent().attr("data-costId");
		var courseId = $(this).parent().attr("data-courseId");
		courseName = $(this).parent().siblings('.sc-two').find(".course-detail h3").text();
		costId = parseInt(costId);
		courseId = parseInt(courseId);
		if ("FF" == mb || "Chrome" == mb) {
			SetClassRoomOoo(costId, courseId);
		}else{
			alert("您的浏览器版暂不支持该功能，请使用Chrome浏览器或者Firefox浏览器！！！");
			window.open("http://www.firefox.com.cn/");
			return false;
		}
});
//初始化老师已发布课程部分

function queryCourses(page) {
	var stamp=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/user/costs/findTeacherPage?token=" + token+"&t="+stamp,
		dataType: "json",
		async:false,
		data: { "page": page, "size": SIZE, "removeFlag": 0,"sort":'{"keys":"beginTime","sortType":"asc"}' },
		success: function(data) {
			notlogin(data);
			if(data.code==0){
				$("ul.sc-kuang").remove();
				TOTAL = data.data.total;//老师已发布的课程数量
				var searchData = data.data.rows;//搜索到的数据
				var html = "",btnTxt;
				pageSize = Math.ceil(TOTAL / SIZE);
				for(var i = 0; i < searchData.length; i++) {
					var spanText = "",dis, imgUrl;
					var durration = howFar(searchData[i].beginTime,searchData[i].endTime);
					if((searchData[i].rooms == null && durration == "0")) {
						spanText = "<span>等待创建教室</span>";
						btnTxt="创建教室";
						if(searchData[i].coursePlans.courses.mode=="ooo"){
							dis = "createRoomooo";
						}else{
							dis = "kai";
						}
					}else if(searchData[i].rooms == null && durration == "-1"){
						spanText = "<span>该课程已失效</span>";
						btnTxt="进入教室";
						dis="dis";
					}else if(searchData[i].rooms != null && searchData[i].rooms.status == 0) {
						var now=new Date();
						var current=""+now.getFullYear();//2017-03-17 23:00:00
						current+="-"+fillPre2(now.getMonth()+1)+"-"+fillPre2(now.getDate())+" "+fillPre2(now.getHours())+":"+fillPre2(now.getMinutes())+":00";
						if(searchData[i].endTime<current){
							spanText = "<span>教室未正常关闭</span>";
							dis = "guanbi";
							btnTxt="关闭教室";
						}else{
							spanText = "<span>正在上课</span>";
							btnTxt="进入教室";
							if(searchData[i].coursePlans.courses.mode=="ooo"){
								dis = "createRoomooo";
							}else{
								dis = "kai";
							}
						}
					} else if((searchData[i].rooms != null && searchData[i].rooms.status == 1) ) {
						spanText = "<span>已经结束</span>";
						dis = "dis";
						btnTxt="进入教室";
					} else if(searchData[i].rooms == null) {
						spanText = "<span>待上课</span><span>距离上课还有</span><span>" + durration + "</span>";
						dis = "dis";
						btnTxt="进入教室";
					}
					var courseMode = searchData[i].coursePlans.courses.mode;
					if(courseMode == "ooo") courseMode = "一对一";
					else courseMode = "班课";
					var sobj = chgToZh(searchData[i].beginTime);
					var eobj = chgToZh(searchData[i].endTime);
					if(!searchData[i].coursePlans.courses.ucanFile) {
						imgUrl = "../../img/default-course.png";
					} else {
						imgUrl = searchData[i].coursePlans.courses.ucanFile.newUrl;
					}
					if(!searchData[i].rooms){
						var dataRoom="";
					}else{
						var dataRoom=searchData[i].rooms.id;
					}
					html+='<ul class="sc-kuang" data-courseId="' + searchData[i].id + '">';
					html+='<li class="list-type"><div><span data-haha="' + (i + 1) + '"></span></div></li>';
					html+='<li class="sc-two">';
					html+='<img src="' + imgUrl + '"/>';
					html+='<div class="course-detail">';
					html+='<h3 title="' + searchData[i].coursePlans.courses.name + '">' + searchData[i].coursePlans.courses.name + '</h3>';
					html+='<p><label>约课编号</label>：<span>' + fillPre(searchData[i].id) + '</span></p>';
					html+='<p><label>在线授课</label></p>';
					html+='<p><button type="button">' + courseMode + '</button></p>';
					html+='</div></li>';
					html+='<li class="sc-one">';
					html+='<span>' + sobj.day + '</span>';
					html+='<span>' + sobj.stime + '-' + eobj.stime + '</span>';
					html+='</li><li class="sc-one">' + spanText + '</li>';
					html+='<li class="sc-one" data-costId="' + searchData[i].id +'" data-roomId="'+dataRoom+ '" data-courseId="' + searchData[i].coursePlans.courses.id + '">';
					html+='<button class="btn ' + dis + '" type="button">'+btnTxt+'</button></li></ul>';
				}
				$("div.sc-kuang").before(html);
				//pageSize = Math.ceil(TOTAL / SIZE);
				//if(pageSize <= 1) {
				//	$("ul.pages").html("").css("display", "none");
				//} else if(pageSize <= 6) {
				//	html = "<li class='cur'>1</li>";
				//	for(i = 1; i < pageSize; i++) {
				//		html += '<li>' + (i + 1) + '</li>';
				//	}
				//	$("ul.pages").html(html).css("display", "block");
				//} else {
				//	html = "<li class='cur'>1</li>";
				//	for(i = 1; i < 5; i++) {
				//		html += '<li>' + (i + 1) + '</li>';
				//	}
				//	html += "<li>尾页</li>";
				//	$("ul.pages").html(html).css("display", "block");
				//}
			}
		},
		error: function(err) {
			console.log(err.message);
		}
	});
}
$(function() {
	//老师对应的课
	queryCourses(0);
	//查询所有的科目
	//
	laypage({
		cont: $('#pages'), //容器。值支持id名、原生dom对象，jquery对象,
		pages: pageSize, //总页数
		skip: true, //是否开启跳页
		skin: '#6a3906',
		groups: 3, //连续显示分页数
		jump: function(obj, first) {
			if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				query((obj.curr) - 1);
			}
		}
	});
	var t=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/guest/courses/courseTopics?t="+t,
		dataType: "json",
		success: function(data) {
			var searchData = data.data;
			var html = "";
			for(var i = 0; i < searchData.length; i++) {
				html += '<li data-id=' + searchData[i].id + '>' + searchData[i].topic + '</li>';
			}
			$(".sc-subject ul").html(html);
		},
		error: function(err) {
			console.log(err.message);
		}
	});
	//防止用户浏览器记住选择
	$("[name=subject]").val("");
	$("[name=ctype]").val("");
});
function fillPre2(num){
	var str = "00" + num;
	str = str.slice(str.length - 2);
	return str;
}
//点击页码时触发
function query(page) {
	$("div.sc-kuang").css({ "justify-content": "center" }).children(".list-type").css({ "display": "none" }).siblings(".btn").css({ "display": "none" });
	$("div.sc-kuang .list-type").html("<div><span></span></div>全选");
	var stamp=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/user/costs/findTeacherPage?token=" + token+"&t="+stamp,
		dataType: "json",
		async: false,
		data: { "page": page, "size": SIZE, "removeFlag": 0,"sort":'{"keys":"beginTime","sortType":"asc"}' },
		success: function(data) {
			notlogin(data);
			if(data.code==0){
				$("ul.sc-kuang").remove();
				TOTAL = data.data.total;
				var searchData = data.data.rows;
				var html = "";
				pageSize = Math.ceil(TOTAL / SIZE);
				for(var i = 0; i < searchData.length; i++) {
					var sapnText = "",dis, imgUrl,btnTxt;
					var durration = howFar(searchData[i].beginTime,searchData[i].endTime);
					if((searchData[i].rooms == null && durration == "0")) {
						sapnText = "<span>等待创建教室</span>";
						btnTxt="创建教室";
						if(searchData[i].coursePlans.courses.mode=="ooo"){
							dis = "createRoomooo";
						}else{
							dis = "kai";
						}
					} else if(searchData[i].rooms == null && durration == "-1"){
						sapnText = "<span>该课程已失效</span>";
						btnTxt="进入教室";
						dis="dis";
					}else if(searchData[i].rooms != null && searchData[i].rooms.status == 0) {
						var now=new Date();
						var current=""+now.getFullYear();//2017-03-17 23:00:00
						current+="-"+fillPre2(now.getMonth()+1)+"-"+fillPre2(now.getDate())+" "+fillPre2(now.getHours())+":"+fillPre2(now.getMinutes())+":00";
						if(searchData[i].endTime<current){
							sapnText = "<span>教室未正常关闭</span>";
							dis = "guanbi";
							btnTxt="关闭教室";
						}else{
							sapnText = "<span>正在上课</span>";
							btnTxt="进入教室";
							if(searchData[i].coursePlans.courses.mode=="ooo"){
								dis = "createRoomooo";
							}else{
								dis = "kai";
							}
						}
					} else if((searchData[i].rooms != null && searchData[i].rooms.status == 1) ) {
						sapnText = "<span>已经结束</span>";
						dis = "dis";
						btnTxt="进入教室";
					} else if(searchData[i].rooms == null) {
						sapnText = "<span>待上课</span><span>距离上课还有</span><span>" + durration + "</span>";
						dis = "dis";
						btnTxt="进入教室";
					}
					var courseMode = searchData[i].coursePlans.courses.mode;
					if(courseMode == "ooo") courseMode = "一对一";
					else courseMode = "班课";
					var sobj = chgToZh(searchData[i].beginTime);
					var eobj = chgToZh(searchData[i].endTime);
					if(!searchData[i].coursePlans.courses.ucanFile) {
						imgUrl = "../../img/default-course.png";
					} else {
						imgUrl = searchData[i].coursePlans.courses.ucanFile.newUrl;
					}
					if(!searchData[i].rooms){
						var dataRoom="";
					}else{
						var dataRoom=searchData[i].rooms.id;
					}
					html+='<ul class="sc-kuang" data-courseId="' + searchData[i].id + '">';
					html+='<li class="list-type"><div>';
					html+='<span data-haha="' + (i + 1) + '"></span>';
					html+='</div></li><li class="sc-two">';
					html+='<img src="' + imgUrl + '">';
					html+='<div class="course-detail">';
					html+='<h3>' + searchData[i].coursePlans.courses.name + '</h3>';
					html+='<p><label>约课编号</label>：<span>' + fillPre(searchData[i].id) + '</span></p>';
					html+='<p><label>在线授课</label></p><p>';
					html+='<button type="button">' + courseMode + '</button>';
					html+='</p></div></li>';
					html+='<li class="sc-one"><span>' + sobj.day + '</span><span>' + sobj.stime + '-' + eobj.stime + '</span></li>';
					html+='<li class="sc-one">' + sapnText + '</li>';
					html+='<li class="sc-one" data-costId="' + searchData[i].id +'" data-roomId="'+dataRoom+ '" data-courseId="' + searchData[i].coursePlans.courses.id + '">';
					html+='<button class="btn ' + dis + '" type="button">'+btnTxt+'</button>';
					html+='</li></ul>';
				}
				$("div.sc-kuang").before(html);
			}
		},
		error: function(err) {
			console.log(err.message);
		}
	});
}
//创建教室
var roomId;
function SetClassRoom(costId, courseId) {
	var t=new Date().getTime();
	$.ajax({
		type: "post",
		url: "/api/view/user/courseRooms/add",
		dataType: 'json',
		data: {
			"t":t,
			"token": token,
			"costId": costId,
			"courseId": courseId
		},
		success: function(data) {
			notlogin(data);
			if(data.code==0){
				roomId=data.data.id;
				var pushRtmpUrl = data.data.pushRtmpUrl;
				roomUrl[0] = 0;
				roomUrl[1] = pushRtmpUrl.slice(0, pushRtmpUrl.lastIndexOf("/") + 1);
				roomUrl[2] = pushRtmpUrl.slice(pushRtmpUrl.lastIndexOf("/") + 1);
				var html = '<div class="sc-pop">';
				html+='<a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
				html+='<div class="sc-title"><span>教室详情</span></div>';
				html+='<div class="sc-date">';
				html+='<div class="classdetail"><span>FMS URL:</span><span>' + roomUrl[1] + '</span></div>';
				html+='<div class="classdetail"><span>播放路径/串码流:</span><span>' + roomUrl[2] + '</span></div></div>';
				html+='<div class="c-form"><a class="bg-c1 already">确定</a><a href="javascript:;" class="bg-c4">取消</a></div></div>';
				$(".canbox-3").html(html).css({ "display": "block" });
			}
		},
		async: true,
		error: function(err) {
			console.log(err.message);
		}
	});
}
//计算还有多久开课，0表示正在上课，-1表示已经结束，否则返回还有多久开课
function howFar(str,end) {
	var current = new Date();
	str=str.replace(/-/g,':').replace(' ',':').split(':');
	end=end.replace(/-/g,':').replace(' ',':').split(':');
	var stime=new Date(str[0],(str[1]-1),str[2],str[3],str[4],str[5]);
	var etime=new Date(end[0],(end[1]-1),end[2],end[3],end[4],end[5]);
	if(!!window.ActiveXObject || "ActiveXObject" in window) { 
		current=current.getTime();
		stime=stime.getTime();
		etime=etime.getTime();
	}
	var durration = "";
	var dd = stime - current;
	if(dd<= 1800001&&etime>current) {//开课前半个小时
		durration = 0;
		return durration;
	} else if(etime<=current) {//已经过了课程的结束时间
		durration = "-1";
		return durration;
	}
	var durring = Math.floor(dd / 86400000); //计算有多少天
	if(durring >= 1) {
		durration += durring + "天";
		dd = dd - durring * 86400000;
	}
	durring = Math.floor(dd / 3600000); //计算有多少小时
	if(durring >= 1) {
		durration += durring + "小时";
		dd = dd - durring * 3600000;
	}
	durring = Math.floor(dd / 60000); //计算有多少分钟
	if(durring >= 1) {
		durration += durring + "分钟";
	}
	return durration;
}
//将arr数组按attr先后排序，冒泡排序
function bubbleSort(arr, attr) {
	var i = arr.length,j,tempExchangVal;
	while(i > 0) {
		for(j = 0; j < i - 1; j++) {
			if(arr[j][attr] > arr[j + 1][attr]) {
				tempExchangVal = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = tempExchangVal;
			} 
		}
		i--;
	}
	return arr;
}
//判断添加的课节中是否有冲突，若有，则flagchongtu = true;
function chongtu(arr) {
	flagchongtu = false;
	if(arr.length > 1) {
		MAX = arr[0].date;
		MIN = arr[0].date;
		for(var j = 0; j < arr.length - 1; j++) {
			if(arr[j].date > MAX) {MAX = arr[j].date;}
			if(arr[j].date < MIN) {MIN = arr[j].date;}
			var stime = arr[j].stime,
			etime = arr[j].etime;
			if(arr[j].date == arr[j + 1].date) {
				var one = arr[j + 1].stime,
				two = arr[j + 1].etime;
				if((one >= stime && one <= etime) || (two >= stime && two <= etime) || (one <= stime && two >= etime) || (one >= stime && two <= etime)) {
					flagchongtu = true;
					return;
				}
			} else {
				continue;
			}
		}
	}
}
//计算每节课的结束时间
function chgtoend(hour, min, durring) {
	var obj = {};
	obj.durring = durring;
	var numMin = parseInt(min); //将输入的分钟化为数字
	var numHour=parseInt(hour);//将输入的小时化为数字
	var strHour = fillPre2(hour); //将小时化为字符串
	min=fillPre2(min);//将输入的分钟化为字符串
	durring = parseInt(durring); //将输入的时长化为数字
	obj.stime = strHour + ":" + min;
	hour=numHour*60+numMin+durring;//结束时间转换成分钟
	numHour=Math.floor(hour/60);
	numMin=hour-numHour*60;
	if(numHour>=24){
		numHour=numHour%24;
	}
	obj.etime = fillPre2(numHour) + ":" + fillPre2(numMin);
	return obj;
}
//获取all的内容，并填充到页面
function appendhtml(arr) {
	var html = "";
	for(i = 0; i < arr.length; i++) {
		html += '<li><span class="index">第' + (i + 1) + '节课</span>';
		html += '<span class="sc-time">' + arr[i].date + '&nbsp;&nbsp;' + arr[i].stime + '-' + arr[i].etime + '</span>';
		html += '<span class="sc-content">' + arr[i].costAbout + '</span>';
		html += '<button class="btn" type="button" data-order=' + i + '>编辑课节</button>';
		html += '<button class="btn del" type="button">删除课节</button></li>';
	}
	html += '<li class="btn-g"><button class="btn sc-pi" type="button">批量添加课节</button>';
	html += '<button class="btn sc-addone" type="button">添加一个课节</button></li>';
	html += '<li class="btn-g"><button class="btn sc-chgall" type="button">整体修改时间</button>';
	html += '<button class="btn del-all" type="button">删除全部课节</button></li>';
	$(".sc-plan").html(html).css({ "display": "block" }).siblings(".btn").css({ "display": "none" });
	$(".canbox").slideUp();
}
//点击删除课节弹框中的确认按钮触发
function del(n) {
	all.splice(n, 1);
	chongtu(all);
	appendhtml(all);
}
//不足五位填充0
function fillPre(num) {
	var str = "0000" + num;
	str = str.slice(str.length - 5);
	return str;
}
//将当前时间一个小时后转换成yyyy-mm-dd hh:mm:00
function timeChg(){
	var time=new Date();
	var yy=time.getFullYear();
	var mon=time.getMonth()+1;
	var date=time.getDate();
	var hh=time.getHours();
	var minute=time.getMinutes();
	time=yy+"-"+fillPre2(mon)+"-"+fillPre2(date)+" "+fillPre2(hh)+":"+fillPre2(minute)+":00";
	return time;
}
//向select中追加option
function appendsel(){
	var hourhtml="",minuhtml="",durhtml="";
	var hour=7,minu=0,dur=15;
	for(var i=0;i<17;i++){
		hourhtml+='<option value="'+fillPre2(hour)+'">'+fillPre2(hour)+'</option>';
		hour++;
	}
	for(var i=0;i<12;i++){
		minuhtml+='<option value="'+fillPre2(minu)+'">'+fillPre2(minu)+'</option>';
		minu+=5;
	}
	for(var i=0;i<12;i++){
		durhtml+='<option value="'+dur+'">'+dur+'</option>';
		dur+=15;
	}
	$(".t-hour").html(hourhtml);
	$(".t-minu").html(minuhtml);
	$(".t-durration").html(durhtml);
}
appendsel();
//为每个弹框添加提示
$(".sc-title p").html("<b>开始时间</b>请选择&nbsp;当前时间&nbsp;以后的时间段");
//点击批量管理
$(".sc-top .btn").click(function() {
	$("div.sc-kuang").css({ "justify-content": "space-between" }).children().css({ "display": "block" });
	//if($("div.sc-kuang ul.pages").html() == "") $("div.sc-kuang ul.pages").css({ "display": "none" });
	$("ul.sc-kuang li.list-type").css({ "display": "flex" });
});
//取消批量管理
$(".sc-kuang .cancel").click(function() {
	$("ul.sc-kuang li.list-type").css({ "display": "none" });
	$("div.sc-kuang").css({ "justify-content": "space-around" }).children(".list-type").css({ "display": "none" }).siblings(".btn").css({ "display": "none" });
	$("div.sc-kuang .btn").css({"display":"none"});
});
//点击批量管理后，点击每节课前的选中按钮
$(".frame-rg").on("click", "ul.sc-kuang .list-type", function() {
	$(this).children("div").children("span").toggleClass("choosed");
	if($(this).children("div").children("span").attr("class") == "") {
		$("div.sc-kuang .list-type div span").attr("class", "");
	}
	var s = $("ul.sc-kuang").size();
	if($(".choosed").size() == s) {
		$("div.sc-kuang .list-type div span").attr("class", "choosed");
	}
});
//点击批量管理后，点击全选按钮
$("div.sc-kuang .list-type").on("click", function() {
	if($(this).children("div").children("span").hasClass("choosed")) {
		$(this).children("div").children("span").attr("class", "");
		$("ul.sc-kuang .list-type div span").attr("class", "");
	} else {
		$("ul.sc-kuang .list-type div span").attr("class", "choosed");
		$(this).children("div").children("span").attr("class", "choosed");
	}

});
//点击批量管理后，选择相应课程，点击删除时触发
var dataChoosed = [];
$("div.sc-kuang .delete").on("click", function() {
	dataChoosed.length=0;
	var choosed = document.querySelectorAll("ul.sc-kuang .choosed");
	for(var i = 0; i < choosed.length; i++) {
		dataChoosed[i] = choosed[i].parentNode.parentNode.parentNode.attributes["data-courseid"].nodeValue;
	}
	var html = '<div class="sc-pop sc-pop3">';
	html+='<a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
	html+='<div class="sc-title"><span>温馨提示</span></div>';
	html+='<div class="sc-date">确认删除这个课程吗？</div>';
	html+='<div class="c-form"><a class="bg-c1 del-1">确定</a><a href="javascript:;" class="bg-c4">取消</a></div></div>';
	var html1 = '<div class="sc-pop sc-pop3">';
	html1+='<a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
	html1+='<div class="sc-title"><span>温馨提示</span></div>';
	html1+='<div class="sc-date">您尚未选择需要删除的课程</div>';
	html1+='<div class="c-form">';
	html1+='<a href="javascript:;" class="bg-c4 " style="background-color: #6A3906; color:white;">确定</a>';
	html1+='<a href="javascript:;" class="bg-c4">取消</a></div></div>';
	if(choosed.length != 0){
		$(".canbox-3").html(html).css({ "display": "block" });
	}else{
		$(".canbox-3").html(html1).css({ "display": "block" });
	}
});
//点击删除课程弹框中确认按钮
$(".canbox-3").on("click", ".del-1", function() {
	var stamp=new Date().getTime();
	$.ajax({
		type: "POST",
		url: "/api/view/user/courses/removeCourses?token=" + token+"&t="+stamp,
		data: { "removeId": dataChoosed.join(",") },
		success: function(data) {
			notlogin(data);
			if(data.code==0){
				window.location.reload();
			}
		},
		error: function(err) {
			console.log(err.message);
		}
	})
});
//点击进入教室
$(".frame-rg.bg-c2").on("click", "ul.sc-kuang .kai", function() {
	var costId = $(this).parent().attr("data-costId");
	var courseId = $(this).parent().attr("data-courseId");
	costId = parseInt(costId);
	courseId = parseInt(courseId);
	SetClassRoom(costId, courseId);
});
//点击关闭教室
$(".frame-rg.bg-c2").on("click", "ul.sc-kuang .guanbi", function() {
	var room=$(this).parent().attr("data-roomId");
	$.ajax({
		url:"/api/view/user/courseRooms/closeOne?token="+token,
		type:"POST",
		data:{
			"t":new Date().getTime(),
			roomId:room
		},
		success:function(data){
			notlogin(data);
			if(data.code==0){
				alert(data.message);
				window.location.reload();
			}
		},
		err:function(err){
			alert(err.message);
		}
	})
});
//点击页码时
$("ul.pages").on("click", "li", function() {
	var num = $("ul.pages li").size(); //有多少个分页
	var page = $(this).html();
	page = parseInt(page);
	var order = $(this).index();
	if(pageSize <= 6) { //分页少于6个
		query(page - 1);
		$(this).addClass("cur").siblings("li").removeClass("cur");
	} else if(pageSize > 6) {
		if(order == (num - 1)) {
			query(pageSize - 1);
			$(this).addClass("cur").html(pageSize).siblings("li").removeClass("cur");
			$(this).prev("li").html(pageSize - 1).prev("li").html(pageSize - 2).prev("li").html(pageSize - 3).prev("li").html(pageSize - 4).prev("li").html("第一页");
		} else if(order == 0) {
			query(0);
			$(this).addClass("cur").html("第一页").siblings("li").removeClass("cur");
			$(this).next("li").html(2).next("li").html(3).next("li").html(4).next("li").html(5).next("li").html("尾页");
		} else if(page >= 3 && page <= pageSize - 2) {
			query(page - 1);
			$("ul.pages li:eq(2)").addClass("cur").html(page).siblings("li").removeClass("cur");
			$("ul.pages li:eq(0)").html("第一页").next("li").html(page - 1);
			$("ul.pages li:eq(5)").html("尾页").prev("li").html(page + 2).prev("li").html(page + 1);
		} else if(page > pageSize - 2) {
			query(page - 1);
			$(this).addClass("cur").html(page).siblings("li").removeClass("cur");
		} else if(page < 3) {
			query(page - 1);
			$(this).addClass("cur").html(page).siblings("li").removeClass("cur");
		}
	}
});
//点击播放地址弹框中的确认按钮
$(".canbox-3").on("click", ".already", function() {
	location.href="../liveRoom/T_liveRoom.html?roomId="+roomId;
	$(".canbox").slideUp();
	$("body").css({ "overflow": "scroll" });
})
//点击添加课程按钮
$(".addcus").click(function() {
	$(".sc-add-box").slideDown();
});
//点击有下拉框的输入框时
$(".hassel").on("click", function() {
	$(this).css({
		'border-bottom-left-radius': "0",
		'border-bottom-right-radius': "0"
	}).siblings("ul").slideToggle();
});
$(".arrow").on("click", function() {
	$(this).siblings("ul").slideToggle();
});
//点击下拉框的选项时
$(".arrow+ul").on("click", "li", function() {
	if($(this).attr("data-id")) topic = $(this).attr("data-id");
	var choosed = $(this).html();
	$(this).parent().siblings(".hassel").val(choosed);
	$(this).parent().slideUp("fast").siblings(".hassel").css({
		'border-bottom-left-radius': "5px",
		'border-bottom-right-radius': "5px"
	});
	if(choosed == "一对一") {
		model = "ooo";
		$("[name=ccount]").val(1).attr("readonly", true);
	} else if(choosed=="直播课(班课)") {
		model = "live";
		$("[name=ccount]").attr("readonly", false);
	}
});
//点击添加一个课节，第二个弹框出现
$(".sc-add-box").on("click", ".sc-addone", function() {
	$(".canbox-2").slideDown();
	$("body").css({ "overflow": "hidden" });
});
//点击批量添加弹框中的添加新时段
$(".addT").click(function() {
	var html = '<li class="sss"><span>开始时间</span><div class="selectdiv">';
	html+='<select name="hour1" class="beginTime_select">';
	html+='<option value="7">07</option><option value="8">08</option>';
	html+='<option value="9">09</option><option value="10">10</option>';
	html+='<option value="11">11</option><option value="12">12</option>';
	html+='<option value="13">13</option><option value="14">14</option>';
	html+='<option value="15">15</option><option value="16">16</option>';
	html+='<option value="17">17</option><option value="18">18</option>';
	html+='<option value="19">19</option><option value="20">20</option>';
	html+='<option value="21">21</option><option value="22">22</option>';
	html+='<option value="23">23</option></select></div>';
	html+='<div class="ml28 selectdiv"><select name="minute1" class="beginTime_select" >';
	html+='<option value="00">00</option><option value="05">05</option>';
    html+='<option value="10">10</option><option value="15">15</option>';
    html+='<option value="20">20</option><option value="25">25</option>';
    html+='<option value="30">30</option><option value="35">35</option>';
    html+='<option value="40">40</option><option value="45">45</option>';
    html+='<option value="50">50</option><option value="55">55</option>';
    html+='</select></div><span style="margin-left: 35px;">课程时长</span>';
	html+='<div class="selectdiv"><select name="length_time1" class="beginTime_select">';
	html+='<option value="15">15</option><option value="30">30</option>';
	html+='<option value="45">45</option><option value="60">60</option>';
	html+='<option value="75">75</option><option value="90">90</option>';
	html+='<option value="105">105</option><option value="120">120</option>';
	html+='<option value="135">135</option><option value="150">150</option>';
	html+='<option value="165">165</option><option value="180">180</option>';
	html+='</select></div>';
	html+='<div class="sc-week"><ul>';
	html+='<li>周一<br/><input value="1" type="checkbox"/></li>';
	html+='<li>周二<br/><input value="2" type="checkbox"/></li>';
	html+='<li>周三<br/><input value="3" type="checkbox"/></li>';
	html+='<li>周四<br/><input value="4" type="checkbox"/></li>';
	html+='<li>周五<br/><input value="5" type="checkbox"/></li>';
	html+='<li>周六<br/><input value="6" type="checkbox"/></li>';
	html+='<li>周日<br/><input value="0" type="checkbox"/></li>';
	html+='<li><button class="btn deldur">删除时段</button></li>';
	html+='</ul></div></li>';
	$(this).prev().append(html);
});
//点击弹框中右上角的关闭图标，弹框消失
$(".canbox").on("click", ".c-off", function() {
	$(".canbox").slideUp();
	$("body").css({ "overflow": "scroll" });
});
//点击弹框中的取消按钮，弹框消失
$(".canbox").on("click", ".c-form .bg-c4", function() {
	$(".canbox").slideUp();
	$("body").css({ "overflow": "scroll" });
});
var all = [];
var tmp = [],
sub = [],
zhong = [];
//点击批量添加弹框中的确认按钮
$(".canbox-1 .c-form").on("click", ".bg-c1", function() {
	var s = new Date($("#startday-pi").val()).getTime();
	var e = new Date($("#endday-pi").val()).getTime();
	var pushData = [];
	var flag = true;
	$(".sss").each(function() {
		var or = "",obj = {};
		hour = $(this).children("div").children("select[name=hour1]").find("option:selected").val();
		min = $(this).children("div").children("select[name=minute1]").find("option:selected").val();
		durring = $(this).children("div").children("select[name=length_time1]").find("option:selected").val();
		$(this).children("div").children("ul").children("li").children("input:checked").each(function() {
			or = or + $(this).attr("value");
		});
		if(!hour || !min || !durring || !s || !e || or == "") {
			alert("请将时间信息填写完整");
			flag = false;
			return false;
		}
		obj = chgtoend(hour, min, durring);
		obj.week = or;
		pushData.push(obj);
	});
	if(flag) {
		for(var i = s; i <= e; i += 86400000) {
			var t = new Date(i - 1);//必须减一，否则得到的是第二天
			var w = t.getDay();//计算是星期几
			var yy = t.getFullYear(),mm = t.getMonth() + 1,dd = t.getDate();//获取年月日
			t = yy + "-" + fillPre2(mm) + "-" + fillPre2(dd);//yyyy-mm-dd
			var nt = "" + yy + fillPre2(mm) + fillPre2(dd);//yyyymmdd
			var reg = new RegExp(w);
			for(var j = 0; j < pushData.length; j++) {
				var ww = pushData[j].week;//勾选的星期几
				if(!reg.test(ww)) {
					continue;
				} else {
					obj = {};
					obj.date = t;
					obj.stime = pushData[j].stime;
					obj.etime = pushData[j].etime;
					obj.durring = pushData[j].durring;
					obj.costAbout = "";
					obj.beginTime = obj.date + " " + obj.stime + ":00";
					obj.endTime = obj.date + " " + obj.etime + ":00";
					if(obj.beginTime>timeChg()){
						tmp.push(obj);
					}
				}
			}
		}
		for(var i=0;i<tmp.length;i++){
			sub.push(tmp[i]);
		}
		for(var j=0;j<all.length;j++){
			sub.push(all[j]);
		}
		bubbleSort(sub, "beginTime");
		chongtu(sub);
		if(flagchongtu){
			tmp = [];
			alert("课程安排存在冲突!");
			sub = [];
		}else{
			for(var i=0;i<tmp.length;i++){
				all.push(tmp[i]);
			}
			bubbleSort(all, "beginTime");
			tmp = [];
			sub = [];
		}
		appendhtml(all);
		$("body").css({ "overflow": "scroll" });
	}
});
//点击添加一个课节弹框中的确认按钮
$(".canbox-2 .c-form").on("click", ".bg-c1", function() {
	var obj = {},hour, min, durring, info, flag = true;
	hour = $(".one-sc select[name=hour2]").find("option:selected").val();
	min = $(".one-sc select[name=minute2]").find("option:selected").val();
	durring = $(".one-sc select[name=length_time2]").find("option:selected").val();
	info = $("#startday-one").val();
	if(!hour || !min || !durring || !info) {
		alert("请将时间信息填写完整");
		return false;
	}
	obj = chgtoend(hour, min, durring);
	obj.date = info;
	info = $("li.one-text textarea").val();//课节内容
	obj.costAbout = info;
	obj.beginTime = obj.date + " " + obj.stime + ":00";
	obj.endTime = obj.date + " " + obj.etime + ":00";
	if(obj.beginTime<=timeChg()){alert("请填写正确的时间段");return false;}
	tmp.push(obj);
	for(var i=0;i<tmp.length;i++){
		sub.push(tmp[i]);
	}
	for(var j=0;j<all.length;j++){
		sub.push(all[j]);
	}
	bubbleSort(sub, "beginTime");
	chongtu(sub);
	if(flagchongtu){
		tmp = [];
		alert("课程安排存在冲突!");
		sub = [];
	}else{
		for(var i=0;i<tmp.length;i++){
			all.push(tmp[i]);
		}
		bubbleSort(all, "beginTime");
		tmp = [];
		sub = [];
	}
	appendhtml(all);
	$("body").css({ "overflow": "scroll" });
});
var TIME = null;
//点击编辑课节按钮
var dataOrder = null;
$(".sc-plan").on("click", ".btn[data-order]", function() {
	var order = $(this).attr("data-order");order = parseInt(order);//编辑的是all的第order个元素
	var day = $(this).siblings(".sc-time").html();//2017-03-27&nbsp;07:00-07:30
	day = day.slice(0, day.indexOf("&"));
	start = all[order].stime.split(":");
	$(".canbox-4 #startday-edit").val(day);
	$(".canbox-4 select[name=hour4]").val(parseInt(start[0]));
	$(".canbox-4 select[name=minute4]").val(start[1]);
	$(".canbox-4 select[name=length_time4]").val(all[order].durring);
	$(".canbox-4 .edit textarea").val(all[order].costAbout);
	dataOrder = order;
	$(".canbox-4").css({ "display": "block" });
	$("body").css({ "overflow": "hidden" });
});
var MIN, MAX,yuan = [];
//点击编辑课节弹框中的确认按钮
$(".canbox-4 .c-form").on("click", ".bg-c1", function() {
	var obj = {},hour, min, durring, info;
	hour = $(".one-sc select[name=hour4]").find("option:selected").val();
	min = $(".one-sc select[name=minute4]").find("option:selected").val();
	durring = $(".one-sc select[name=length_time4]").find("option:selected").val();
	// 	console.log(hour);
	// if(!hour || !min || !durring) {
	// 	console.log(hour);
	// 	$(".canbox").slideUp();
	// 	$("body").css({ "overflow": "scroll" });
	// 	return false;
	// }
	obj = chgtoend(hour, min, durring);
	obj.costAbout = $(".canbox-4 li.edit textarea").val();//课节简介
	obj.date = $("#startday-edit").val();
	dataOrder = parseInt(dataOrder);
	obj.beginTime = obj.date + " " + obj.stime + ":00";
	obj.endTime = obj.date + " " + obj.etime + ":00";
	if(obj.beginTime<=timeChg()){alert("请填写正确的时间段");return false;}
	tmp.push(obj);
	yuan.push(all[dataOrder]);
	all.splice(dataOrder,1);

	for(var i=0;i<tmp.length;i++){
		sub.push(tmp[i]);
	}
	for(var j=0;j<all.length;j++){
		sub.push(all[j]);
	}
	bubbleSort(sub, "beginTime");
	chongtu(sub);
	if(flagchongtu){
		for(var n=0;n<yuan.length;n++){
			all.push(yuan[n]);
		}
		alert("课程安排存在冲突!");
	}else{
		for(var i=0;i<tmp.length;i++){
			all.push(tmp[i]);
		}
	}
	tmp = [];
	yuan = [];
	sub = [];
	bubbleSort(all, "beginTime");
	appendhtml(all);
	$("body").css({ "overflow": "scroll" });
});
//点击删除全部弹框中的确认按钮
$(".canbox-3").on("click", ".btn-delall", function() {
	all = [];
	$(".sc-plan").css({ "display": "none" }).siblings("button").css({ "display": "inline" });
	$(".canbox-3").css({ "display": "none" });
	$("body").css({ "overflow": "scroll" });
});
//点击修改整体时间弹框中的确认按钮
$(".canbox-5 .c-form").on("click", ".bg-c1", function() {
	var hour, min, durring, info, newinfo;
	hour = $(".two-sc select[name=hour5]").find("option:selected").val();
	min = $(".two-sc select[name=minute5]").find("option:selected").val();
	durring = $(".two-sc select[name=length_time5]").find("option:selected").val();
	info = $("#startday-all").val();//日期
	if(!info) { alert("请填写日期"); return false; }
	var newAll=deepCopy(all);
	for(var i = 0; i < newAll.length; i++) {
		if(newAll[i].date >= info) {
			hour = hour || newAll[i].stime.slice(0, 2);
			min = min || newAll[i].stime.slice(3, 5);
			durring = durring || newAll[i].durring;
			obj = chgtoend(hour, min, durring);
			var nnn=""+newAll[i].date+" "+obj.stime+":00";
			if(nnn>timeChg()){
				newAll[i].stime = obj.stime;
				newAll[i].etime = obj.etime;
				newAll[i].beginTime=""+newAll[i].date+" "+obj.stime+":00";
				newAll[i].endTime=""+newAll[i].date+" "+obj.etime+":00";
			}else{
				alert("已自动调整时间");
			}
		}
	}
	bubbleSort(newAll, "beginTime");
	chongtu(newAll);
	if(flagchongtu){
		alert("课程安排存在冲突");
		return false;
	}else{
		all=deepCopy(newAll);
	}
	appendhtml(all);
	$("body").css({ "overflow": "scroll" });
});
//点击批量添加按钮
$(".sc-add-box").on("click", ".sc-pi", function() {
	$(".canbox-1").slideDown();
	$("body").css({ "overflow": "hidden" });
});
//点击批量添加弹框中删除时段按钮
$(".canbox-1").on("click", ".deldur", function() {
	$(this).parent().parent().parent().parent().remove();
});
//点击选择时分秒的输入框
//$(".sc-date").on("click",".hassel",function(){
//  $(".hassel").siblings(".sc-hour").css({"display":"none"});
//  $(this).siblings(".sc-hour").css({"display":"block"});
//  $(".sc-hour li").click(function(){
//      var h=$(this).html();
//      $(this).parent().prev().val(h);
//      $(this).parent().css({"display":"none"});
//  });
//});
//点击删除课节按钮
$(".sc-plan").on("click", ".btn.del", function() {
	var i = $(this).parent().index();
	var html = '<div class="sc-pop sc-pop3">';
	html+='<a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
	html+='<div class="sc-title"><span>温馨提示</span></div>';
	html+='<div class="sc-date">确认删除这个课节吗？</div>';
	html+='<div class="c-form">';
	html+='<a class="bg-c1" onclick="del(' + i + ')">确定</a>';
	html+='<a href="javascript:;" class="bg-c4">取消</a>';
	html+='</div></div>';
	$(".canbox-3").html(html).css({ "display": "block" });
});
//点击修改整体时间按钮
$(".sc-add-box .sc-plan").on("click", ".sc-chgall", function() {
	$(".canbox-5").css({ "display": "block" });
	$("body").css({ "overflow": "hidden" });
});
//点击删除全部课节按钮
$(".sc-add-box .sc-plan").on("click", ".del-all", function() {
	var html = '<div class="sc-pop sc-pop3">';
	html+='<a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
	html+='<div class="sc-title"><span>温馨提示</span></div>';
	html+='<div class="sc-date">确认删除全部课节吗？</div>';
	html+='<div class="c-form">';
	html+='<a class="bg-c1 btn-delall">确定</a><a href="javascript:;" class="bg-c4">取消</a>';
	html+='</div></div>';
	$(".canbox-3").html(html).css({ "display": "block" });
});
//点击发布课程
$("li").on("click",".uploadSave",function() {
	var cname = $("[name=courseName]").val().trim(); //课程名称
	if(!cname) {
		alert("课程名称为空");
		$("[name=courseName]").focus();
		return false;
	}
	var topicname = $("[name=subject]").val().trim(); //课程名称
	if(!topicname) {
		alert("请选择科目");
		$("[name=subject]").focus();
		return false;
	}
	var ctype = $("[name=ctype]").val().trim(); //课程类型
	if(!ctype) {
		alert("请选择课程类型");
		$("[name=ctype]").focus();
		return false;
	}
	var ctitle = $("[name=ctitle]").val().trim(); //标题
	if(!ctitle) {
		alert("标题为空");
		$("[name=ctitle]").focus();
		return false;
	}
	var ccount = $("[name=ccount]").val().trim(); //人数
	if(model == "live" && ccount == "") {
		alert("请填写人数!");
		$("[name=ccount]").focus();
		return false;
	}else if(model == "live" && parseInt(ccount)>200){
		alert("人数最多为200！");
		$("[name=ccount]").val(200).focus();
		return false;
	}else if(model == "live" && parseInt(ccount)<=0){
		alert("人数至少为1！");
		$("[name=ccount]").val(1).focus();
		return false;
	}
	var pic = $("#fileList").children("img"); //封面
	if(!pic) {
		picId = null;
	}
	var cdescription = $("[name=cdescription]").val().trim(); //简介
	if(all.length == 0) {
		alert("请填写教学计划");
		return false;
	}
	var subObj = {};
	subObj.name = cname;
	subObj.picFileId = picId;
	subObj.topicId = topic;
	subObj.mode = model;
	subObj.maxStudentCount = ccount;
	subObj.cost = 0;
	subObj.title = ctitle;
	subObj.about = cdescription;
	subObj.costArr = JSON.stringify(all); //all;
	var t=new Date().getTime();
	$.ajax({
		type: "POST",
		url: "/api/view/user/courses/saveCoursesArr?token=" + token+"&t="+t,
		data: subObj,
		success: function(data) {
			notlogin(data);
			if(data.code == 0){
				alert("发布成功");
				window.location.reload();
			} 
		},
		error: function(err) {
			console.log(err.message);
		}
	})
});
//人数输入框失去焦点时
$("[name=ccount]").blur(function(){
	var ccount = $("[name=ccount]").val().trim(); //人数
	if(!model){
		return false;
	}else if(model == "live" && parseInt(ccount)>200){
		alert("人数最多为200！");
		$("[name=ccount]").val(200).focus();
		return false;
	}else if(model == "live" && parseInt(ccount)<=0){
		alert("人数至少为1！");
		$("[name=ccount]").val(1).focus();
		return false;
	}
});
//上传图片
jQuery(function() {
	var $ = jQuery,
	$list = $('#fileList'),
		// 优化retina, 在retina下这个值是2
		//    ratio = window.devicePixelRatio || 1,

		// 缩略图大小
		thumbnailWidth = 294,
		thumbnailHeight = 150,

		// Web Uploader实例
		uploader;
	// 初始化Web Uploader
	uploader = WebUploader.create({

		// 自动上传。
		auto: true,

		// swf文件路径
		swf: 'Uploader.swf',

		// 文件接收服务端。
		server: '/api/view/user/ucanfile/upload?token=' + token,

		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#upload',

		// 只允许选择文件，可选。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
		}
	});

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		$(".subcourse").removeClass("uploadSave");
		var $li = $(
			'<div id="' + file.id + '" class="file-item thumbnail">' +
			'<img>' +
			'</div>'
			),
		$img = $li.find('img');

		$list.html($li);

		// 创建缩略图
		uploader.makeThumb(file, function(error, src) {
			if(error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}

			$img.attr('src', src);
		}, thumbnailWidth, thumbnailHeight);
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage) {
		var $li = $('#' + file.id),
		$percent = $li.find('.progress span');

		// 避免重复创建
		if(!$percent.length) {
			$percent = $('<p class="progress"><span></span></p>')
			.appendTo($li)
			.find('span');
		}

		$percent.css('width', percentage * 100 + '%');
	});

	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on('uploadSuccess', function(file, data) {
		$('#' + file.id).addClass('upload-state-done');
		picId = data.data.id;
		$(".subcourse").addClass("uploadSave");
		//		alert(data.message);
	});

	// 文件上传失败，现实上传出错。
	uploader.on('uploadError', function(file) {
		//var $li = $('#' + file.id),
		//    $error = $li.find('div.error');
		//
		//// 避免重复创建
		//if (!$error.length) {
		//    $error = $('<div class="error"></div>').appendTo($li);
		//}
		//
		//$error.text('上传失败');
		alert("上传失败");
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on('uploadComplete', function(file) {
		$('#' + file.id).find('.progress').remove();
	});
	//-------------------------------------
});
//日期插件
layui.use('laydate', function() {
	var laydate = layui.laydate;

	var start = {
		min: laydate.now(),
		max: '2099-06-16 23:59:59',
		istoday: false,
		choose: function(datas) {
			end.min = datas; //开始日选好后，重置结束日的最小日期
			end.start = datas //将结束日的初始值设定为开始日
		}
	};

	var end = {
		min: laydate.now(),
		max: '2099-06-16 23:59:59',
		istoday: false,
		choose: function(datas) {
			start.max = datas; //结束日选好后，重置开始日的最大日期
		}
	};
	$(".sc-date").on("click", "#startday-one", function() {
		var one = {
			min: laydate.now(),
			max: '2099-06-16 23:59:59',
			istoday: false
		};
		one.elem = this;
		laydate(one);
	});
	$(".sc-date").on("click", "#startday-pi", function() {
		start.elem = this;
		laydate(start);
	});
	$(".sc-date").on("click", "#endday-pi", function() {
		end.elem = this;
		laydate(end);
	});
	$(".canbox-3").on("click", "#courseday", function() {
		var day = {
			min: MIN,
			max: MAX,
			istoday: false
		};
		day.elem = this;
		laydate(day);
	})
	$(".canbox-4").on("click", "#startday-edit", function() {
		var edit = {
			min: laydate.now(),
			max: "2099-06-16 23:59:59",
			start: laydate.now(time),
			istoday: false
		};
		edit.elem = this;
		laydate(edit);
	});
	$(".canbox-5").on("click", "#startday-all", function() {
		var edit = {
			min: laydate.now(MIN),
			max: MAX + " 23:59:59",
			istoday: false
		};
		edit.elem = this;
		laydate(edit);
	})
});