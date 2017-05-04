var Topic = "";
var page = 0;
var tStr = "";
var citys = getQueryString("city");
var cityArr = [];
var resultStr = "";

//设置默认城市
if(!citys){
	citys = "北京";
}
$(".t-city-b>span").html(citys);

//		显示切换城市列表
$(".switch-city").click(function () {
	var cityStr = "";
	$(".triangle-border-up").slideToggle();
	$(".t-city").slideToggle();
	//城市级联
	var t=new Date().getTime();
	$.ajax({
		type: "GET",
		url: "/api/view/guest/schools/provinceandcity?t="+t,
		dataType: "json",
		success: function (data) {
			for(var i = 0; i < data.data.length; i++){
				cityStr += '<div class="t-save fn-s3">'+data.data[i].province+'</div><div class="c-city">';
				for(var j = 0; j < data.data[i].city.length; j++){
					cityStr += '<a href="../teacherList/teacherList.html?city='+data.data[i].city[j]+'">'+data.data[i].city[j]+'</a>';
					cityArr.push(data.data[i].city[j]);
				}
				cityStr += '</div>';
			}
			$(".t-city-l").html(cityStr);
		}
	});
	return false;
});

//模糊查询城市
$(document).ready(function(){
	$('.search-city').autocomplete({
		hints: cityArr,
		width: 300,
		height: 30,
		showButton: false,
		onSubmit: function(text){
			$('#message').html('Selected: <b>' + text + '</b>');			
		}
	});
});
 
// 进入界面显示前四个 追加到特别推荐
searchTeacherS("", page, 4, 0,citys);

// 进入界面获取课程名称 查询对应课程的老师
$.ajax({
	type: "get",
	url: "/api/view/guest/courses/courseTopics?t="+new Date().getTime(),
	dataType: "json",
	success: function (data) {
		for (var m = 0; m < data.data.length; m++) {
			Topic += '<div class="na-bt" data-page="0"><input type="hidden" value="' + data.data[m].id + '"><a href="javascript:;" class="after"> </a><a href="javascript:;" class="next"> </a></div><div class="color-title fn-s1 bor-d c-y"><div class="colored bor-1' + m + '">' + data.data[m].topic + '名师</div></div>';
			$(".t-con").eq(m + 1).prepend(Topic);
			searchTeacherS(data.data[m].id, 0, 4, m + 1,citys);
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
		searchTeacherS(courseTopicsIds, $(this).parent().attr("data-page"), 4, index, citys);
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
		searchTeacherS(courseTopicsIds, $(this).parent().attr("data-page"), 4, index, citys);
	}else if(page = totalPage){
		page = totalPage;
		$(this).parent().attr("data-page",page);
	}
});

// 封装函数 功能通过 课程ID查询 对应老师 页数:page 个数:size 对应索引值:num 查询城市：citys
function searchTeacherS(courseTopicsIds, page, size, num,citys) {
	var str = "";
	$.ajax({
		type: "GET",
		url: "/api/view/guest/teachers/searchTeacher",
		dataType: "json",
		data: {
			"t":new Date().getTime(),
			topicId: courseTopicsIds,
			page: page,
			size: size,
			city: citys
		},
		success: function (data) {
			if(data.data){
				var searchTeacher = data.data.rows;
				var colorS = "";
				var total = Math.ceil(data.data.total / 4) - 1;
				for (var i = 0; i < searchTeacher.length; i++) {
					if (!searchTeacher[i].ucanFile) {
						searchTeacher[i].ucanFile = "../../img/teacher-header.png";
					}else{
						searchTeacher[i].ucanFile = searchTeacher[i].ucanFile.newUrl;
					}
					if(!searchTeacher[i].about){
						searchTeacher[i].about = "暂无简介";
					}
					if(courseTopicsIds){
						colorS = courseTopicsIds - 1;
					}else{
						colorS = i;
					}
					str += '<div data-total="'+ total +'" class="t-list-t"><a href="../teacherHome/teacherHome.html?teacherId=' + searchTeacher[i].id + '"><img src="' + searchTeacher[i].ucanFile + '" width="100%" alt=""><p class="fn-c0 fn-w6">' + searchTeacher[i].name + '<span class="bg-cc'+ colorS +'">'+ searchTeacher[i].topic.topic +'</span></p><p class="c-y tc-about">'+searchTeacher[i].about+'</p></a></div>';
					if (i < 3) {
						for (var c = 0; c < 1; c++) { // 追加分割线
							str += '<span class="bor-das"></span>';
						}
					}
					colorS = "";
				}
				$(".t-tuijian").eq(num).html(str);
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