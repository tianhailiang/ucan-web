$(function() {
	//	$(".nav ul li").click(function(){
	//		window.location.hash=$(this).attr('id');
	//	});
	$('.nav').on("click", "li", function() {
		var _index = $(this).index();
		if(_index >= 0) {
			$(".nav li").removeClass("native");
			if(_index > 0) {
				$(".trangle").removeClass("trangle").addClass("trangle_active");
			}

			for(var i = 0; i <= _index; i++) {

				$(".nav li").eq(i).addClass("native");
			}
		}
		if(_index == 0) {
			$(".nav li:eq(1) span:eq(1)").attr("class", "trangle");
		}
		$(".content").addClass("disnone");
		$(".content").eq(_index).removeClass("disnone");
	});

	//	创建div
	function createDiv() {
		$(".content1").addClass("disnone");
		var email = $('[name="email"]').val();
		var s = email.split("@")[1];
		var ss = s.split(".")[0];
		if(ss == "qq") {
			var a = "https://mail.qq.com/";
		} else if(ss == "163") {
			var a = "http://mail.163.com/";
		}
		var $tr = $("<div class='content2'></div>");
		var str = "<div id='success'><img src='img/icon_email_success.png'/><span>验证邮件已发送</span></div>";
		str += '<p>验证邮件已发送至您的邮箱<span style="color:#477af1;">' + email + '</span>，点击邮件中的链接完成操作。</p>';
		str += '<p>验证邮件24小时内有效，请尽快验证！</p>';
		str += '<a href="' + a + '"><input type="button" class="input button in_email" value="立即进入邮箱" /></a>';
		str += '<a href="" class="reset">没收到邮件？重新发送</a>';
		$tr.html(str);
		$(".content").eq(0).append($tr);
	}

	//	$(".content").on("click","input.in_email",function(){
	//		
	//	})
	//	验证成功
	function Valid() {
		$(".content2_2").addClass("disnone");
		var $tr = $("<div class='content2_1'></div>");
		var str = "<label>新密码</label><input type='password' class='input psw pwd1' name='newpsw' autofocus/><span></span><br>";
		str += "<label>确认密码</label>	<input type='password' class='input psw pwd2' name='repsw'/><span></span>";
		str += "<input type='button' class='input button password' value='确定' />";
		$tr.html(str);
		$(".content").eq(1).append($tr);
	}

	$(".button_back").on("click", function() {
		$(".content").eq(1).removeClass("content2_1");
		$(".nav li").eq(0).click();
	});

	function remove() {
		$(".content2_1").remove();
	}

	//	设置成功
	function Success() {
		$(".content3_2").addClass("disnone");
		var $tr = $("<div class='content3_1'></div>");
		var str = "<p>密码修改成功，请返回首页重新登录。</p>";
		str += "<a href='../login/login.html'><input type='button' class='input button reset_success' value='确定' /></a>";
		$tr.html(str);
		$(".content").eq(2).append($tr);
	}

	/**
	 * 发送邮件
	 */
	function isEmailVaild() {
		if(isEmail($('[name="email"]').val())) {
			$(".content1 span").html("");
			return true;
		} else {
			$(".email").focus();
			$(".content1 span").html("邮箱地址不合法！");
			return false;
		}
	}

	//校验密码
	function isPasswd(str) {
		var reg = /^(\w){8,16}$/;
		if(!reg.exec(str)) return false
		return true
	}
	//	校验邮箱地址
	function isEmail(str) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return reg.test(str);
	}
	$(".send_email, a.reset").on("click", function() {
		var email = $('[name="email"]').val();
		if(email.length == 0) {
			$(".content1 span").html("请输入邮箱！");
		} else if(isEmailVaild()) {
			var t=new Date().getTime();
			$.ajax({
				type: "GET",
				url: "/api/view/guest/system/user/emailExist",
				async: true,
				dataType: 'json',
				data: {
					"t":t,
					"email": email
				},
				success: function(data) {
					var data = data.data;
					if(data == -1) {
						var t=new Date().getTime();
						$.ajax({
							type: "POST",
							url: "/api/view/guest/postEmail/add",
							async: true,
							dataType: 'json',
							data: {
								"t":t,
								"email": email,
								"type": "找回密码"
							},
							success: function(data) {
								var data = data.data;
								if(data == 1) {
									alert("邮件已发送到该邮箱！");
								} else {
									createDiv();
								}

							},
							error: function(err) {
								console.log(err);
							},
							complete: function() {

							}
						});
					} else {
						$(".content1 span").html("该邮箱尚未注册！");
					}
				},
				error: function(err) {

					console.log(err);
				},
				complete: function() {

				}
			});

		}

	});

	/**
	 * 验证随机码
	 */
	var h = window.location.href;
	var str = h.split("?")[1];
	console.log(h);
	if(str != null) {
		$(".nav li:eq(1)").click();
		var t=new Date().getTime();
		$.ajax({
			type: "GET",
			url: "/api/view/guest/postEmail/queryValid",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"randomCode": str
			},
			success: function(data) {
				var data = data.data;
				if(data == 0) {
					remove();
					Valid();
					$(".content2 .content2_1 .pwd1").blur(function() {
						if($('[name="newpsw"]').val().length == 0) {
							$(".content2 .content2_1 span:eq(0)").html("请输入新密码！");
						} else if($('[name="newpsw"]').val().length < 8 || $('[name="newpsw"]').val().length > 16) {
							$(".content2 .content2_1 span:eq(0)").html("支持8-16位密码！");
						} else if(isPasswd($('[name="newpsw"]').val())) {
							$(".content2 .content2_1 span:eq(0)").html("");
						} else {
							$(".content2 .content2_1 span:eq(0)").html("出现非法字符！");
						}

					});
					$(".content2 .content2_1 .pwd2").bind('input porpertychange', function() {
						if($('[name="repsw"]').val().length == 0) {
							$(".content2 .content2_1 span:eq(1)").html("请再次输入密码！");
						} else if($('[name="repsw"]').val().length >= $('[name="newpsw"]').val().length && $('[name="newpsw"]').val() != $('[name="repsw"]').val()) {

							$(".content2 .content2_1 span:eq(1)").html("两次密码不一致！");
						} else if($('[name="newpsw"]').val() == $('[name="repsw"]').val() || $('[name="repsw"]').val().length != 0) {
							$(".content2 .content2_1 span:eq(1)").html("");
						}
					});

				} else {

				}

			},
			error: function(err) {
				console.log(err);
			},
			complete: function() {

			}
		});

	}

	function isSuccess() {
		$(".nav li:eq(2)").click();
		Success();
	}
	var email = $('[name="email"]').val();
	/**
	 * 更改密码
	 */
	$(".content2").on("click", " input.password", function() {
		var pwd = $('[name="newpsw"]').val();
		var repwd = $('[name="repsw"]').val();
		if(pwd.length == 0) {
//			alert("请输入新密码！");
		} else if(pwd != repwd) {
//			alert("两次密码输入不一致！");
		} else if(isPasswd(pwd)) {
			var t=new Date().getTime();
			$.ajax({
				type: "POST",
				url: "/api/view/guest/postEmail/updatePwd",
				async: true,
				dataType: 'json',
				data: {
					"t":t,
					"randomCode": str,
					"password": pwd
				},
				success: function(data) {
					isSuccess();
				},
				error: function(err) {

					console.log(err);
				},
				complete: function() {

				}
			});
		} 

	});

});