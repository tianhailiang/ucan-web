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