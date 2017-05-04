
$(function() {
	
if(sessionStorage.obj){
	UserStr = sessionStorage.obj;
	obj = JSON.parse(UserStr);
	var userToken = obj.user.userToken;
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

var costId = getQueryString("costId");
var connCtx = {
		webSocket: null, //画板连接
		videoEventSender: null, //websocket发送端
		videoEventRecver: null, //websocket接收端
		videoIn: null, //视频输入连接
		videoOut: null, //视频输出连接
		addedStream: false
};

var tryAgain = [0,0,0,0];

$.ajax({
	url: '/api/view/user/courseRooms/joinRoom?token='+userToken,
	type: 'POST',
	dataType: 'json',
	data: {
		"roomId":ucanroomID
	},
	success:function(data){
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
				optionCourseware();
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
    console.log(userAgent)

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

	//--------------------------------------------------------
	function shape(copy,cobj,ctx,xp) {
    this.copy=copy;
    this.cobj=cobj;
    this.ctx=ctx;
    this.xp=xp;
    this.canvasW=copy.offsetWidth;
    this.canvasH=copy.offsetHeight;
    this.fillStyle="rgba(255, 255, 255, 0)";
    this.strokeStyle="cadetblue";
    this.lineWidth=3;
    this.type="line";
    this.style="stroke";
    this.history=[];
    this.xpsize=20;
    this.isback=true;
}

shape.prototype={
    init:function () {
        this.cobj.fillStyle=this.fillStyle;
            this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.lineWidth=this.lineWidth;
        this.xp.style.display="none";
    },
    draw:function () {
        var that=this;
        that.copy.onmousedown=function(e){
            that.init();
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function(e){            	
                that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
              var endx=e.offsetX;
              var endy=e.offsetY;
                that[that.type](startx,starty,endx,endy);
                that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                
                if(that.type=="line"){
					that.ctx.beginPath();
					that.ctx.moveTo(startx,starty);
					that.ctx.lineTo(endx,endy);
					that.ctx.stroke();
				}
				if(that.type=="arc"){
					that.ctx.beginPath();
					var r=Math.sqrt((endx-startx)*(endx-startx)+(endy-starty)*(endy-starty));
        				that.ctx.arc(startx,starty,r,0,2*Math.PI);
        				that.ctx.stroke();
				}  
				if(that.type=="rect"){
					that.ctx.beginPath();
      				  that.ctx.rect(startx,starty,endx-startx,endy-starty);
     				   that.ctx.stroke();
				}     	
                connCtx.webSocket.send(that.type+","+startx+","+starty+","+endx+","+endy);
                
                }
            };
           
                
        }
    },
   pen:function () {
       var that=this;
       that.copy.onmousedown=function(e){
           that.init();
           var startx=e.offsetX;
           var starty=e.offsetY;
           that.ctx.beginPath();
           that.ctx.save()
           that.ctx.moveTo(startx,starty);
           connCtx.webSocket.send("pen,move,"+startx+","+starty);
           that.copy.onmousemove=function(e){
               var endx=e.offsetX;
               var endy=e.offsetY;
               that.ctx.lineTo(endx,endy);
               connCtx.webSocket.send("pen,"+endx+","+endy);
               that.ctx.stroke();
           };
           that.copy.onmouseup=function(e){
               that.copy.onmousemove=null;
               that.copy.onmouseup=null;
           }
       }
  },
    line:function (x,y,x1,y1) {
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();

    },
    arc:function (x,y,x1,y1) {
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    rect:function (x,y,x1,y1) {
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    clear:function () {
        var that=this;
        that.copy.onmousemove=function(e){
            var endx=e.offsetX;
            var endy=e.offsetY;
            var left=endx-that.xpsize/2;
            var top=endy-that.xpsize/2;
            if(left<0){
                left=0
            };
            if(left>that.canvasW-that.xpsize){
                left=that.canvasW-that.xpsize
            }
            if(top<0){
                top=0
            };
            if(top>that.canvasH-that.xpsize){
                top=that.canvasH-that.xpsize
            };
            that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
        };
        that.copy.onmousedown=function(){
            that.copy.onmousemove=function(e) {
                var endx = e.offsetX;
                var endy = e.offsetY;
                var left = endx - that.xpsize / 2;
                var top = endy - that.xpsize / 2;
                if (left < 0) {
                    left = 0
                }
                if (left > that.canvasW - that.xpsize) {
                    left = that.canvasW - that.xpsize
                }
                if (top < 0) {
                    top = 0
                }
                if (top > that.canvasH - that.xpsize) {
                    top = that.canvasH - that.xpsize
                }
                that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
                that.cobj.clearRect(left, top, that.xpsize, that.xpsize);
                that.ctx.clearRect(left, top, that.xpsize, that.xpsize);
                connCtx.webSocket.send("earse,"+left+","+top+","+that.xpsize+","+that.xpsize);
            };
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear();
            }
        }
    }
};
	//--------------------------------------------------------
	var canvas2 = document.getElementById("canvas2");
	var copy = document.getElementsByClassName("copy")[0];
	var xp = $(".xp")[0];
	var canvas1 = document.getElementById("canvas1");
	var canvas3 = document.getElementById("canvas3");
	var ctx = canvas1.getContext("2d");
	var cobj = canvas2.getContext("2d");
	var obj = new shape(copy, cobj, ctx, xp);
	cobj.strokeStyle = "cadetblue";
	cobj.lineWidth = 3;
	ctx.lineWidth = 3;
	ctx.strokeStyle = "cadetblue";



	var ctx3 = canvas3.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var btn_prev = document.getElementById("btn_prev");
	var btn_next = document.getElementById("btn_next");

	var cw = $(".canvas").width();
	var ch = $(".canvas").height();
	var activePic = $(".coursewareList.active").find(".coursewarePic_pic").attr("src")
	var img = new Image();
	canvas3.width = canvas2.width = canvas1.width = cw;
	canvas3.height = canvas2.height = canvas1.height = ch;
	img.src = activePic;
	img.onload = function() {
		ctx3.drawImage(img, 0, 0, cw, ch);
	}
	//	点击切换课件图片
	$(".coursewareBox").on("click",function(ev){
		if(ev.target.className =="coursewarePic_pic"){
			var _this = ev.target;
			var $this = $(_this)
			$(_this.parentNode.parentNode).addClass('active').siblings().removeClass("active");
			next($this);
		}
	})
	function next(_this) {
		ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
		ctx.clearRect(0, 0, canvas3.width, canvas3.height);
		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
		cw = $(".canvas").width();
		ch = $(".canvas").height();
		img.src = _this.attr('src');
		img.onload = function() {
			ctx3.drawImage(img, 0, 0, cw, ch);
		}
		var srcT = _this.attr('src');
		connCtx.webSocket.send("Teacher,next," + srcT + "");
	}
	$(".pen").on('click', function() {
		$(".canvas").css({'cursor':'url("../../../img/video_btn2.png") 0 18,pointer'})
		obj.pen();
	});
	$(".eraser").on('click', function() {
		$(".canvas").css({'cursor':'url("../../../img/eraser_2.png") 0 18,pointer'})
		obj.clear();
	});

	//	初始化数据
	function findCourseware() {
		$.ajax({
			type: "get",
			url: "/api/view/user/wares/findPage",
			async: true,
			data:{
				"token": userToken
			},
			success: function(data) {
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
//	右侧显示隐藏却换
	var b = true;
	$(".comm-i a").click(function() {
		if(b){
			$(".stu-comment").css("width", "0");
			$(".videoContent").css("width", "100%");
			$(".triangle-right").css("background", "url(../../img/left-right-san.png) no-repeat");
			$("#coursewareManage").css({"display":"none"});
		}else{
			$(".stu-comment").css("width", "20%");
			$(".videoContent").css("width", "80%");
			$(".triangle-right").css("background", "url(../../img/left-right-san.png) no-repeat -17px");
			$("#coursewareManage").css({"display":"block"})
		}
		b = !b;
	});

	$(".stu-comment").css("height", $(".videoContent").height())
	$(".stu-talk").css("height", ($(".videoContent").height() - 80))
	$(".coursewareBox").css("height", ($(".videoContent").height() - 80))
//----------------------------------------------------------------------
		//	点击课件管理弹出 选择课件
		function optionCourseware(){
			findCourseware()
			var H = $(document).height();
			var W = $(document).width();
			$("#alertcoursewareBox").css({
				"transform": "scale(1)",
				"height": H,
				"width": W
			})
		};
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
	var cw = 890;
	var ch = 600;
	var sw = 120;
	var sh = 120;
	var maker = true;
	$(".enlarge").on("click", function() {
			var activePic = $(".coursewareList.active").find(".coursewarePic_pic").attr("src");
			var Allch = $(".canvas").height();
			var Allcw = $(".canvas").width();
			if(maker) {
				$(".box").css({
					"width": Allcw,
					"height": Allch,
					"padding": "0"
				});
				$(".videoContent").css({
					"width": "100%"
				});
				$(".stu-comment").css({
					"display": "none"
				});
				img = new Image();
				img.src = activePic;
				if(falge) {
					cancas.width(Allcw);
					cancas.height(Allch);
					img.onload = function() {
						ctx3.drawImage(img, 0, 0, Allcw, Allch);
					}
				} else {
					teacherPhoto.css({
						"width": Allcw,
						"height": Allch
					});
					cancas.css({
						"top": 0,
						"left": 0
					})
				}
				maker = false;
			} else {
//				右侧回到初始状态
				$(".stu-comment").css({"width":"20%","display":"block"});
				$(".videoContent").css("width", "80%");
				$(".triangle-right").css("background", "url(../../img/left-right-san.png) no-repeat -17px");
				$("#coursewareManage").css({"display":"block"});
				b = true;
				$(".box").css({
					"width": cw,
					"height": ch,
					"padding": "40px",
					"margin": "40px auto 0"
				});
//				--------------------------------
				img = new Image();
				img.src = activePic;
				if(falge) {
					img.onload = function() {
						ctx3.drawImage(img, 0, 0, cw, ch);
					}
				} else {
					teacherPhoto.css({
						"width": cw,
						"height": ch
					})
					img.onload = function() {
						ctx3.drawImage(img, 0, 0, sw, sh);
					}
				}
				maker = true;
			}
		})
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
		var activePic = $(".coursewareList.active .coursewarePic").find('img').attr("src");
		
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
	//退出教室
	$("#closeClassRoom").on("click",function(){
		var bl = confirm("您确定退出教室吗？");
		if(bl){
			$.ajax({
				url: '/api/view/user/courseRooms/closeOne?token='+userToken,
				type: 'POST',
				dataType: 'json',
				data:{
					"roomId":ucanroomID
				},
				success:function(data){
					alert(data.message);
					$(".popup-fix").slideToggle();
				},
				error:function() {
					console.log("错误")
				}
			})
		}else{
			return false;
		}
	})

	//	*****************弹出框&& 评价的提交
//	评价小红花
$(".c-score img").click(function () {
	for (var i = 0; i < $(this).index(); i++) {
		$(".c-score img").eq(i).attr("src", "../../img/flower.png");
		$(this).nextAll().attr("src", "../../img/flower-g.png");
	}
	index = $(this).index();
});

//	老师提交评价
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
		$.post("/api/view/user/students/evaluations/add?token=" + userToken, {
			"studentId": studentId,
			"evaluationFraction": index,
			"evaluation": value,
			"courseId": courseId
		}, function (data) {
			if(data.code == 0){
				$(".popup-fix").slideToggle();
				alert(data.message);
				 window.location.href = "../myTimetable/T_myTimetable.html";
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
		window.location.href = "../myTimetable/T_myTimetable.html";
	});
});
//	*****************弹出框&& 评价的提交
// 
var courseStr = "";
var studentId = "";
var index;
var courseId = getQueryString("courseId");
findUser()
function findUser(){
	$.ajax({
		url: "/api/view/user/course/schedules/findList?token=" + userToken,
		type: 'get',
		dataType: 'json',
		data: {"t":new Date().getTime(),"costId": costId},
		success:function(data){
			var len = data.data.length;
			if(len!=0){
				var data = data.data[0];
				if(!data.students.ucanFile){
					data.students.ucanFile = "../../img/body-header.png";
				}else{
					data.students.ucanFile = data.students.ucanFile.newUrl;
				}
				studentId = data.students.id;
				courseStr += '<div class="c-title-l fl"><img src="' + data.students.ucanFile + '" width="100%" height="100%" alt="">';
				courseStr +='</div><div class="c-title-r fl"><h3 class="fn-c0 fn-s0 fn-w6">' + data.courseCosts.coursePlans.courses.name + '</h3>';
				courseStr +='<p class="teach-name fn-c0 fn-w4">学生姓名：' + data.students.name + '</p>';
				courseStr +='<div class="teach-time fn-s2">'
				courseStr +='</div><div class="c-renzheng">';
				$(".course-title").html(courseStr);
			}
		},
		error:function(){

		}
	})
	
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
