$(function() {
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
	}

	var canvas2 = document.getElementById("canvas2");
	var copy = document.getElementsByClassName("copy")[0];
	var xp = $(".xp")[0];
	var canvas1 = document.getElementById("canvas1");
	var ctx = canvas1.getContext("2d");
	var cobj = canvas2.getContext("2d");
	var obj = new shape(copy, cobj, ctx, xp);
	cobj.strokeStyle = "cadetblue";
	cobj.lineWidth = 3;
	ctx.lineWidth = 3;
	ctx.strokeStyle = "cadetblue";
	var str = "";
//	var webSocket = new WebSocket("ws://192.168.3.2:9999");
//	webSocket.onopen = function() {
//		webSocket.onmessage = function(event) {
//			var str = event.data.split(",");
//			//      	console.log(str);
//			if(str[0] == "pen") {
//				if(str.length > 3) {
//					ctx.beginPath();
//					ctx.moveTo(str[2], str[3]);
//				}
//				ctx.lineTo(str[1], str[2]);
//				ctx.stroke();
//			}
//
//			if(str[0] == "line") {
//				ctx.beginPath();
//				ctx.moveTo(str[1], str[2]);
//				ctx.lineTo(str[3], str[4]);
//				ctx.stroke();
//			}
//			if(str[0] == "arc") {
//				ctx.beginPath();
//				var r = Math.sqrt((str[3] - str[1]) * (str[3] - str[1]) + (str[4] - str[2]) * (str[4] - str[2]));
//				ctx.arc(str[1], str[2], r, 0, 2 * Math.PI);
//				ctx.stroke();
//			}
//			if(str[0] == "rect") {
//				ctx.beginPath();
//				ctx.rect(str[1], str[2], str[3] - str[1], str[4] - str[2]);
//				ctx.stroke();
//			}
//			if(str[0] == "earse") {
//				cobj.clearRect(str[1], str[2], str[3], str[4]);
//				ctx.clearRect(str[1], str[2], str[3], str[4]);
//			}
//
//		}
//
//	};

//	function reconnect() {
//		rews = new WebSocket('ws://192.168.3.2:9999');
//		rews.onmessage = function() {
//			//dosomthing  
//		};
//		rews.onclose = function() {
//			//dosomthing
//		};
//	}
//	var disConnect = function() {
//		setTimeout(function() {
//			reconnect();
//		}, 5000);
//	}
//	webSocket.onclose = disConnect;
	$(".pen").on('click', function() {
		//画图
		console.log(1000)
		$(".canvas").css({'cursor':'url("../../img/video_btn2.png") 0 18,pointer'})

		obj.pen();
	});

	$(".eraser").on('click', function() {
		$(".canvas").css({'cursor':'url("../../img/eraser_2.png") 0 18,pointer'})
		obj.clear();
	});
	//	初始化数据
	function findCourseware() {
		$.ajax({
			type: "get",
			url: "/api/view/user/wares/findPage",
			async: true,
			dataType: 'json',
			data: {
				"token": userToken
			},
			success: function(data) {
				notlogin(data)
				var data = data.data.rows;
				var len = data.length;
				for(var i = 0; i < len; i++) {
					imgurl = data[i].picBaseUrl;
					name = data[i].bookName;
					size = data[i].picCount;
					alertcourseware(size, imgurl, name)
				}
			},
			error: function() {}
		});
	}


	var roomId = getQueryString("roomId");
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

	setInterval(function updateTime(){
			$("p.currentTime").html(chgToTime(new Date()));
	},1000);
	//	获取直播间成员
	$.ajax({
		type: "get",
		url: "/api/view/user/courseRooms/findUser?token=" + userToken,
		dataType: "json",
		data: {
			"t":new Date().getTime(),
			"roomId": roomId
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
		// $("p.currentTime").html(chgToTime(new Date()));
		$(".stu-talk2").html(str);
	},
		error: function() {
			console.log("出错了");
		}
	});
	
	setInterval(function findUser(){
		str="";
		$.ajax({
		type: "get",
		url: "/api/view/user/courseRooms/findUser?token=" + userToken,
		dataType: "json",
		data: {
			"t":new Date().getTime(),
			"roomId": roomId
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
		// $("p.currentTime").html(chgToTime(new Date()));
		$(".stu-talk2").html(str);
	},
		error: function() {
			console.log("出错了");
		}
	});},5000);
	//	点击课件管理弹出 选择课件
	$("#coursewareManage").find(".coursewareManage").on("click", function() {
			findCourseware()
			var H = $(document).height();
			var W = $(document).width();
			$("#alertcoursewareBox").css({
				"transform": "scale(1)",
				"height": H,
				"width": W
			})
			$("#alertcourBox").html("");
		})

		//		点击关闭选择课件按钮
	$("#closeBtn").on("click", function() {
			$("#alertcoursewareBox").css({
				"transform": "scale(0)"
			})
		})
		//创建选择课件
	function alertcourseware(size, imgurl, name) {
		var $str = '';
		$str += '<li data-size="' + size + '" data-imgurl="' + imgurl + '"><img src="' + imgurl +'" /><p class="texc">' + name + '</p></li>';
		$("#alertcourBox").append($str);
	}

	var boxH = $(".alertcourBox-bg").height();
	var boxW = $(".alertcourBox-bg").width();
	$(".alertcourBox-bg").css({
			"margin-top": -boxH / 2,
		})
		//		点击选中的课件，添加到页面中
	$("#alertcourBox").on("click", "li", function() {
			var $this = $(this);
			var picCount = $this.attr('data-size');
			var $url = $this.attr('data-imgurl');
			$url = $url.substring(0,$url.indexOf("-"));
			var $imgStr = '<li class="coursewareList active" index="0" style="display:none;"><div class="coursewarePic"><img src="../../img/course-bg_03.png" class="coursewarePic_pic" /></div><p class="coursewareSize">白板</p></li>';
			for(var i = 0; i < picCount; i++) {
				$imgStr += '<li class="coursewareList" index="'+(i+1)+'"><div class="coursewarePic">';
				$imgStr += '<img src="' + $url + '-' + i + '.jpg" class="coursewarePic_pic" />';
				$imgStr += '</div><p class="coursewareSize">'+(i+1)+"/"+picCount+'</p></li>';
			}
			$(".coursewareBox").html("");
			$(".coursewareBox").append($imgStr);
			$("#alertcoursewareBox").css({
				"transform": "scale(0)"
			});
		})
		//	点击全屏
	var maker = true;
	$(".enlarge").on("click", function() {
		if(maker) {
			var activePic = $(".coursewareList.active").find(".coursewarePic_pic").attr("src")
			var Allcw = $(document).height();
			var Allch = $(document).width();
			$(".videoContent").css({
				"width": "100%"
			});
			$(".stu-comment").css({
				"display": "none"
			});
			$(".stu-comment2").css({
				"display": "none"
			});
			cw = $(".canvas").width();
			ch = $(".canvas").height();
			img = new Image();
			img.src = activePic;
			img.onload = function() {
				ctx3.drawImage(img, 0, 0, cw, ch);
			}
			maker = false;
		} else {
			var activePic = $(".coursewareList.active").find(".coursewarePic_pic").attr("src")
			$(".videoContent").css({
				"width": "80%"
			});
			$(".stu-comment").css({
				"display": "block"
			});
			$(".stu-comment2").css({
				"display": "block"
			});
			img = new Image();
			img.src = activePic;
			img.onload = function() {
				ctx3.drawImage(img, 0, 0, cw, ch);
			}
			maker = true;
		}
	})
//	进入教室弹出播放设定信息
	if(getQueryString("pushRtmpUrl")){
		var pushRtmpUrl = getQueryString("pushRtmpUrl");
	var FMS_URL = pushRtmpUrl.split("live/")[0]
	var video_URL = pushRtmpUrl.split("live/")[1];
	var $div = $("<div class='canbox'></div>")
	var $divAlert = '<div class="sc-pop"><a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>';
	$divAlert += '<div class="sc-title"><span>播放设定信息</span></div>';
	$divAlert += '<div class="sc-date"><div class="classdetail">';
	$divAlert += '<span>FMS URL:</span><span>' + FMS_URL + 'live/</span></div>';
	$divAlert += '<div class="classdetail"><span>播放路径/串码流:</span>' + video_URL + '<span></span>';
	$divAlert += '</div><p class="red"><span>注意：</span>请妥善保管播放设定信息！<p/></div><div class="c-form">'
	$divAlert += '<a class="bg-c1 c-off1">确定</a></div></div>'
	$div.html($divAlert);
	$("body").append($div);
	$(".c-off,.c-off1").click(function(){
		$(".canbox").hide(300)
	})
	}
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	};
//	关闭教室

