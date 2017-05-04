var teacherId = getQueryString("teacherId");
var totlePageC = ""; // 总页数
var totlePageE = ""; // 总页数
var queryStr = ""; // 评价的字符串
var searchTeacherStr = ""; // 查询老师的字符串
var querySize = 4; //每页的评价个数
var courseSize = 6; //每页的课程个数
var userT = "";
var isBool = false;

$(function() {
	//获取老师详细信息
	$.ajax({
		type: "get",
		url: "/api/view/guest/teachers/searchTeacher", //#59（分页）
		dataType: "json",
		async: false,
		data: {
			"t": new Date().getTime(),
			id: teacherId
		},
		success: function(data) {
			var ucanFileS = "../../img/teacher-header.png";
			if (data.data.rows[0].ucanFile) {
				ucanFileS = data.data.rows[0].ucanFile.newUrl;
			}

			searchTeacherStr = '<div class="tch-header"><img src="' + ucanFileS + '" width="100%" height="100%" alt=""></div><div class="tch-ti"><h3 class="fn-s3 fn-w6">' + data.data.rows[0].name + '<span class="bg-c3 fn-s2 fn-c0">' + data.data.rows[0].workYears + '年教龄</span><span class="collection fn-c0"><i></i>收藏</span></h3><p>简介：' + data.data.rows[0].about + '</p></div>';

			$(".hom-title").html(searchTeacherStr);
			searchTeacherStr = "";
		}
	});

	//	查询老师对应课程
	searchTeacherS(teacherId, 0, courseSize);

	//	查询老师评价
	paging(0, querySize);

	//进入页面判断登陆用户有没有收藏
	if (sessionStorage.obj) {
		//获取token 
		var userStr = JSON.parse(sessionStorage.obj);
		userT = userStr.user.groups;
		if (userT == "teacher") {
			$(".collection").hide();
		}
		$.ajax({
			type: "get",
			url: "/api/view/user/favorite/teachers/check",
			dataType: "json",
			data: {
				"t": new Date().getTime(),
				teacherId: teacherId,
				token: token
			},
			success: function(data) {
				if (data.data) {
					$(".collection>i").css("background", "url(../../img/i-sc-f.png) no-repeat");
					isBool = true;
				}
			}
		});
	}
	
	// 单击收藏按钮 收藏与取消
	$(".collection").click(function() {
		if (isBool) {
			if (userT == "teacher") {
				alert("教师不允许收藏课程");
			} else {
				$.ajax({
					type: "POST",
					url: "/api/view/user/favorite/teachers/delete",
					dataType: "json",
					data: {
						"t": new Date().getTime(),
						teacherId: teacherId,
						token: token
					},
					success: function(data) {
						notlogin(data);
						if (data.code == 0) {
							$(".collection>i").css("background", "url(../../img/i-sc.png) no-repeat");
							isBool = false
						}
					}
				});
			}
		} else {
			$.ajax({
				type: "POST",
				url: "/api/view/user/favorite/teachers/add",
				dataType: "json",
				data: {
					"t": new Date().getTime(),
					teacherId: teacherId,
					token: token
				},
				success: function(data) {
					if (data.code == 0) {
						$(".collection>i").css("background", "url(../../img/i-sc-f.png) no-repeat");
						isBool = true
					} else {
						if (data.code == 1500) {
							alert("系统繁忙，稍后重试。")
						} else {
							notlogin(data);
						}
					}
				}
			});
		}
		return false
	});

	//	*****************  分页
	//	教师主页：老师的所有课程  ***分页
	laypage({
		cont: $('#page3'), //容器。值支持id名、原生dom对象，jquery对象
		pages: totlePageC, //总页数
		skip: true, //是否开启跳页
		skin: '#6a3906',
		groups: 3, //连续显示分页数
		jump: function(obj, first) {
			if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				searchTeacherS(teacherId, (obj.curr) - 1, courseSize)
			}
		}
	});

	//	教师主页：学生对老师的评价  ***分页
	laypage({
		cont: $('#page4'), //容器。值支持id名、原生dom对象，jquery对象,
		pages: totlePageE, //总页数
		skip: true, //是否开启跳页
		skin: '#6a3906',
		groups: 3, //连续显示分页数
		jump: function(obj, first) {
			if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				paging((obj.curr) - 1, querySize);
			}
		}
	});
	//	*****************  分页
});

