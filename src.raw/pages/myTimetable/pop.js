$(function() {
	if(sessionStorage.obj) {
		UserStr = sessionStorage.obj;
		obj = JSON.parse(UserStr);
		var userToken = obj.user.userToken;
	}
	var about=courseAbout_alert;
	var startDate = beginTime;
	var endDate = endTime
	var courseY = beginTime.substr(0,10);
	var startH = beginTime.substr(11,2);
	var startM = beginTime.substr(14,2);

		layui.use(["form", "upload", "layer"], function() {

			var form = layui.form();
			var upload = layui.upload();
			var layer = layui.layer;

			//初始化
			function init() {

				//初始化下拉科目
				iframeSubject($(".sc-subject select"));

				//添加一节课程
				$(".sc-addone").on("click", addDone);
				//提交修改课程
				$("li").on("click",".uploadSave",function(){
					var c_costId = costId;
					var c_name = $(".courseName_alert").val();
					var c_topicId = $("#courseOption_alert select option:selected").attr("data-id");
					var c_picFileId = $("#fileList img").attr("picFileId");
					var c_mode = $("#classType_alert select option:selected").val();
					var c_maxStudentCount = $(".personNum_alert").val();
					
					if(c_mode=="ooo"){
						if(parseInt($(".personNum_alert").val())!=1){
							alert("一对一课程最大人数不得大于1人!!!")
							c_maxStudentCount = $(".personNum_alert").val("1");
						}
					}else{
						if(parseInt($(".personNum_alert").val())<1){
							alert("请填写正确人数!!!")
							c_maxStudentCount = $(".personNum_alert").val("1");
							return false;
						}
						if(parseInt($(".personNum_alert").val())>200){
							alert("最大人数不得超过200人!!!")
							c_maxStudentCount = $(".personNum_alert").val("200");
							return false;
						}
					}
					var c_startDate = startDate;
					var c_endDate = endDate;
					var c_about = about;
					//console.log(c_picFileId);
					subcourse(c_costId,c_name,c_picFileId,c_topicId,c_mode,c_maxStudentCount,c_startDate,c_endDate,c_about)
				})

			};

			//添加一节课程
			function addDone() {
				_layer();
			};
			//修改课程
			function subcourse(c_costId,c_name,c_picFileId,c_topicId,c_mode,c_maxStudentCount,c_startDate,c_endDate,c_about){
				$.ajax({
					type:"post",
					url:"/api/view/user/courses/updateCourses",
					async:true,
					dataType: "json",
					data:{
						"t":new Date().getTime(),
						"token":userToken,
						"costId":c_costId,
						"name":c_name,
						"picFileId":c_picFileId,
						"topicId":c_topicId,
						"mode":c_mode,
						"maxStudentCount":c_maxStudentCount,
						"startDate":c_startDate,
						"endDate":c_endDate,
						"about":c_about,
					},
					success:function(data){
						notlogin(data);
						if(data.code==0){
							alert(data.message);
							history.go(0);
						}
					}
				});
			}
			//计算每节课的结束时间
			function chgtoend(hour, min, durring) {
				var obj = {};
				obj.durring = durring;
				var numMin = parseInt(min); //将输入的分钟化为数字
				var numHour=parseInt(hour);//将输入的小时化为数字
				var strHour = fillPre2(hour); //将小时化为字符串
				min=fillPre2(min);//将输入的分钟化为字符串
				durring = parseInt(durring); //将输入的时长化为数字
				obj.stime = strHour + ":" + min;
				hour=numHour*60+numMin+durring;//结束时间转换成分钟
				numHour=Math.floor(hour/60);
				numMin=hour-numHour*60;
				if(numHour>=24){
					numHour=numHour%24;
				}
				obj.etime = fillPre2(numHour) + ":" + fillPre2(numMin);
				return obj;
			}
			function fillPre2(num){
				var str = "00" + num;
				str = str.slice(str.length - 2);
				return str;
			}
			//创建弹窗 
			function _layer(){
				
				layer.open({

					type: 1,
					title: "<div class='sc-title1'>编辑课节</div>",
					btnAlign:"c",
					closeBtn:1,
					btn:['取消', '确定'],
					btn2:function(index, layero){
						startDate = $("#startday-one").val()+" "+$(".beginTime_select option:selected").eq(0).val()+":"+$(".beginTime_select option:selected").eq(1).val()+":00";
						endDate =$("#startday-one").val()+" "+ chgtoend($(".beginTime_select option:selected").eq(0).val(),$(".beginTime_select option:selected").eq(1).val(),$(".beginTime_select option:selected").eq(2).val()).etime+":00";
						about =$(".one-text textarea").val();
					},
					area: ['850px', '400px'],
					fixed: false, //不固定
					maxmin: true,
					content: '<div></div>',
					success: function(layero, index) {
						var content = layero.find(".layui-layer-content");
						
						content.load("editSection.html", function() {
							$("#startday-one").val(courseY);
							$(".beginTime_select").eq(0).val(startH);
							$(".beginTime_select").eq(1).val(startM);
							$(".one-text textarea").text(courseAbout_alert);
							//日期插件
							layui.use('laydate', function() {
								var laydate = layui.laydate;
								$(".sc-date").on("click", "#startday-one", function() {
									var one = {
										min: laydate.now(),
										max: '2099-06-16 23:59:59',
										istoday: false
									};
									one.elem = this;
									laydate(one);
								});
							});
						})
					}
				})

			}

			//初始化加载下拉科目
			function iframeSubject(doc) {

				$.ajax({
					type: "GET",
					url: "/api/view/guest/courses/courseTopics",
					dataType: "json",
					success: function(data) {
						data = data.data;
						var html = "";
						for(var i = 0; i < data.length; i++) {
							if(courseOption_alert_id==data[i].id){
								html += '<option selected data-id=' + data[i].id + '>' + data[i].topic + '</option>';
								continue;
							}
							html += '<option data-id=' + data[i].id + '>' + data[i].topic + '</option>';
						};
						doc.append(html);
						//更新渲染下拉科目
						form.render();
					},
					error: function(e) {
						console.log(e.message);
					}
				});

			};
			//			上传图片
			// layui.upload({
			// 	url: '/api/view/user/ucanfile/upload?token=' + userToken,
			// 	ext: 'jpg|png|gif' //那么，就只会支持这三种格式的上传。注意是用|分割。
			// 		,
			// 	success: function(res, input) {
			// 		if(res.code==0){
			// 			var data = res.data;
			// 			var picFileId = data.id;
			// 			var srcImg = data.newUrl
			// 			$("#fileList img").attr("src",srcImg);
			// 			$("#fileList img").attr("picFileId",picFileId);
			// 		}
			// 	}
			// });
			//初始化执行
			init();

		})

})

