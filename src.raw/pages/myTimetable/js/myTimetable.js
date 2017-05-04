window.onload = function() {

	//初始化页面
	! function() {
		//生成table格子
		var tbody = document.getElementById('tbody');
		for(var i = 0; i < 6; i++) {
			var tr = document.createElement("tr");
			for(var j = 0; j < 7; j++) {
				var td = document.createElement("td");
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}

		//生成“年”select
		var year = document.getElementById('year');
		var yearCount = 2150 - 2010;
		for(var i = 0; i <= yearCount; i++) {
			year.innerHTML += "<option>" + (i + 2010) + "年</option>"
		}
		//生成“月”select
		var month = document.getElementById('month');
		for(var i = 0; i < 12; i++) {
			month.innerHTML += "<option>" + (i + 1) + "月</option>"
		}
	}();
	var tbody = document.getElementById('tbody');
	var aTd = tbody.getElementsByTagName('td');
	var now = new Date() //获得当前正确Date
	var nowDate = now.getDate() //获得当前Date的日期
	var clickDate = nowDate;
	var nowtime = document.getElementsByClassName('nowtime')[0];$(".nowtime").eq(0)
	var weekDay = now.getDay();

	//	var daytime = document.getElementById('daytime');
	//		daytime.innerText =now.getFullYear()+'年'+ (now.getMonth()+1)+'月'
	//年和月的select元素
	var yearSelect = document.getElementById('year');
	var monthSelect = document.getElementById('month');
	var _weekDay = document.getElementById("week");
	_weekDay.innerText = getWeek(weekDay);
	//初始化默认选择年月和日历表
	function initialNowDate() {
		render(now.getFullYear(), now.getMonth() + 1, nowDate)
	}
	initialNowDate()

	tbody.onclick = function(ev) {
		ev = ev || window.event;
		var target = ev.target || srcElement;
		if(target.nodeName == "TD") {
			//					重新选择时间时,清空table中的tr,重新加载数据;
			$('#courseListBox').html("");
			//					只支持查询当天时间的课程；
			var beginDate = $(target).attr("today");
			var endDate = $(target).next().attr("today");
			if(!endDate) {
				endDate = $(target).parent().next().find("td").eq(0).attr("today")
			}
			serchCourse(beginDate, endDate)
			if($(target).attr("data-month")==13){
				$("#month_btn").text("1");	
			}else{
				$("#month_btn").text($(target).attr("data-month"));
			}
			if($(target).attr("data-month")==0){
				$("#month_btn").text("12");
			}
			_weekDay.innerText = getWeek(new Date($(target).attr("today")).getDay())

			//根据自定义属性月份是否相等来判断点击td时是否要重新渲染表格
			if(target.dataset.month == $(target).attr("data-month")) {
				for(var i = 0, len = aTd.length; i < len; i++) {
					//点击的时候，如果有搜索到元素的className含有active，则将active类去掉
					if(aTd[i].className.search("active") >= 0) {
						aTd[i].className = aTd[i].className.replace(/active/, "")
						break;
					}
				}
				target.className += " active";
				clickDate = target.innerHTML;
				var nowtime = document.getElementsByClassName('nowtime')[0];
				nowtime.innerText = document.getElementById('table_box').getElementsByClassName('active')[0].innerText;
				var len = document.getElementById('table_box').getElementsByClassName('active')[0].parentNode.children.length;
				for(var i = 0; i < len; i++) {
					document.getElementById('table_box').getElementsByClassName('active')[0].parentNode.children[i].index = i;
				}
				var size = document.getElementById('table_box').getElementsByClassName('active')[0].index;
				//				document.getElementById('week').innerText = getWeek(size);
			} else {
				//点击跳转到的月份为下一年一月或者上一年12月的情况处理
				if(target.dataset.month == 13) {
					// monthSelect.options[0].selected = true;
					// yearSelect.options[yearSelect.selectedIndex + 1].selected = true;
					render(parseInt($("#year_btn").text()), "1");
				} else if(target.dataset.month == 0) {
					// monthSelect.options[11].selected = true;
					// yearSelect.options[yearSelect.selectedIndex - 1].selected = true;
					render(yearSelect.selectedIndex + 2010, monthSelect.selectedIndex + 1);
				} else {
					monthSelect.options[target.dataset.month - 1].selected = true;
					clickDate = target.innerHTML //此时得到当前点击的日期。当一下渲染日历表的时候会用到这个日期
					render("", +target.className);
				}
			}
		}

	}

	/**
	 * [渲染日历表格]
	 * @param  {[number]} year  [由yearSelecte获得]
	 * @param  {[type]} month [由monthSelecte获得]
	 * 当传入第三个参数现实时间的getDate时，则clickDate取值有分歧
	 */
	function render(year, month) {
		for(var i = 0; i < aTd.length; i++) {
			aTd[i].innerHTML = "";
			aTd[i].className = "";
		}
		//获得传进来（当前）的年月和点击（之前）的日期
		year = year || yearSelect.selectedIndex + 2010;
		month = month || monthSelect.selectedIndex + 1;
		//传参数个数分歧,为3个时候代表为回到（初始化）当天
		if(arguments.length == 3) {
			clickDate = nowDate;
		}

		var monthBegin = new Date(year + "-" + checkTime(month) + "-01") //定义初始当前月份的开头日期
		var monthBeginDay = monthBegin.getDay(); //获得当前月份开头那天是星期几
		monthBegin.setDate(monthBegin.getDate(monthBegin.setMonth(monthBegin.getMonth() + 1)) - 1) //得到这个月份的结束日期。
		var monthEnd = new Date(monthBegin.getFullYear() + "-" + checkTime((monthBegin.getMonth() + 1)) + "-" + checkTime(monthBegin.getDate()))
		monthBegin = new Date(monthBegin.getFullYear() + "-" + checkTime(monthBegin.getMonth() + 1) + "-" + "01");
		var monthEndDate = monthEnd.getDate() //得到这个月份有多少天

		if(monthBeginDay == 0) {
			monthBeginDay = 7; //当月初为星期天的一个特殊情况的处理
		}

		//当点击（跳转）的日期大约当月最大日期，则将点击的日期设置为1
		if(clickDate > monthEndDate) {
			clickDate = 1;
		}
		//		本月
		for(var i = monthBeginDay - 1; i < (monthBeginDay - 1 + monthEndDate); i++) {
			aTd[i].innerHTML = i - monthBeginDay + 2;
			if(aTd[i].innerHTML == clickDate) {
				aTd[i].className = "active";
				var nowtime = document.getElementsByClassName('nowtime')[0];
				nowtime.innerText = document.getElementById('table_box').getElementsByClassName('active')[0].innerText;
				var daytime = document.getElementById('daytime');
				daytime.innerHTML ="<span id='year_btn'>" +year + "</span>年<span id='month_btn'>" + month + "</span>月";
			}
			if(i % 7 == 0 || ((i + 1) % 7 == 0)) {
				aTd[i].className += " holiday" //假期标红
			}
			aTd[i].dataset = new Object;
			aTd[i].dataset.month = month;
			$(aTd[i]).attr("data-month",month)
			aTd[i].setAttribute('today', year + "-" + checkTime(aTd[i].dataset.month) + "-" + checkTime(i - monthBeginDay + 2)) //设置自定义属性确定点击本月的上月时间

		}
		//		上月

		for(var i = monthBeginDay - 2; i >= 0; i--) {
			aTd[i].innerHTML = monthBegin.getDate(monthBegin.setDate(monthBegin.getDate() - 1));
			aTd[i].dataset = new Object;
			aTd[i].dataset.month = month-1;
			$(aTd[i]).attr("data-month",month-1)
			aTd[i].className = "unNowMonth";
			if(aTd[i].dataset.month==0){
				$(aTd[i]).attr('today', (year-1) + "-" + checkTime("12") + "-" + checkTime(aTd[i].innerHTML)) //如果上一月为上一年时
			}else{
				$(aTd[i]).attr('today', year + "-" + checkTime(aTd[i].dataset.month) + "-" + checkTime(aTd[i].innerHTML)) //设置自定义属性确定点击本月的时间
			}
		}
		//		下月
		for(var i = monthBeginDay - 1 + monthEndDate; i < aTd.length; i++) {
			aTd[i].innerHTML = monthEnd.getDate(monthEnd.setDate(monthEnd.getDate() + 1));
			aTd[i].dataset = new Object;
			aTd[i].dataset.month = month+1;
			$(aTd[i]).attr("data-month",month+1)
			aTd[i].className = "unNowMonth";
			if(aTd[i].dataset.month==13){
				$(aTd[i]).attr('today', (year+1) + "-" + checkTime("1") + "-" + checkTime(monthEnd.getDate())) //如果下月为下一年时
			}else{
				$(aTd[i]).attr('today', year + "-" + checkTime(aTd[i].dataset.month) + "-" + checkTime(monthEnd.getDate())) //设置自定义属性确定下月的时间
			}
		}
	}

	function checkTime(i) {
		if(i < 10) {
			i = "0" + i
		}
		return i
	}

	function getWeek(size) {
		switch(size) {
			case 0:
				return "周日"
				break;
			case 1:
				return "周一"
				break;
			case 2:
				return "周二"
				break;
			case 3:
				return "周三"
				break;
			case 4:
				return "周四"
				break;
			case 5:
				return "周五"
				break;
			case 6:
				return "周六"
				break;

		}
	}
	if(sessionStorage.obj) {
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
		var activeTd = $("td.active");
		var nowDay = activeTd.attr("today");
		var endDate = activeTd.next().attr("today");
		if(!endDate) {
			endDate = activeTd.parent().next().find("td").eq(0).attr("today")
		}
		serchCourse(nowDay, endDate)
	}
	//点击日历按钮增加月份
	var m;
	var y;
	$(".nextday").on("click", function() {
		m = parseInt($("#month_btn").text());
		y = parseInt($("#year_btn").text());
		m = m + 1
		if(m % 13 == 0) {
			m = 1;
			y = parseInt($("#year_btn").text())
			y = y + 1;
			$("#year_btn").text(y);
		}
		render(y, m);
		$("#courseListBox").html("")
		var activeTd = $("td.active");
		var nowDay = activeTd.attr("today");
		var tomorrow = activeTd.next().attr("today");
		if(!tomorrow) {
			tomorrow = activeTd.parent().next().find("td").eq(0).attr("today")
		}
		serchCourse(nowDay, tomorrow)
		$("#week").text(getWeek(new Date($(".active").attr("today")).getDay()));
		$("#month_btn").text(m);
	})
	$(".pverday").on("click", function() {
		m = parseInt($("#month_btn").text());
		y = parseInt($("#year_btn").text());
		m = m - 1
		if(m % 13 == 0) {
			m = 12;
			y = parseInt($("#year_btn").text())
			y = y - 1;
			$("#year_btn").text(y);
		}
		render(y, m)
		$("#courseListBox").html("")
		var activeTd = $("td.active");
		var nowDay = activeTd.attr("today");
		var tomorrow = activeTd.next().attr("today");
		if(!tomorrow) {
			tomorrow = activeTd.parent().next().find("td").eq(0).attr("today")
		}
		serchCourse(nowDay, tomorrow)
		$("#week").text(getWeek(new Date($(".active").attr("today")).getDay()));
		$("#month_btn").text(m);
	})
		//	ajax动态加载数据
	//	ajax动态加载数据
	function serchCourse(beginDate,endDate){
		var t=new Date().getTime();
		$.ajax({
			type: "get",
			url: "/api/view/user/course/schedules/findStudentList",
			async: true,
			dataType: 'json',
			data:{
				"t":t,
				"token":userToken,
				"beginDate":beginDate,
				"endDate":endDate,
				"removedFlag":0
			},
			success: function(data) {
				notlogin(data);
				if(data.code == 6012) {
					return false;
				}
				var data = data.data;
				var len = data.length;
				var resultImg = '<img src="../../../img/result.png"/>';
				if(len==0){
					var $tr = $("<tr>");
					$tr.html(resultImg);
					$("#courseListBox").html($tr)
					$("#courseListBox tr").css({"border":"none","text-align":"center"})
				}
				for(var i = 0; i < len; i++) {
					if(!data[i].courseCosts.coursePlans.ucanFile) {
						var u = "../../img/default-course.png";
					} else {
						var u = data[i].courseCosts.coursePlans.ucanFile.newUrl;
					}
					createTr(u, data[i].courseCosts.coursePlans.courses.name, data[i].courseCosts.beginTime, data[i].courseCosts.beginTimeStr, data[i].courseCosts.endTimeStr, i, data[i].courseCosts.coursePlans.courses.mode, data[i].courseCosts.rooms, data[i].id,data[i].courseCosts.id, data[i].id);
				}
			},
			error: function() {
				console.log("错误")
			}
		});
	}
	//取消课程
	function cancelCourse(courseId,room){
		var t=new Date().getTime();
		var bl = confirm("您确定要取消该课程吗？");
		if(bl){
			if(room==null||room.status != 0) {
				$.ajax({
					type:"post",
					url:"/api/view/user/course/schedules/remove?token="+userToken+"&t="+t,
					async:true,
					dataType: 'json',
					data: {
						"ids": courseId
					},
					success: function(data) {
						notlogin(data);
						if(data.code == 6012) {
							return false;
						} else if(data.code == 0) {
							alert(data.message);
							history.go(0);
						}
					},
					error: function() {
						console.log("错误")
					}
				});
			}
		}else{
			return false;
		}
		
	}
	//	创建tr
	function createTr(img, courseName, beginDate, bigintTimeStr, endTimeStr, i, mode, room, id,courseId, costId) {
		var $tr = $("<tr></tr>");
		var str = '<td><img src="' + img + '"/></td>';
		str += '<td class="br-r txt-l coursePhotoText">';
		str += '<p class="courseName">' + courseName + '</p>';
		str += '<p class="f-size13">约课编号：' + fillPre(courseId) + '</p>';
		str += '<p class="f-size13">班内序号：' + fillPre(costId) + '</p>';
		str += '<p class="f-size13">在线授课</p>';
		str += '<p class="f-size13 mt3 fn-c0"><span class="courseMake bg-y">班课</span></p></td>';
		str += '<td class="br-r">';
		str += '<p class="f-size13">' + formatTime(beginDate).monthTime + '月' + formatTime(beginDate).dayTime + '号</p>';
		str += '<p class="f-size16">' + bigintTimeStr + '-' + endTimeStr + '</p></td>';
		str += '<td class="br-r"><p class="f-size13 typeP"></p><p class="f-size13">距离上课还有</p>';
		str += '<p class="f-size13"><span class="t_d"></span><span class="t_h"></span><span class="t_m"></span></p>';
		str += '</td><td>';
		str += '<p><a class="btn fn-c0 gotoroom">进入教室</a></p>';
		str += '<p class="mt35"><a class="btn fn-c0 cancelCourse" data-course="' + id + '">取消课程</a></p>';
		str += '</td>';
		$tr.html(str);
		$("#courseListBox").append($tr);
		(mode == "ooo") ? $(".courseMake").eq(i).text('1对1'): $(".courseMake").eq(i).text('班课');
		if(room === null) {
			$(".typeP").eq(i).text("未开课");
			$(".typeP").eq(i).siblings("p").css("display", "none")
			GetRTime(beginDate, i)
			$(".gotoroom").eq(i).addClass("disable");
		} else
		if(room.status == 0) {
			$(".typeP").eq(i).text("正在上课");
			$(".typeP").eq(i).siblings("p").css("display","none");
			$(".cancelCourse").eq(i).on("click",function(){
				alert('不可删除"正在上课"的课程！！！')
				return false;
			})
			if(mode=="ooo"){
				$(".gotoroom").eq(i).attr("href", "../oooCourse/Student.html?roomId=" + room.id);
			}else{
				$(".gotoroom").eq(i).attr("href", "../tapedLessons-b/tapedLessons-b.html?roomId=" + room.id);
			}
			GetRTime(beginDate, i)
		} else
		if(room.status == 1) {
			$(".typeP").eq(i).text("课程已结束");
			$(".typeP").eq(i).siblings("p").css("display", "none");
			// $(".cancelCourse").eq(i).addClass("disable");
			$(".gotoroom").eq(i).addClass("disable");
		}
		$(".cancelCourse").eq(i).on('click', function() {
			$(this).attr("data-course");
			var cancelCourseTXT = $(this).parent().parent().prev("td").find("p.typeP").text();
			// if(cancelCourseTXT=="课程已结束"){
			// 	return false;
			// }
			cancelCourse(costId,room);
		})
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
	//倒计时
	var time1 = null;

	function GetRTime(beginDate, i) {
		EndTime = new Date(beginDate);
		NowTime = new Date();
		t = EndTime.getTime() - NowTime.getTime();
		var d = 0;
		var h = 0;
		var m = 0;
		var s = 0;
		if(t > 0) {
			d = Math.floor(t / 1000 / 60 / 60 / 24);
			h = Math.floor(t / 1000 / 60 / 60 % 24);
			m = Math.floor(t / 1000 / 60 % 60);
			s = Math.floor(t / 1000 % 60);
		} else
		if(t <= 0) {
			h = "00";
			m = "00";
			clearInterval(time1);
		}
		$(".t_d").eq(i).text(d + "天");
		$(".t_h").eq(i).text(h + "时");
		$(".t_m").eq(i).text(m + "分");
	}
}