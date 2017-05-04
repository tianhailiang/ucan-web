//获取URL参数中的name:value
function getQueryString(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
}

var searchType = getQueryString("searchType");
var value = getQueryString("value");
var flag = true;
var str = "";
var size = 4;
var page = 0;
var totlePage = '';
var price = "";
var mode = "";
//查找课程
function findCoursePage(page) {
	var t=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/guest/courses/findPage",
		dataType: "json",
		async: false,
		data: {
			"t":t,
			"name": value,
			size: size,
			page: page
		},
		success: function(data) {
			var data = data.data;
			if(data.total == 0){
				str = '<img src="img/result.png" id="result"/>';
			}else{
				for(i in data.rows) {
				if(data.rows[i].cost == 0) {
					price = "免费";
				} else {
					price = "￥" + data.rows[i].cost;
				}
				if(!data.rows[i].ucanFile){
					data.rows[i].ucanFile = "../../img/default-course.png";
				}else{
					data.rows[i].ucanFile = data.rows[i].ucanFile.newUrl;
				}
				str += '<div class="pub course">';
				str += '<a href="../../course.html?courseId=' + data.rows[i].id + '"><img src="'+data.rows[i].ucanFile+'" alt="" /></a>';
				if(data.rows[i].beginDate != "" && data.rows[i].endDate != "") {
					var beginDate = data.rows[i].beginDate.split("-");
					var endDate = data.rows[i].endDate.split("-");
					str += '<div class="course_content"><a href="../../course.html?courseId=' + data.rows[i].id + '"><p>' + data.rows[i].name + '</p></a><span>' + beginDate[1] + '月' + beginDate[2] + '日开课-' + endDate[1] + '月' + endDate[2] + '日结课</span><br>';
				} else {
					str += '<div class="course_content"><p>' + data.rows[i].name + '</p><span>开课时间：暂无</span>';

				}
				str += '<span>授课老师：' + data.rows[i].teacher.name + '</span><br><span id="price">' + price + '</span><a href="../../course.html?courseId=' + data.rows[i].id + '"><input type="button" style="background:#6a3906" class="btn" value="立即约课"/></a></div></div>';
			}
			}
			
			$(".page_content").html(str);
			totlePage = Math.ceil(data.total / size);
			if(totlePage == 0) {
				totlePage = 1;
			}
			str = "";
		},
		error: function() {}
	});
}

//查找教师
function findTeacherPage(page) {
	var t=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/guest/teachers/searchTeacher",
		dataType: "json",
		async: false,
		data: {
			"t":t,
			"name": value,
			size: size,
			page: page
		},
		success: function(data) {
			var data = data.data;
			if(data.total == 0){
				str = '<img src="img/result.png" id="result"/>';
				$(".page_content").html(str);
			}
			else{
				for(i in data.rows) {
				str += '<div class="pub teacher">';
				if(data.rows[i].ucanFile == null) {
							newUrl = '../../img/teacher-header.png';
						} else {
							newUrl = data.rows[i].ucanFile.newUrl
						}
				str += '<a href="../teacherHome/teacherHome.html?teacherId=' + data.rows[i].id + '"><img class="img" src="' + newUrl + '" alt="" /></a><div class="course_content">';
				str += '<a href="../teacherHome/teacherHome.html?teacherId=' + data.rows[i].id + '"><p>' + data.rows[i].name + '</p></a>';
				str += '<span class="about">' + data.rows[i].about + '</span>';
				//				alert(data.rows[i].id);
				var ind = '.span_content' + data.rows[i].id + ' p:eq(0) span';
				var t=new Date().getTime();
				$.ajax({
					type: "GET",
					url: "/api/view/guest/courses/findPage",
					dataType: "json",
					async: false,
					data: {
						"t":t,
						teacherId: data.rows[i].id,
						size: 1000,
						page: 0
					},
					success: function(data) {
						var pr = "";
							var data_course = data.data;
						if(data_course.total == 0) {
							str += '<br><span>暂无课程</span>';
						} else if(data_course.total <= 2){
							str += '<div class="span_content">';
							for(var j in data_course.rows) {
								if(data_course.rows[j].cost == 0) {
									pr = "免费";
								} else {
									pr = "￥" + data_course.rows[j].cost;
								}
								if(data_course.rows[j].mode == "ooo") {
									mode = "一对一";
								} else {
									mode = "直播课";
								}
								str += '<p class="mar"><span class="pink ' + data_course.rows[j].teacher.id + '">' + mode + '：</span>' + data_course.rows[j].name + '<span class="persons" style="margin-left:20px;">最大容量：' + data_course.rows[j].maxStudentCount + '人</span><span class="price_t" style="margin-left:20px;">' + pr + '</span></p>';

							}
							str += "</div>";
						} else if(data_course.total > 2){
							str += '<div class="span_content">';
							for(var m in data_course.rows) {
								if(data_course.rows[m].cost == 0) {
									pr = "免费";
								} else {
									pr = "￥" + data_course.rows[m].cost;
								}
								if(data_course.rows[m].mode == "ooo") {
									mode = "一对一";
								} else {
									mode = "直播课";
								}
								str += '<p class="mar"><span class="pink ' + data_course.rows[m].teacher.id + '">' + mode + '：</span>' + data_course.rows[m].name + '<span class="persons" style="margin-left:20px;">最大容量：' + data_course.rows[m].maxStudentCount + '人</span><span class="price_t" style="margin-left:20px;">' + pr + '</span></p>';

							}
							str += "</div>";
							str += '<span class="slide"><span style="color:#a0a0a0;" class="toggle">更多课程</span><i class="icon-up"></i></span>';
						}

					},
					error: function() {}
				});
				str += "</div></div>";
				$(".page_content").html(str);
				$(".page_content .slide").on("click", function(ev) {
					var _this = ev.target;
					var $this = $(_this);
					wh = $this.parents(".course_content").find(".span_content").css("height");
					// alert(wh);
					if(wh == "45px") {
						var h=($this.parents(".course_content").find(".span_content").children("p.mar").length-2)*20;
						$this.parents(".course_content").find(".span_content").animate({"height" : 50+h+"px"}, 500);
						$this.parents(".course_content").parents(".teacher").animate({"height" : 300+h+"px"}, 500);
						$(this).children("span.toggle").text("收起课程");
						$(this).children('.icon-up').addClass("rotate");
						// flag = false;
					} else {					
						$this.parents(".course_content").find(".span_content").animate({"height" : "45px"}, 500);
						$this.parents(".course_content").parents(".teacher").animate({"height" : "300px"}, 500);
						$(this).children("span.toggle").text("更多课程");
						$(this).children('.icon-up').removeClass("rotate");
							// flag = true;
					}
					
				});
			}
			}
			totlePage = Math.ceil(data.total / size);
			if(totlePage == 0) {
				totlePage = 1;
			}
			str = "";
		},
		error: function() {}
	});
}

if(searchType == 1) {
	findCoursePage();
	// $(".btn").on("click", function() {
	// 	window.location.href = "../login/login.html";
	// })
} else {
	findTeacherPage();

}




laypage({
	cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
	pages: totlePage, //总页数
	skip: true, //是否开启跳页
	groups: 4, //连续显示分页数
	jump: function(obj, first) {
		if(!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
			if(searchType == 1) {
				findCoursePage((obj.curr) - 1);
			} else {
				findTeacherPage((obj.curr) - 1);
			}
		}
	}
});