//上传图片
jQuery(function() {
	var $ = jQuery,
	$list = $('#fileList'),
		// 优化retina, 在retina下这个值是2
		//    ratio = window.devicePixelRatio || 1,

		// 缩略图大小
		thumbnailWidth = 294,
		thumbnailHeight = 150,

		// Web Uploader实例
		uploader;
	// 初始化Web Uploader
	uploader = WebUploader.create({

		// 自动上传。
		auto: true,

		// swf文件路径
		swf: 'Uploader.swf',

		// 文件接收服务端。
		server: '/api/view/user/ucanfile/upload?token=' + token,

		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#upload',

		// 只允许选择文件，可选。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
		}
	});

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		$(".subcourse").removeClass("uploadSave");
		var $li = $(
			'<div id="' + file.id + '" class="file-item thumbnail">' +
			'<img>' +
			'</div>'
			),
		$img = $li.find('img');

		$list.html($li);

		// 创建缩略图
		uploader.makeThumb(file, function(error, src) {
			if(error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}

			$img.attr('src', src);
		}, thumbnailWidth, thumbnailHeight);
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage) {
		var $li = $('#' + file.id),
		$percent = $li.find('.progress span');

		// 避免重复创建
		if(!$percent.length) {
			$percent = $('<p class="progress"><span></span></p>')
			.appendTo($li)
			.find('span');
		}

		$percent.css('width', percentage * 100 + '%');
	});

	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on('uploadSuccess', function(file, data) {
		$('#' + file.id).addClass('upload-state-done');
		picId = data.data.id;
		picUrl = data.data.newUrl;
		$(".subcourse").addClass("uploadSave");
		//		alert(data.message);
		//		
		//		
		//		
		//		
		//		
		
		$("#fileList img").attr("src",picUrl);
		$("#fileList img").attr("picFileId",picId);
	});

	// 文件上传失败，现实上传出错。
	uploader.on('uploadError', function(file) {
		//var $li = $('#' + file.id),
		//    $error = $li.find('div.error');
		//
		//// 避免重复创建
		//if (!$error.length) {
		//    $error = $('<div class="error"></div>').appendTo($li);
		//}
		//
		//$error.text('上传失败');
		alert("上传失败");
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on('uploadComplete', function(file) {
		$('#' + file.id).find('.progress').remove();
	});
	//-------------------------------------
});