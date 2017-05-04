var userStr = JSON.parse(sessionStorage.obj);
var token = userStr.user.userToken;
var teacherId = userStr.user.id;
var str = "";
var t = new Date().getTime();
var totlePage = "";
var page = 0;
var size = 4;

function searchCourse(studentId) {
	$.ajax({
		type: "GET",
		url: "/api/view/user/course/schedules/findList",
		dataType: "json",
		async: false,
		data: {
			t: t,
			token: token,
			studentId: studentId,
			teacherId: teacherId
		},
		success: function(requset) {
			for (var m = 0; m < requset.data.length; m++) {
				str += '<div class="courseL"><span class="fn-c0 fn-w6 fl">' + requset.data[m].courseCosts.coursePlans.courses.name + '</span><span class="fl">' + requset.data[m].courseCosts.beginTime + ' - ' + requset.data[m].courseCosts.endTimeStr + '</span></div>';
			}
		}
	});
	return str;
}

function searchStudent(page, size) {
	$.ajax({
		type: "GET",
		url: "/api/view/user/students/findCourseSchedulesPage",
		async: false,
		data: {
			token: token,
			t: t,
			page: page,
			size: size
		},
		dataType: "json",
		success: function(requset) {
			notlogin(requset);
			var data = requset.data.rows;
			totlePage = Math.ceil(requset.data.total / size);
			if (requset.code == 6012) {
				return false;
			}
			if (data.length !== 0) {
				var html = "";
				for (var i = 0; i < data.length; i++) {
					var newUrl = data[i].ucanFile;
					if (!newUrl) {
						newUrl = "../../img/body-header.png";
					} else {
						newUrl = data[i].ucanFile.newUrl;
					}
					html += '<ul class="sc-kuang" data-stuId="' + data[i].id + '">\
                    <li class="list-type">\
                        <div>\
                            <span></span>\
                        </div>\
                    </li>\
                    <li class="sc-two">\
                        <img src="' + newUrl + '"/>\
                        <div class="course-detail">\
                            <h3>' + data[i].name + '</h3><p><label>ID</label>：<span>' + fillPre(data[i].id) + '</span></p>\
                            <span data-a="' + i + '" class="details">查看课程</span>\
                        </div><div class="courseLs">';
					html += searchCourse(data[i].id);
					html += '</div></li></ul>';
					str = "";
				}
				$(".sc-kuangs").html(html);
				html = "";
			} else {
				var imgStr = "<img src='../../img/result.png'>"
				$(".default").css({
					textAlign: "center"
				});
				$(".default").html(imgStr);
			}
		},
		error: function(err) {
			console.log(err.message);
		}
	})
}
$(function() {

	searchStudent(page, size);

	laypage({
		cont: $('#pagesss'), //容器。值支持id名、原生dom对象，jquery对象,
		pages: totlePage, //总页数
		skip: true, //是否开启跳页
		skin: '#6a3906',
		groups: 3, //连续显示分页数
		jump: function(obj, first) {
			if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				searchStudent((obj.curr) - 1, size);
			}
		}
	});

	$(".frame-rg").on("click", ".details", function() {
		$(".courseLs").eq($(this).attr("data-a")).slideToggle();
	})
});



//点击批量管理
//		$(".sc-top .btn").click(function() {
//			$("div.sc-kuang").css({
//				"justify-content": "space-between"
//			}).children().css({
//				"display": "block"
//			});
//			$("ul.sc-kuang li.list-type").css({
//				"display": "flex"
//			});
//		});
//		//点击批量管理后，点击每节课前的选中按钮
//		$(".frame-rg").on("click", "ul.sc-kuang .list-type", function() {
//			$(this).children("div").children("span").toggleClass("choosed");
//			if ($(this).children("div").children("span").attr("class") == "") {
//				$("div.sc-kuang .list-type div span").attr("class", "");
//			}
//			var s = $("ul.sc-kuang").size();
//			if ($(".choosed").size() == s) {
//				$("div.sc-kuang .list-type div span").attr("class", "choosed");
//			}
//		});
//		//点击批量管理后，点击全选按钮
//		$("div.sc-kuang .list-type").on("click", function() {
//			if ($(this).children("div").children("span").hasClass("choosed")) {
//				$(this).children("div").children("span").attr("class", "");
//				$("ul.sc-kuang .list-type div span").attr("class", "");
//			} else {
//				$("ul.sc-kuang .list-type div span").attr("class", "choosed");
//				$(this).children("div").children("span").attr("class", "choosed");
//			}
//
//		});
//点击批量管理后，选择相应学生，点击删除时触发
//		$("div.sc-kuang").on("click", ".btn", function() {
//			var html = '<div class="sc-pop">\
//      <a class="c-off" href="javascript:;"><img src="../../img/off.png" width="100%" alt=""></a>\
//      <div class="sc-title">\
//          <span>温馨提示</span>\
//      </div>\
//      <div class="sc-date">\
//          确认删除这些学生吗？\
//      </div>\
//      <div class="c-form">\
//          <a href="javascript:;" class="bg-c4">取消</a>\
//          <a class="bg-c1">确定</a>\
//      </div>\
//  </div>';
//			$(".canbox-3").html(html).css({
//				"display": "block"
//			});
//		});
//点击删除弹出框中的确认按钮
//		$(".canbox-3").on("click", "a.bg-c1", function() {
//			var data = [];
//			var choosed = document.querySelectorAll("ul.sc-kuang .choosed");
//			for (var i = 0; i < choosed.length; i++) {
//				data[i] = choosed[i].parentNode.parentNode.parentNode.attributes["data-stuId"].nodeValue;
//			}
//			var t = new Date().getTime();
//			$.ajax({
//				type: "POST",
//				url: "/api/view/user/courses/removeCourses?token=" + token, //删除课程的接口
//				data: {
//					"t": t,
//					"removeId": data.join(",")
//				},
//				success: function(data) {
//					notlogin(data);
//					if (data.code == 6012) {
//						return false;
//					}
//					if (data.code == 0) {
//						window.location.reload();
//					} else {
//						$(".canbox").slideUp();
//					}
//				},
//				error: function(err) {
//					console.log(err.message);
//				}
//			})
//		})
//	})
//	//点击弹框中的取消按钮，弹框消失
//$(".canbox").on("click", ".c-form .bg-c4", function() {
//	$(".canbox").slideUp();
//	$("body").css({
//		"overflow": "initial"
//	});
//});
////点击弹框中右上角的关闭图标，弹框消失
//$(".canbox").on("click", ".c-off", function() {
//	$(".canbox").slideUp();
//	$("body").css({
//		"overflow": "initial"
//	});