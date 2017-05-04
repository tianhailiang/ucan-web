$(function() {
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
var webSocket = new WebSocket('"'+ucandomain+":"+ucanport+ucanlocation+getQueryString("roomId")+'/drawing"'); //发
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
                webSocket.send(that.type+","+startx+","+starty+","+endx+","+endy);
                
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
            webSocket.send("pen,move,"+startx+","+starty);
           that.copy.onmousemove=function(e){
               var endx=e.offsetX;
               var endy=e.offsetY;
               that.ctx.lineTo(endx,endy);
               webSocket.send("pen,"+endx+","+endy);
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
                webSocket.send("earse,"+left+","+top+","+that.xpsize+","+that.xpsize);
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
	// var webSocket = new WebSocket("ws://192.168.3.98:8018/room_2/drawing"); //收



	var ctx3 = canvas3.getContext("2d");
	// var ctx = canvas1.getContext("2d");
	var ctx2 = canvas2.getContext("2d");
	var btn_prev = document.getElementById("btn_prev");
	var btn_next = document.getElementById("btn_next");
	// var webSocket = new WebSocket("ws://192.168.3.98:8018/room_2/drawing");//发

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
		webSocket.send("Teacher,next," + srcT + "");
	}
	webSocket.onopen = function() {

		webSocket.onmessage = function(event) {
			var str = event.data.split(",");
			//      	console.log(str);
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

		}

	};
	$(".pen").on('click', function() {
		obj.pen();
	});
	$(".eraser").on('click', function() {
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
			var $imgStr = '<li class="coursewareList active"><div class="coursewarePic"><img src="../../img/course-bg_03.png" class="coursewarePic_pic" /></div><p class="coursewareSize">白板</p></li>';
			for(var i = 1; i <= picCount; i++) {
				$imgStr += '<li class="coursewareList"><div class="coursewarePic">';
				$imgStr += '<img src="' + $url + '-' + i + '.jpg" class="coursewarePic_pic" />';
				$imgStr += '</div><p class="coursewareSize">'+i+"/"+picCount+'</p></li>';
			}
			$(".coursewareBox").html("");
			$(".coursewareBox").append($imgStr);
		})
		//	点击全屏
	var cw = 890;
	var ch = 600;
	var sw = 120;
	var sh = 120;
	var maker = true;
	$(".enlarge").on("click", function() {
			var activePic = $(".coursewareList.active").find(".coursewarePic_pic").attr("src");
			var Allch = $(document).height();
			var Allcw = $(document).width();
			if(maker) {
				$(".box").css({
					"width": Allcw,
					"height": Allch,
					"padding": "0",
					"margin": "0"
				});
				teacherPhoto.css({
					"top": 0,
					"left": "0"
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
					canvas3.width = canvas2.width = canvas1.width = Allcw;
					canvas3.height = canvas2.height = canvas1.height = Allch;
					// ctx.restore();
					// ctx.scale(1.5,1.5)
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
					canvas3.width = canvas2.width = canvas1.width = cw;
					canvas3.height = canvas2.height = canvas1.height = ch;
					cancas.width(cw);
					cancas.height(ch);
					teacherPhoto.css({
						"top": "-60px",
						"left": "40px"
					})
					img.onload = function() {
						ctx3.drawImage(img, 0, 0, cw, ch);
					}
				} else {
					canvas3.width = canvas2.width = canvas1.width = sw;
					canvas3.height = canvas2.height = canvas1.height = sh;
					cancas.css({
						"top": "-60px",
						"left": "40px"
					});
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
		var pT = teacherPhoto.css("top");
		var pL = teacherPhoto.css("left");
		var pH = teacherPhoto.height();
		var pW = teacherPhoto.width();
		var pZ = teacherPhoto.css("z-index");

		var cT = cancas.css("top");
		var cL = cancas.css("left");
		var cH = cancas.height();
		var cW = cancas.width();
		var cZ = cancas.css("z-index");
		var activePic = $(".coursewareList.active .coursewarePic").find('img').attr("src");
		teacherPhoto.css({
			"top": cT,
			"left": cL,
			"height": cH,
			"width": cW,
			"z-index": cZ
		});
		cancas.css({
			"top": pT,
			"left": pL,
			"height": pH,
			"width": pW,
			"z-index": pZ
		})
		canvas3.width = canvas2.width = canvas1.width = pW;
		canvas3.height = canvas2.height = canvas1.height = pH;
		cancas.width(pW);
		cancas.height(pH);
		img.src = activePic;
		img.onload = function() {
			ctx3.drawImage(img, 0, 0, pW, pH)
		}
		falge = !falge;
	}
});