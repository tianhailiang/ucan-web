$(function() {
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
	var webSocket = new WebSocket('"'+ucandomain+":"+ucanport+ucanlocation+ucanroomID+'/drawing"'); //学生
	// var webSocket = new WebSocket("ws://192.168.3.98:80/s1/s/room_2/drawing"); //学生
	webSocket.onopen = function() {

		webSocket.onmessage = function(event) {
			console.log(event.data)
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
			if(str[0] == "Teacher") {
				if(str[1] == "next") {
					changeBg(str[2])
				}
				if(str[1] == "prev") {
					prev();
				}
			}

		}

	};
	$(".menu li").click(function() {
		var index = $(this).index(".menu li");
		$(".option").css({
			display: "none"
		}).eq(index).css({
			display: "block"
		});
		$(".menu li").removeClass("active").css({
			boxShadow: "none"
		});
		$(this).addClass("active");
	});
	$(".option li").click(function() {
		$(".option li").css("color", "#000").css("text-shadow", "none");
		$(this).css("color", "cadetblue").css("text-shadow", "0 0 30px cadetblue");
	});
	$(".option:eq(0) li").on('click', function() {
		if($(this).attr("data-role") == "pen") {
			obj.pen();
		} else {
			obj.type = $(this).attr("data-role");
			obj.draw();
		}
	});
	$(".menu li:last").on('click', function() {
		obj.clear();
	});
	$(".option:last input").change(function() {
		obj.xpsize = $(this).val();
	});

});
