$(function () {
	var b = new Base64();
	//	$("#login").on("click", "span", function () {
	//		var _index = $(this).index();
	//		$(this).attr("class", "active").siblings("span").attr("class", "noactive");
	//		$("#login div").eq(_index).removeClass('disnone').siblings('div').addClass('disnone');
	//	});
	if($.cookie("time") == "true") {
		$("#auto_login").attr("checked", true);
		$('[name="uname"]').val($.cookie("VY_T"));				
		$("[name='upwd']").val(b.decode($.cookie("KU_FT").slice(9,3+$.cookie("L_EL"))).slice(0,$.cookie("L_EL")));
	}
	//	$('[name="uname"]').val(localStorage.getItem("username"));
	//	$("[name='upwd']").val(localStorage.getItem("userpwd"));
	$("#safe_login").on("click", function() {
		window.location.href = "../register/register.html";
	});

	$(".pwd").blur(function(){
		if($("[name='upwd']").val().length == 0){
			$("#user_login_content span:eq(1)").html("密码不能为空！");
		}else{
			$("#user_login_content span:eq(1)").html("");
		}
	})
	$(".emailValid").blur(function () {
		if($('[name="uname"]').val().length == 0){
			$("#user_login_content span:eq(0)").html("用户名不能为空！");
		}else{
			$("#user_login_content span:eq(0)").html("");
			isEmailVaild()
		}

	});

//	生成随机码
function code(value){
	var s=["A","B","C","D","@","^","*","&","%","!","$","/","K","F","G","F","E","I","J","L","M","N","O","P",
	"Q","R","S","T","U","V","W","X","Y","Z","%","?"];
	var code="";
	for(var i=0;i<20;i++){
		code +=s[Math.ceil(Math.random()*35)];
	}
	var random=code.slice(0,9)+b.encode(value)+code.slice(10,19);
	return random;
}


//记住用户名和密码
	function Save() {
		if($("#auto_login").attr("checked")) {
			var username = $('[name="uname"]').val();
			var userpwd = $("[name='upwd']").val();
			$.cookie("time", "true", { expires: 7 }); 
			$.cookie("VY_T", username, { expires: 7 });
			$.cookie("KU_FT", code(userpwd), { expires: 7 });
			$.cookie("L_EL", userpwd.length, { expires: 7 });
		} else {
			$.cookie("time", "false", { expire: -1 });
			$.cookie("VY_T", "", { expires: -1 });
			$.cookie("KU_FT", "", { expires: -1 });
			$.cookie("L_EL", "", { expires: 7 });
		}
	};

	function isEmailVaild() {
		if(isEmail($('[name="uname"]').val())) {
			//					$(".emailValid").removeClass("tip");
			$("#user_login_content span:eq(0)").html("");
		} else {

			$(".emailValid").focus();
			//					$(".emailValid").addClass("tip");
//			alert("邮箱地址不合法！");
			$("#user_login_content span:eq(0)").html("邮箱地址不合法！");
			//					$(".emailValid").addClass("tip");
			return false;
		}
	}

	function isEmail(str) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return reg.test(str);
	}

	$("#login_button").on("click", function () {
		console.log(1000)
		var username = $('[name="uname"]').val();
		var userpwd = $("[name='upwd']").val();
		
		if(username.length == 0) {
			$("#user_login_content span:eq(0)").html("用户名不能为空！");
		} else if (userpwd.length == 0) {
			$("#user_login_content span:eq(1)").html("密码不能为空！");
		} else {

			$("#user_login_content span:eq(1)").html("");
			var t=new Date().getTime();
			$.ajax({
				type: "POST",
				//http://192.168.2.185/
				url: "/api/login",
				async: true,
				dataType: 'json',
				data: {
					"t":t,
					"username": username,
					"password": userpwd
				},
				success: function (data) {
					console.log(data)
					var obj = data.data;
					var UserStr = JSON.stringify(obj);
					if(data.code == 3001) {
						$("#user_login_content span:eq(0)").html("用户名错误！");
					} else if(data.code == 6011){
						$("#user_login_content span:eq(1)").html("密码错误！");
						
					} else if(data.code == 4003){	
						alert(data.message);
						return false;
					} else if(data.code == 0){
//					设置sessionStorage
                        console.log(UserStr)
						sessionStorage.obj = UserStr;
						Save();
						window.location.href = "../../index.html";
					}
				},
				error: function (err) {
					console.log(err);
				},
				complete: function () {

				}
			});
		}
	})
	
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
