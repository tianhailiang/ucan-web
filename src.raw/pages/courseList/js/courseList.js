var Topic = "";
var tStr = "";
var oooType = "ooo";
var page = 0;
var resultStr = "";

//特别推荐4个位置
$.ajax({
	type: "GET",
	url: "/api/view/guest/courses/findPageQuery",
	dataType: "json",
	data: {
		"t":new Date().getTime(),
		size: 4,
		page: 0,
		mode: oooType,
		isFinsh: "1"
	},
	success: function (data) {
		var searchCourse = data.data.rows;
		var ucanFileS = "";
		for (var n = 0; n < searchCourse.length; n++) {
			if (searchCourse[n].mode == "ooo") { // 判断课程类型
				searchCourse[n].mode = "1对1";
			} else {
				searchCourse[n].mode = "直播";
			}
			if (!searchCourse[n].beginDate) { // 判断课程类型
				searchCourse[n].beginDate = "已结课";
			}
			if (!searchCourse[n].ucanFile) {
				ucanFileS = "../../img/default-course.png";
			}else{
				ucanFileS = searchCourse[n].ucanFile.newUrl;
			}
			tStr += '<div class="t-list-t"><a href="../../course.html?courseId=' + searchCourse[n].id + '"><div class="c-list-img"><img src="' + ucanFileS + '" width="100%" alt=""><span class><i class="bg-cc'+ searchCourse[n].topic.id +'">'+searchCourse[n].topic.topic+'</i>'+searchCourse[n].beginDate+'</span></div></a><p class="fn-w6"><span class="cOoo fl bg-c3 c-o">'+searchCourse[n].mode+'</span>' + searchCourse[n].name + '</p><a href="../teacherHome/teacherHome.html?teacherId='+searchCourse[n].teacher.id+'"><p class="fn-s2 c-y">授课老师：'+searchCourse[n].teacher.name+'</p></a>';
			if (searchCourse[n].cost == 0) { //判断免费||价钱
				tStr += '<p class="fee fn-s1 c-y">免费</p></div>';
			}else{
				tStr += '<p class="free fn-s1 c-y">'+searchCourse[n].cost+'</p></div>';
			}
			if (n < 3) {
				for (var z = 0; z < 1; z++) { // 追加分割线
					tStr += '<span class="bor-das"></span>';
				}
			}
			ucanFileS = "";
		}
		$(".t-tuijian").eq(0).html(tStr);
		tStr = "";
	}
})

// 进入界面获取课程名称 查询对应课程的老师
$.ajax({
	type: "get",
	url: "/api/view/guest/courses/courseTopics?t="+new Date().getTime(),
	dataType: "json",
//	async: false,
	success: function (data) {
		for (var m = 0; m < data.data.length; m++) {
			Topic += '<div class="na-bt" data-page="0"><input type="hidden" value="' + data.data[m].id + '"><a href="javascript:;" class="after"> </a><a href="javascript:;" class="next"> </a></div><div class="color-title fn-s1 bor-d c-y"><div class="colored bor-1' + m + '">' + data.data[m].topic + '课程</div></div>';
			$(".t-con").eq(m + 1).prepend(Topic);
			searchTeacherS(data.data[m].id, 0, 4, m + 1, oooType);
			Topic = "";
		}
	},
	error: function () {
		console.log("出错了。。。");
	}
});

//			单击向前翻页
$(".after").click(function () {
	var courseTopicsIds = $(this).siblings("input").val();
	var index = $(".after").index($(this)) + 1;
	var page = Number($(this).parent().attr("data-page")) - 1;
	$(this).parent().attr("data-page",page);
	if (page < 0) { // 还原 page
		page = 0;
		$(this).parent().attr("data-page",page);
	}else if(page >= 0){
		searchTeacherS(courseTopicsIds, $(this).parent().attr("data-page"), 4, index, oooType);
	}
});
//      单击向后翻页
$(".next").click(function () {
	var courseTopicsIds = $(this).siblings("input").val();
	var page = Number($(this).parent().attr("data-page"));
	var index = $(".next").index($(this)) + 1;
	var totalPage = Number($(".t-tuijian:eq("+index+")>.t-list-t").attr("data-total")); //计算总页数
	if (page < totalPage) { // 当请求的页数大于总页数的时候 还原page
		page += 1;
		$(this).parent().attr("data-page",page);
		searchTeacherS(courseTopicsIds, $(this).parent().attr("data-page"), 4, index, oooType);
	}else if(page = totalPage){
		page = totalPage;
		$(this).parent().attr("data-page",page);
	}
});

// 封装函数 功能通过 课程ID查询 对应老师 页数:page 个数:size 对应索引值:num 查询城市：citys
function searchTeacherS(courseTopicsIds, page, size, num, oooType) {
	var str = "";
	$.ajax({
		type: "GET",
		url: "/api/view/guest/courses/findPageQuery",
		dataType: "json",
		data: {
			"t":new Date().getTime(),
			topicId: courseTopicsIds,
			page: page,
			size: size,
			mode: oooType,
			isFinsh: "1"
//			sort: '{"keys":"id","sortType":"desc"}'
		},
		success: function (data) {
			if(data.data){
				var searchCourse = data.data.rows;
				var ucanFileS = "";
				var total = Math.ceil(data.data.total / 4) - 1;
				for (var n = 0; n < searchCourse.length; n++) {
					if (searchCourse[n].mode == "ooo") { // 判断课程类型
						searchCourse[n].mode = "1对1";
					} else {
						searchCourse[n].mode = "直播";
					}
					if (!searchCourse[n].beginDate) { // 判断课程类型
						searchCourse[n].beginDate = "已结课";
					}
					if (!searchCourse[n].ucanFile) {
						ucanFileS = "../../img/default-course.png";
					}else{
						ucanFileS = searchCourse[n].ucanFile.newUrl;
					}
					str += '<div data-total="'+ total +'" class="t-list-t"><a href="../../course.html?courseId=' + searchCourse[n].id + '"><div class="c-list-img"><img src="' + ucanFileS + '" width="100%" alt=""><span class><i class="bg-cc'+ searchCourse[n].topic.id +'">'+searchCourse[n].topic.topic+'</i>'+searchCourse[n].beginDate+'</span></div></a><p class="fn-w6"><span class="cOoo fl bg-c3 c-o">'+searchCourse[n].mode+'</span>' + searchCourse[n].name + '</p><a href="../teacherHome/teacherHome.html?teacherId='+searchCourse[n].teacher.id+'"><p class="fn-s2 c-y">授课老师：'+searchCourse[n].teacher.name+'</p></a>';
					if (searchCourse[n].cost == 0) { //判断免费||价钱
						str += '<p class="fee fn-s1 c-y">免费</p></div>';
					}else{
						str += '<p class="free fn-s1 c-y">￥'+searchCourse[n].cost+'</p></div>';
					}
					if (n < 3) {
						for (var z = 0; z < 1; z++) { // 追加分割线
							str += '<span class="bor-das"></span>';
						}
					}
					ucanFileS = "";
					$(".t-tuijian").eq(num).html(str);
				}
				str = "";
			}
		},
		complete: function(){
			if(!$(".t-tuijian").eq(num).html()){
				resultStr = "<div class='result'><img src='../../img/result.png'></div>";
				$(".t-tuijian").eq(num).html(resultStr);
			}
		},
		error: function () {
			console.log("出错了。。。");
		}
	});
}

//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};