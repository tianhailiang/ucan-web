$(function() {

	var h = window.location.href;
	var str = h.split("?")[1];
	

	if(str != null ) {
		var t=new Date().getTime();
		$.ajax({
			type: "GET",
			url: "/api/view/guest/postEmail/queryValidAndRegister",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"randomCode": str
			},
			success: function(data) {
				var data = data.data;
				if(data == 0) {
					$("#tip").html("注册成功！页面将在3秒后跳转！");
					setTimeout("location.href='../login/login.html'",3000);
				} else {
					// changeURL();
					alert("链接已失效！请重新注册！");
					return false;
				}

			},
			error: function(err) {
				console.log(err);
			},
			complete: function() {

			}
		});

	}
	// 改变url地址
	// function changeURL(){
 //        var url = window.location.href.split("?")[0];
 //        window.history.pushState({},0,url);      
 //    }

	if($("#accept").attr("checked")) {
		$("#register_button").attr("disabled", false);
	} else {
		$("#register_button").attr("disabled", true);
	}

	$(".pwd").blur(function() {
		if($("[name='pswd']").val().length == 0) {
			$("#register span:eq(1)").html("密码不能为空！");
		} else if($("[name='pswd']").val().length < 8 || $("[name='pswd']").val().length > 16) {
			$("#register span:eq(1)").html("仅支持8-16位密码！");
		} else if(isPasswd($("[name='pswd']").val())) {
			$("#register span:eq(1)").html("");
		} else {
			$("#register span:eq(1)").html("密码出现非法字符！");
		}
	});

	$(".rpwd").bind('input porpertychange', function() {
		if($("[name='rpswd']").val().length == 0) {
			$("#register span:eq(2)").html("请再次输入密码！");
		} else if($("[name='rpswd']").val().length >= $("[name='pswd']").val().length && $("[name='pswd']").val() != $("[name='rpswd']").val()) {

			$("#register span:eq(2)").html("两次密码不一致！");
		} else if($("[name='pswd']").val() == $("[name='rpswd']").val() || $("[name='rpswd']").val().length != 0) {
			$("#register span:eq(2)").html("");
		}
	});

	function isEmailVaild() {
		if(isEmail($('[name="email"]').val())) {
			$("#register span:eq(0)").html("");
			return true;
		} else {

			$(".emailValid").focus();
			//			alert("邮箱地址不合法！");
			$("#register span:eq(0)").html("邮箱地址不合法！");
			return false;
		}
	}

	//校验密码
	function isPasswd(str) {
		var reg = /^(\w){8,16}$/;
		if(!reg.exec(str)) return false
		return true
	}

	//校验邮箱地址
	function isEmail(str) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return reg.test(str);
	}

	$(".emailValid").blur(function() {
		if($('[name="email"]').val().length == 0) {
			$("#register span:eq(0)").html("用户名不能为空！");
		} else {
			if(isEmailVaild()) {
				usernameVerification()
			}

		}

	});

	function usernameVerification() {
		var username = $('[name="email"]').val();
		var userpwd = $("[name='pswd']").val();
		var reuserped = $("[name='rpswd']").val();
		var t=new Date().getTime();
		$.ajax({
			type: "GET",
			url: "/api/view/guest/system/user/emailExist",
			async: true,
			dataType: 'json',
			data: {
				"t":t,
				"email": username
			},
			success: function(data) {
				if(data.code == 1500) {
					$("#register span:eq(0)").html("邮箱验证失败！");
					//					alert("验证失败！");
				} else {
					$("#register span:eq(0)").html("");
					var data = data.data;

					if(data == -1) {
						$("#register_button").attr("disabled", true);
						$("#register_button").attr("value", "无法重复注册");
						//						alert("该邮箱已被注册！");
						$("#register span:eq(0)").html("该邮箱已被注册！");
						return false;

					} else {
						$("#register_button").attr("disabled", false);
						$("#register_button").attr("value", "马上注册");
						$("#register span:eq(0)").html("");
					}
				}

			},
			error: function(err) {

				console.log(err);
			},
			complete: function() {

			}
		});
	}
	$("#register_button").on("click", function() {
		if($("#accept").attr("checked") != "checked") {
			//		$("#register_button").on("click", function() {
			$("#accept").focus();
		} else {
			var username = $('[name="email"]').val();
			var userpwd = $("[name='pswd']").val();
			var reuserped = $("[name='rpswd']").val();
			if(username.length == 0) {
				$("#register span:eq(0)").html("请输入用户名！");
			} else if(userpwd.length == 0) {
				$("#register span:eq(1)").html("密码不能为空！");
			} else if(reuserped != userpwd) {
				$("#register span:eq(2)").html("两次密码不一致！");
			} else if(isEmail(username)) {
				if(isPasswd(userpwd)) {
					var t=new Date().getTime();
					$.ajax({
						type: "POST",
						url: "/api/view/guest/postEmail/addRegister",
						async: true,
						dataType: 'json',
						data: {
							"t":t,
							"email": username,
							"password": userpwd,
							"type": "用户注册"
						},
						success: function(data) {
							alert(data.message);

						},
						error: function(err) {
							console.log(err);
						},
						complete: function() {

						}
						//				});
					});

				}
			}

		}
	});
	//	搜索类型 判断 跳转搜索结果
	var searchType = "";
	var optionValue = 0;
	$(".search>select").change(function () {
		optionValue = $(this).val();
	});
	$(".search>a").click(function () {
		var value = "../search/search.html?searchType=" + optionValue + "&value=";
		value += $(".search>input").val();
		window.open(value, "_self");
	});

});