//	查询老师对应课程
function searchTeacherS(teacherId, page, size) {
	//		获取特别推荐
	//				var id = courseTopicsIds;
	$.ajax({
		type: "get",
		url: "/api/view/guest/courses/findPage", //#59（分页）
		dataType: "json",
		async: false,
		data: {
			"t": new Date().getTime(),
			teacherId: teacherId,
			page: page,
			size: size
		},
		success: function(data) {
			var ucanFileH = "";
			total = data.data.total;
			for (var i = 0; i < data.data.rows.length; i++) {
				if (data.data.rows[i].ucanFile) {
					ucanFileH = data.data.rows[i].ucanFile.newUrl;
				} else {
					ucanFileH = "../../img/default-course.png";
				}
				if (data.data.rows[i].cost == 0) { //判断免费||价钱
					data.data.rows[i].cost = "免费";
				}
				var starT = data.data.rows[i].beginDate.split("-");
				var endT = data.data.rows[i].endDate.split("-");

				searchTeacherStr += '<div class="cou-deta fl"><img src="' + ucanFileH + '" width="200px" height="100%" alt="">';

				searchTeacherStr += '<div class="course-arr"><p class="fn-s1 fn-w6 text-ell">' + data.data.rows[i].name + '</p><p>课程排期：' + data.data.rows[i].beginDate + '日开课--' + data.data.rows[i].endDate + '结课</p><p>课时：共' + data.data.rows[i].costCounts + '节</p><a class="bg-c1 fn-c1 fn-s0" href="../../course.html?courseId=' + data.data.rows[i].id + '">' + data.data.rows[i].cost + '+ | 马上报名</a></div>';
				
				searchTeacherStr += '</div>';
				ucanFileH = "";
			}
			$(".course-box").html(searchTeacherStr);

			totlePageC = Math.ceil(data.data.total / size);
			if (totlePageC == 0) {
				totlePageC = 1;
			}
			searchTeacherStr = "";
		},
		error: function() {
			console.log("出错了。。。");
		}
	});
}

//	查询老师评价
function paging(page, size) {
	$.ajax({
		type: "get",
		url: "/api/view/guest/courses/evaluations/query", //#68
		dataType: "json",
		async: false,
		data: {
			"t": new Date().getTime(),
			teacherId: teacherId,
			size: size,
			page: page
		},
		success: function(data) {
			for (var i in data.data.rows) {
				queryStr += '<div class="s-comment oh"><div class="comment-l fn-s0 fn-c0 fl"><img src="../../img/logos.png" width="100%" height="100px" alt=""></div><div class="comment-r fl"><div class="flower">'
					//				评分图片显示
				for (var j = 0; j < data.data.rows[i].evaluationFraction; j++) {
					queryStr += ' <img src="../../img/flower.png" alt="">'
				}
				for (var m = 0; m < 5 - data.data.rows[i].evaluationFraction; m++) {
					queryStr += ' <img src="../../img/flower-g.png" alt="">'
				}
				queryStr += '</div><p>' + data.data.rows[i].evaluation + '</p><p><span class="c-y">' + data.data.rows[i].updatedAt + '</span>&nbsp;&nbsp;&nbsp;<span class="c-y">' + data.data.rows[i].courses.name + '</span></p></div></div>';
			}
			$(".cou-detas").html(queryStr);

			totlePageE = Math.ceil(data.data.total / size);
			if (totlePageE == 0) {
				totlePageE = 1;
			}
			queryStr = "";
		},
		error: function() {
			console.log("出错了");
		}
	});
}

//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};