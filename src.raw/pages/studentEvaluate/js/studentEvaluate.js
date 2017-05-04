//	获取学生ID
var studentId = userStr.user.id;
//	*****************  分页获取学生评价
var str = "";
var size = 4;	
var page = 0;
var totlePage = '';
var ucanFile = "";

function paging(page) {
	var t=new Date().getTime();
	$.ajax({
		type: "get",
		url: "/api/view/user/students/evaluations/query?token=" + token,
		dataType: "json",
		async: false,
		data: {
			"t":t,
			studentId: studentId,
			size: size,
			page: page
		},
		success: function(data) {
			notlogin(data);
			if(data.code==6012){return false;}
			for (var i in data.data.rows) {
				if (data.data.rows[i].teacher.ucanFile) {
					ucanFile = data.data.rows[i].teacher.ucanFile.newUrl;
				}else{
					ucanFile = "../../img/teacher-header.png";
				}
				str += '<div class="s-comment oh"><div class="comment-l fn-s0 fn-c0 fl"><img src="' + ucanFile + '" width="100%" height="150px" alt=""><p>' + data.data.rows[i].teacher.name + '</p></div><div class="comment-r fl"><div class="flower">'
				//				评分图片显示
				for (var j = 0; j < data.data.rows[i].evaluationFraction; j++) {
					str += ' <img src="../../img/flower.png" alt="">'
				}
				for (var m = 0; m < 5 - data.data.rows[i].evaluationFraction; m++) {
					str += ' <img src="../../img/flower-g.png" alt="">'
				}
				str += '</div><p>' + data.data.rows[i].evaluation + '</p><p><span class="c-y">' + data.data.rows[i].updatedAt + '</span>&nbsp;&nbsp;&nbsp;<span class="c-y">' + data.data.rows[i].courses.name + '</span></p></div></div>';
			}
			$(".ss-comment").html(str);

			totlePage = Math.ceil(data.data.total / size);
			if (totlePage == 0) {
				totlePage = 1;
			}
			str = "";
		},
		error: function() {
			console.log("出错了");
		}
	});
}

$(function(){
	paging();
	laypage({
		cont: $('#page3'), //容器。值支持id名、原生dom对象，jquery对象,
		pages: totlePage, //总页数
		skip: true, //是否开启跳页
		skin: '#6a3906',
		groups: 3, //连续显示分页数
		jump: function(obj, first) {
			if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
				paging((obj.curr) - 1);
			}
		}
	});
	var commentHtml = $(".ss-comment").html();
	//	*****************  分页
	if(!commentHtml){
		var imgStr = "<img src='../../img/result.png'>"
		$(".ss-comment").css({
			textAlign: "center"
		});
		$(".ss-comment").html(imgStr);
	}
})