
$(function() {

if(sessionStorage.obj){
	UserStr = sessionStorage.obj;
	obj = JSON.parse(UserStr);
	var userToken = obj.user.userToken;

	console.log(sessionStorage.obj)
}


//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};

var ucandomain;
var ucanport;
var ucanlocation;
var ucanroomID = getQueryString("roomId");
var connCtx = {
		webSocket: null, //画板连接
		videoEventSender: null, //websocket发送端
		videoEventRecver: null, //websocket接收端
		videoIn: null, //视频输入连接
		videoOut: null, //视频输出连接
		addedStream: false
};

var tryAgain = [0,0,0,0];

console.log(navigator)



$.ajax({
	url: '/api/view/user/courseRooms/joinRoom?token='+userToken,
	type: 'POST',
	dataType: 'json',
	data: {
		"roomId":ucanroomID
	},
	success:function(data){
		
		console.log(data)

	
		if(data.code==0){
			ucandomain = data.data.studentDoMain;
			ucanport = data.data.studentPort;
			ucanlocation = data.data.studentLocation;
			//获取本地的媒体流

			getUserMedia.call(navigator, {
				"audio":true,
				"video":true
			}, function(stream) {
				mediaStream = stream;
				setup(ucandomain, ucanport, ucanlocation, ucanroomID);
			}, function(event){
				alert("您的视频设备无法访问，请检查视频设备。错误信息：\n"+event);
			});
		}
	},
	error:function() {
		console.log("错误")
	}
})


//使用mozilla和Google的stun服务器
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var pcConfig = {
   		iceServers: [{
			urls: [
				"stun:stun.services.mozilla.com",
				"stun:stun01.sipphone.com",
				"stun:stun.ekiga.net",
				"stun:stun.fwdnet.net",
				"stun:stun.ideasip.com",
				"stun:stun.iptel.org",
				"stun:stun.rixtelecom.se",
				"stun:stun.schlund.de",
				"stun:stun.l.google.com:19302",
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
				"stun:stun3.l.google.com:19302",
				"stun:stun4.l.google.com:19302",
				"stun:stunserver.org",
				"stun:stun.softjoys.com",
				"stun:stun.voiparound.com",
				"stun:stun.voipbuster.com",
				"stun:stun.voipstunt.com",
				"stun:stun.voxgratia.org",
				"stun:stun.xten.com",
				"stun:121.42.182.106"
			]
   		},{
			credential: "oooCourseRoom",
			username: "ucan",
			urls: ["turn:121.42.182.106"]
		}],
		iceTransportPolicy: "all"
	};

	//兼容浏览器的getUserMedia写法
	var getUserMedia = (navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);
	
	//兼容浏览器的PeerConnection写法
	var PeerConnection = (window.PeerConnection ||
		window.RTCPeerConnection ||
		window.webkitPeerConnection00 ||
		window.webkitRTCPeerConnection ||
		window.mozRTCPeerConnection);
	var mediaStream; //被发送的视频流
	var onLocalIceCandidate = function(event,distName){
		if (event.candidate) {
			//发送ICE候选到其他客户端
			var msg = JSON.stringify({
				event: "__ice_candidate",
				data: event.candidate,
				dist: distName
			});
			connCtx.videoEventSender.send(msg);
			// console.log(">>>>" + msg);
		}
	}
	var setupVideoOut = function() {
		var pc = new PeerConnection(pcConfig);
		pc.onicecandidate = function(event) {
			onLocalIceCandidate(event,"videoIn");
		};
		connCtx.addedStream = false;
		connCtx.videoOut = pc;
	}


	var setupVideoIn = function() {
		var pc = new PeerConnection(pcConfig);
		pc.onicecandidate = function(event) {
			onLocalIceCandidate(event,"videoOut");
		};
		pc.onaddstream = function(event) {
			document.getElementById("other").src = URL.createObjectURL(event.stream);
		};
		pc.oniceconnectionstatechange = function(event) {
			if (pc.iceConnectionState === "failed") {
// 				if (tryAgain[2] < 3) {
// 					tryAgain[2]++;
// 					setupVideoIn();
// 					var msg = JSON.stringify({
// 						event: "lcr_reconnect"
// 					});
// 					connCtx.videoEventSender.send(msg);
// 					console.log(">>>>" + msg);
// 				} else {
//					console.log("重连对方失败，请检查网络！");
// 				}
				alert("对方已离开教室！");
				$("#Studnet_imgbg").css("backgroundImage","url(../../../img/course-bg_03.png)")
			} else if (pc.iceConnectionState === "connected") {
				tryAgain[2] = 0;
			}
		}
		connCtx.videoIn = pc;
	};
	var sendOffer = function() {
		connCtx.addedStream = true;
		connCtx.videoOut.addStream(mediaStream);
		//发送一个offer信令
		connCtx.videoOut.createOffer().then(function(offer){
			connCtx.videoOut.setLocalDescription(offer);
			var msg = JSON.stringify({
				event: "__offer",
				data: {
					sdp: offer
				}
			});
			connCtx.videoEventSender.send(msg);
			// console.log(">>>>" + msg);
		});
	};
	var onRemoteIceCandidate = function(event) {
		if(event.data){
			var dist = null;
			if (event.dist === "videoIn")
				dist = connCtx.videoIn;
			else
				dist = connCtx.videoOut;
			dist.addIceCandidate( new RTCIceCandidate(event.data) );
		}
	};
	var onRemoteOffer = function(data) {
		if ( userAgent.indexOf("Chrome") > -1 ) {
			connCtx.videoIn.setRemoteDescription(data.sdp);
		} else {
			connCtx.videoIn.setRemoteDescription(new RTCSessionDescription(data.sdp));
		}
		//发送一个answer信令
		connCtx.videoIn.createAnswer().then(function(answer){
			connCtx.videoIn.setLocalDescription(answer);
			var msg = JSON.stringify({
				event: "__answer",
				data: {
					sdp: answer
				}
			});
			connCtx.videoEventSender.send(msg);
			// console.log(">>>>" + msg);
		});
		if (!connCtx.addedStream) {
			sendOffer();
		}
	};
	var onRemoteAnswer = function(data) {
		if ( userAgent.indexOf("Chrome") > -1 ) {
			connCtx.videoOut.setRemoteDescription(data.sdp);
		} else {
			connCtx.videoOut.setRemoteDescription(new RTCSessionDescription(data.sdp));
		}
	}
	var onRemoteReconnect = function() {
		setupVideoOut();
		sendOffer();
	}
	var onRemoteAskReoffer = function() {
		if (!connCtx.addedStream) {
			var msg = JSON.stringify({
				event: "lcr_reoffer"
			});
			connCtx.videoEventSender.send(msg);
			// console.log(">>>>" + msg);
		}
	}
	var onRemoteReoffer = function() {
		setupVideoOut();
		setupVideoIn();
		sendOffer();
	}
	var setupWs = function(domain,port,location,roomID,endPointType,tryAgainIdx){
		var ws = new WebSocket(domain + ":" + port + location + roomID + "/" + endPointType);
		ws.onopen = function(){
			tryAgain[tryAgainIdx] = 0;
		};
		ws.onclose = function(){
			if (tryAgain[tryAgainIdx] < 3) {
				tryAgain[tryAgainIdx]++;
				setupWs(domain,port,location,roomID,endPointType,tryAgainIdx);
			} else {
				console.log("重连服务器失败，请检查网络！");
			}
		};
		if (endPointType === "videoIn") {
			ws.onmessage = function(event){
				// console.log("<<<<" + event.data);
				//处理到来的信令
				var json = JSON.parse(event.data);
				if(json.event === "__ice_candidate") {
					onRemoteIceCandidate(json);
				} else if (json.event === "__offer") {
					onRemoteOffer(json.data);
				} else if (json.event === "__answer") {
					onRemoteAnswer(json.data);
				} else if (json.event === "lcr_reconnect") {
					onRemoteReconnect();
				} else if (json.event === "lcr_ask_reoffer") {
					onRemoteAskReoffer();
				} else if (json.event === "lcr_reoffer") {
					onRemoteReoffer();
				}
			};
			connCtx.videoEventRecver = ws;
		} else if (endPointType === "videoOut") {
			ws.onmessage = function(event){
				// console.log("<<<<" + event.data);
				if (connCtx.addedStream) {
					var msg = JSON.stringify({
						event: "lcr_ask_reoffer"
					});
					connCtx.videoEventSender.send(msg);
					// console.log(">>>>" + msg);
				} else {
					sendOffer();
				}
			}
			connCtx.videoEventSender = ws;
		} else {
			ws.onmessage = function(event){
				var str = event.data.split(",");
				if(str[0] == "pen") {
					if(str.length > 3) {
						ctx.beginPath();
						ctx.moveTo(str[2], str[3]);
					}
					ctx.lineTo(str[1], str[2]);
					ctx.stroke();
				}

				if(str[0] == "line") {
					ctx.beginPath();
					ctx.moveTo(str[1], str[2]);
					ctx.lineTo(str[3], str[4]);
					ctx.stroke();
				}
				if(str[0] == "arc") {
					ctx.beginPath();
					var r = Math.sqrt((str[3] - str[1]) * (str[3] - str[1]) + (str[4] - str[2]) * (str[4] - str[2]));
					ctx.arc(str[1], str[2], r, 0, 2 * Math.PI);
					ctx.stroke();
				}
				if(str[0] == "rect") {
					ctx.beginPath();
					ctx.rect(str[1], str[2], str[3] - str[1], str[4] - str[2]);
					ctx.stroke();
				}
				if(str[0] == "earse") {
					cobj.clearRect(str[1], str[2], str[3], str[4]);
					ctx.clearRect(str[1], str[2], str[3], str[4]);
				}
				if(str[0] == "Teacher") {
					if(str[1] == "next") {
						changeBg(str[2]);
						$("#Studnet_imgbg").attr("bg",str[2]);
					}
					if(str[1] == "prev") {
						prev();
					}
				}
			}
			connCtx.webSocket = ws;
		}
	};
	var setup = function(domain,port,location,roomID) {
		setupWs(domain,port,location,roomID,"videoOut",0);
		setupVideoOut();
		setupVideoIn();
		setupWs(domain,port,location,roomID,"videoIn",1);
		setupWs(domain,port,location,roomID,"drawing",3);
	};
	// -----------------------------------------------------------画板

	var canvas2 = document.getElementById("canvas2");
	var copy = document.getElementsByClassName("copy")[0];
	var xp = $(".xp")[0];
	var canvas1 = document.getElementById("canvas1");
	var ctx = canvas1.getContext("2d");
	var cobj = canvas2.getContext("2d");
	// var obj = new shape(copy, cobj, ctx, xp);
	cobj.strokeStyle = "cadetblue";
	cobj.lineWidth = 3;
	ctx.lineWidth = 3;
	ctx.strokeStyle = "cadetblue";
	//点击视频与黑板转换按钮
	var falge = true; //点击切换标记
	$(".conversion").on("click", function() {
		conversion();
	})
	var teacherPhoto = $(".teacherPhoto");
	var cancas = $(".canvas");
	var tool = $(".tool");

	function conversion() {
		var teacherPhoto_false = $(".teacherPhoto_false");
		var pT = teacherPhoto_false.css("top");
		var pL = teacherPhoto_false.css("left");
		var pH = teacherPhoto_false.height();
		var pW = teacherPhoto_false.width();
		var pZ = teacherPhoto_false.css("z-index");
		

		var cT = cancas.css("top");
		var cL = cancas.css("left");
		var cH = cancas.height();
		var cW = cancas.width();
		var cZ = cancas.css("z-index");
		var activePic = $("#Studnet_imgbg").attr('bg');
		
		if(falge){
			teacherPhoto_false.css("backgroundImage","url("+activePic+")");
			teacherPhoto.css({"background-color":"#000","width":cW,"height":cH,"top":cT,"left":cL,"z-index":cZ});
			cancas.css("display","none");
		}else{
			teacherPhoto_false.css("backgroundImage","url()");
			teacherPhoto.css({"background-color":"#000","width":pW,"height":pH,"top":pT,"left":pL,"z-index":pZ})
			cancas.css("display","block")
		}
		
		falge = !falge;
	}
	// 学生端退出教室
	$(".stu-out_s").on("click",function(){
		var bl = confirm("您确定退出教室吗？");
		if(bl){
			$.ajax({
				url: '/api/view/user/courseRooms/closeRoom?token='+userToken,
				type: 'POST',
				dataType: 'json',
				data:{
					"roomId":ucanroomID
				},
				success:function(data){
					alert(data.message);
					 window.location.href = "../myTimetable/myTimetable.html";
				},
				error:function() {
					console.log("错误")
				}
			})
		}else{
			return false;
		}
	})
});
