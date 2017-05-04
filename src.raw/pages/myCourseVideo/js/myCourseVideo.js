$(function() {
	if(sessionStorage.obj){
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
		ClassCourse()
		oooCourse()
	}
		//	ajax动态加载数据
	function oooCourse() {
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: "/api/view/user/courses/findCourseSchedulesList",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"mode": "ooo"
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data;
				var mode = "ooo"
				if(data!=null){
					var len = data.length;
					if(len !== 0){
						for(var i = 0; i < len; i++) {
							if(data[i].ucanFile == null) {
								newUrl = '../../img/default-course.png';
							} else {
								newUrl = data[i].ucanFile.newUrl
							}
							createTr2(newUrl, data[i].name, data[i].beginDate, data[i].endDate, data[i].costCounts, data[i].id);
							createDownTr(data[i].id,mode);
						}
					}else{
						var imgStr = "<img src='../../img/result.png'>"
						$("#courseListBox2").css({
							textAlign: "center"
						});
						$("#courseListBox2").html(imgStr);
					}
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}

	function ClassCourse() {
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: "/api/view/user/courses/findCourseSchedulesList",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"mode": "live"
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var data = data.data;
				var mode="live"
				if(data!=null){
					var len = data.length;
					for(var i = 0; i < len; i++) {
						if(data[i].ucanFile == null) {
							newUrl = '../../img/default-course.png';
						} else {
							newUrl = data[i].ucanFile.newUrl;
						}
						createTr(newUrl, data[i].name, data[i].beginDate, data[i].endDate, data[i].costCounts, data[i].id);
						createDownTr(data[i].id,mode);
					}
				}else{
					var imgStr = "<img src='../../img/result.png'>"
					$("#courseListBox").css({
						textAlign: "center"
					});
					$("#courseListBox").html(imgStr);
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}
	//	创建tr
	function createTr(img, courseName, beginDate, endDate, costCounts, courseId) {
		var $tr = $("<tr id=courseId_" + courseId + "></tr>");
		var str = '<td><img src="' + img + '"/></td><td class="txt-l br-r coursePhotoText">';
		str += '<p class="tName">' + courseName + '</p>';
		str += '<p class="f-sizeimg13">约课编号：' + formatTime(beginDate).yearTime + formatTime(beginDate).monthTime + formatTime(beginDate).dayTime + '</p>';
		str += '<p class="f-sizeimg13">班内序号：' + fillPre(courseId) + '</p>';
		str += '<p class="f-size13">在线授课</p>';
		str += '<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y">班课</span></p>';
		str += '</td><td class="br-r">';
		str += '<p class="f-size13 fn-w6">报名时间</p>';
		str += '<p class="f-size13">' + formatTime(beginDate).yearTime + '年' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '日</p></td>';
		str += '<td class="br-r w25"><p class="f-size13 fn-w6">课程安排</p>';
		str += '<p class="f-size13">' + formatTime(beginDate).yearTime + '年' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '日-' + formatTime(endDate).yearTime + '年' + formatTime(endDate).monthTime + '月' + formatTime(endDate).dayTime + '日</p>';
		str += '<p class="f-size13">共' + costCounts + '节课</p></td>';
		$tr.html(str);
		$("#courseListBox").append($tr);
	}

	//	创建tr
	function createTr2(img, courseName, beginDate, endDate, costCounts, courseId) {
		var $tr = $("<tr id=courseId_" + courseId + "></tr>");
		var str = '<td><img src="' + img + '"/></td><td class="txt-l br-r coursePhotoText">';
		str += '<p class="tName">'+courseName+'</p>';
		str += '<p class="f-sizeimg13">约课编号：' + formatTime(beginDate).yearTime + formatTime(beginDate).monthTime + formatTime(beginDate).dayTime + '</p>';
		str += '<p class="f-size13">班内序号：' + fillPre(courseId) + '</p>';
		str += '<p class="f-size13">在线授课</p>';
		str += '<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y">一对一</span></p>';
		str += '</td><td class="br-r">';
		str += '<p class="f-size13 fn-w6">报名时间</p>';
		str += '<p class="f-size13">' + formatTime(beginDate).yearTime + '年' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '日</p></td>';
		str += '<td class="br-r w25"><p class="f-size13 fn-w6">课程安排</p>';
		str += '<p class="f-size13">' + formatTime(beginDate).yearTime + '年' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '日-' + formatTime(endDate).yearTime + '年' + formatTime(endDate).monthTime + '月' + formatTime(endDate).dayTime + '日</p>';
		str += '<p class="f-size13">共' + costCounts + '节课</p></td>';
		$tr.html(str);
		$("#courseListBox2").append($tr);
	}
	//点击查看课程详情
	function courseDetails(courseId, obj) {
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: "/api/view/user/course/schedules/findStudentList",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"token": userToken,
				"courseId": courseId
			},
			success: function(data) {
				notlogin(data);
				if(data.code==6012){return false;}
				var downTrInfo = null;
				var data = data.data;
				len = data.length;
				if(len != 0) {
					obj.parent().siblings("td").find(".CourseDetailsHeader").text('共' + len + '节课');
					var mode = obj.attr("mode");
					for(var i = 0; i < len; i++) {
						var dataTime = data[i].courseCosts.beginTime;
						var dataTime = data[i].courseCosts.beginTime;
						var beginTimeStr = data[i].courseCosts.beginTimeStr;
						var endTimeStr = data[i].courseCosts.endTimeStr;
						downTrInfo = '<li><span class="">第' + (i + 1) + '节课</span><span class="">' + formatTime(dataTime).yearTime + '年' + formatTime(dataTime).monthTime + '月' + formatTime(dataTime).dayTime + '日' + beginTimeStr + '-' + endTimeStr + '</span>';
						if(data[i].courseCosts.rooms == null) {
							downTrInfo += '<span class="typeP">未开课</span></li>';
						}
						if(data[i].courseCosts.rooms != null && data[i].courseCosts.rooms.status == 0) {
							var roomId = data[i].courseCosts.rooms.id;
							if(mode=="ooo"){
								downTrInfo += '<span class="typeP">正在直播</span><span><a href="../oooCourse/Student.html?roomId=' + roomId + '" class="btn">进入教室</a></span></li>';
							}else{
								downTrInfo += '<span class="typeP">正在直播</span><span><a href="../tapedLessons-b/tapedLessons-b.html?roomId=' + roomId + '" class="btn">进入教室</a></span></li>';
							}
						}
						if(data[i].courseCosts.rooms != null && data[i].courseCosts.rooms.status == 1) {
							var roomId = data[i].courseCosts.rooms.id;
							downTrInfo += '<span class="typeP">已结束</span>';
							if(mode=="live"){
								downTrInfo+='<span><a href="../tapedLessons/tapedLessons.html?roomId=' + roomId + '" class="btn">回放</a></span></li>';
							}else{
								downTrInfo+='</li>';
							}
						}
						obj.parent().siblings("td").find(".CourseDetailsBox").append(downTrInfo);
					}
				} else {
					obj.parent().siblings("td").find(".CourseDetailsHeader").html('<span style="width:auto" class="title_course">您尚未预订课程，预订请点击<a href="../course.html?courseId=' + courseId + '">查看课程</a></span>');
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}

	function createDownTr(courseId,mode) {
		var downTrInfo = "";
		var $downTr = $("<tr class='downTr'></tr>");
		var downTr = '<td class="br-r" colspan="3"><ul class="CourseDetailsBox show">';
		var len = 0;
		downTr += '<li class="CourseDetailsHeader"></li>';
		downTr += '</ul></td><td class="pos-r">';
		downTr += '<a class="CourseDetailsBtn fn-c0 pos-a" courseId="' + courseId + '" maker="true" falge="0" mode="'+mode+'">课程详情<i class="icon-up"></i></a></td>';
		$downTr.html(downTr);
		$("#courseId_" + courseId).after($downTr);

	}

	//	时间格式处理
	//		yyyy-mm-dd HH:MM:ss---->yyyy,mm,dd,hh,mm,ss
	function formatTime(time) {
		var yearTime = time.substring(0, 4);
		var monthTime = time.substring(5, 7);
		var dayTime = time.substring(8, 10);
		var hourTime = time.substring(11, 13);
		var minuteTime = time.substring(14, 16);
		return {
			'yearTime': yearTime,
			'monthTime': monthTime,
			'dayTime': dayTime,
			'hourTime': hourTime,
			'minuteTime': minuteTime
		}
	};
	//	计算现在时间于开课时间的差值
	function computationTime(beginDate) {
		var nowTime = new Date();
		var chaHours = parseInt(formatTime(beginDate).hourTime) - parseInt(nowTime.getHours());
		var chaMinutes = parseInt(formatTime(beginDate).minuteTime) - parseInt(nowTime.getMinutes());
		if(chaHours < 0) {
			chaHours = 0;
		}
		if(chaMinutes < 0) {
			chaMinutes = 0;
		}
		return {
			'chaHours': chaHours,
			'chaMinutes': chaMinutes
		}
	}
	//	却换table
	$("#courseListBoxHeader").on("click", "span", function() {
		var _index = $(this).index();
		$(this).addClass("active").siblings("span").removeClass("active");
		$("#table_content .table").eq(_index).removeClass('disnone').siblings('.table').addClass('disnone');
	})
	//	课程详情
	$("#courseListBox").on("click", function(ev) {
		var _this = ev.target;
		var $this = $(_this);
		if(_this.className.indexOf('CourseDetailsBtn') != -1||_this.className.indexOf("icon-up") !=-1) {
			var courseId = $this.attr("courseId");
			var maker = $this.attr("maker");
			var falge = $this.attr("falge");
			if(maker == "true") {
				if(falge == "0") {
					courseDetails(courseId, $this);
					$this.attr("falge", "1")
				}
				$this.parents(".downTr").find(".CourseDetailsBox").slideDown(600, function() {});
				$this.children('.icon-up').addClass("rotate180");
				$this.attr("maker", "false")
			} else {
				$this.parents(".downTr").find(".CourseDetailsBox").slideUp(600);
				$this.children('.icon-up').removeClass("rotate180");
				$this.attr("maker", "true")
			}
		}
	})
	$("#courseListBox2").on("click", function(ev) {
		var _this = ev.target;
		var $this = $(_this);
		if(_this.className.indexOf('CourseDetailsBtn') != -1||_this.className.indexOf("icon-up") !=-1) {
			var courseId = $this.attr("courseId");
			var maker = $this.attr("maker");
			var falge = $this.attr("falge");
			if(maker == "true") {
				if(falge == "0") {
					courseDetails(courseId, $this);
					$this.attr("falge", "1")
				}
				$this.parents(".downTr").find(".CourseDetailsBox").slideDown(600, function() {});
				$this.children('.icon-up').addClass("rotate180");
				$this.attr("maker", "false")
			} else {
				$this.parents(".downTr").find(".CourseDetailsBox").slideUp(600);
				$this.children('.icon-up').removeClass("rotate180");
				$this.attr("maker", "true")
			}
		}
	})
});