$("#closeClassRoom").click(function(){
	var bl = confirm("您确定退出教室吗？");
	if(bl){
		$("#loadingBg").css('display','block');
		$.ajax({
			type:"post",
			url:"/api/view/user/courseRooms/updateRoom",
			dataType: "json",
			data: {
				"token": userToken,
				"roomId": roomId
			},
			success:function(data){
				$("#loadingBg").css('display','none');
				alert(data.message);
				window.location.href = "../myCourseVideo/myCourseVideoTeacher.html";
			}
		});
	}else{
		return false;
	}
})
function notlogin(data){
    if(data.code!=0){
        alert(data.message);
        if(data.code==6012)
        {
            location.href="../login/login.html";
        }
    }
}
	// 点击上一页
	$("#next_btn").on("click",function(){
		var $index = $(".coursewareList.active").attr("index");
		$index =  parseInt($index) + 1;
		$(".coursewareList").eq($index).addClass("active").siblings("li").removeClass("active");
		var _this = $(".coursewareList.active .coursewarePic").find("img.coursewarePic_pic")
		next(_this);
	})
	// 点击下一页
	$("#perv_btn").on("click",function(){
		var $index = $(".coursewareList.active").attr("index");
		$index =  parseInt($index) - 1;
		if($index==0){
			$index = 1;
		}
		$(".coursewareList").eq($index).addClass("active").siblings("li").removeClass("active");
		var _this = $(".coursewareList.active .coursewarePic").find("img.coursewarePic_pic")
		next(_this);
	})
	// 键盘上下键改变PPT图片
	$(document).keydown(function(event){
		if(event.keyCode==38){
			var $index = $(".coursewareList.active").attr("index");
			$index =  parseInt($index) - 1;
			if($index==0){
				$index = 1;
			}
			$(".coursewareList").eq($index).addClass("active").siblings("li").removeClass("active");
			var _this = $(".coursewareList.active .coursewarePic").find("img.coursewarePic_pic")
			next(_this);
			return false;
		}
		if(event.keyCode==40){
			var $index = $(".coursewareList.active").attr("index");
			$index =  parseInt($index) + 1;
			$(".coursewareList").eq($index).addClass("active").siblings("li").removeClass("active");
			var _this = $(".coursewareList.active .coursewarePic").find("img.coursewarePic_pic")
			next(_this);
			return false;
		}
	});
	// 点击白板
	$(".baiban").on("click",function(){
		var $this = $(".coursewarePic_pic");
		next($this);
	})

	/*点击视频左下角工具栏收缩功能*/
	$(".my_btn").on('click','.my_button_left',function(){
		$(".op-active .my_none").hide();
		$(".my_button").removeClass('my_button_left');
		$(".my_button").addClass('my_button_right');
	})
	$(".my_btn").on('click','.my_button_right',function(){
		$(".op-active .my_none").show();
		$(".my_button").removeClass('my_button_right');
		$(".my_button").addClass('my_button_left');
	})
});