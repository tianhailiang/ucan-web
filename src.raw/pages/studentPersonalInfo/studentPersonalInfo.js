/**
 * Created by lianyahua on 2017/3/22.
 */
if(!sessionStorage.obj){
    alert("您的登录信息已失效，请重新登陆");
    location.href="../login/login.html";
}
var userId,flag,check;
var groups = userStr.user.groups;
var obj={};
$(function () {
    if(groups=="teacher"){
        alert("您的权限不够，请更换账号后重试");
        location.href="../../index.html";
        return false;
    }
    var t=new Date().getTime();
    $.ajax({
        type: "GET",
        url: "/api/view/user/system/user/info?token="+token+"&t="+t,
        success: function (data) {
            notlogin(data);
            if(data.code==0) {
                var myData = data.data;
                var src = myData.ucanFile;
                if (!src) {
                    src = "../../img/body-header.png";
                } else {
                    src = src.newUrl;
                }
                userId = myData.id;
                flag = myData.regFlagStr;
                check = myData.emailChecked;
                if (myData.dateBirth) {
                    myData.dateBirth = myData.dateBirth.slice(0, myData.dateBirth.indexOf(" "));
                } else {
                    myData.dateBirth = "";
                }
                var html = "<li><span>姓名:</span><span>" + myData.name + "</span></li>\
                        <li><span>昵称:</span><span>" + myData.nickName + "</span></li>\
                        <li><span>我的身份:</span><span>" + myData.identify + "</span></li>\
                        <li><span>毕业院校:</span><span>" + myData.graduateInstitutions + "</span></li>\
                        <li><span>一句话介绍自己:</span><span>" + myData.about + "</span></li>\
                        <li><span>出生日期:</span><span>" + myData.dateBirth + "</span></li>\
                        <li><span>学历:</span><span>" + myData.education + "</span></li>\
                        <li><span>邮箱:</span><span>" + myData.email + "</span></li>";

                $("ul.info-key li.my_content").before(html);//在被选元素之前插入内容
                $("#fileList img").attr("src", src);
            }
        },
        error: function (err) {
            console.log(err.message);
        }
    })
});

// $(".valicode").siblings("button").on("click",function(){
//     box=$(".mailbox").val().trim();
//     if(!box){
//         $(".ee").html("请输入邮箱");
//         $(".ee").css({"display":"inline"});
//         return false;
//     }else{
//          $(".ee").css({"display":"none"});
//         var reg=/^([a-zA-Z0-9_\.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
//         if(box.search(reg)==-1){
//            $(".ee").html("邮箱格式错误");
//             $(".ee").css({"display":"inline"});
//             //alert("邮箱格式不正确，请重新输入");
//             return false;
//         }
//     }
//     var t=new Date().getTime();
//     $.ajax({
//         type:"POST",
//         data: {
//             "t":t,
//             token:token,
//             email:box
//         },
//         url:"/api/view/user/postEmail/sendCheckedEmail",
//         success:function(data){
//             notlogin(data);
//             if(data.code==6012){return false;}
//             if(data.code==0){
//                 alert("验证码发送成功");
//             }
//         },
//         error:function(err){
//             alert("邮件发送失败，请稍后再试");
//         }
//     })
// })
// $(".canbox-3 .bg-c1").on("click",function(){
//     var vcode=$(".valicode").val().trim();
//     if(!vcode){
//         alert("请输入验证码");
//         return false;
//     }else{
//         var t=new Date().getTime();
//         $.ajax({
//             type:"POST",
//             url:"/api/view/user/postEmail/checkedEmail",
//             data:{
//                 "t":t,
//                 email:box,
//                 randomCode:vcode,
//                 token:token
//             },
//             success:function(data){
//                 notlogin(data);
//                 if(data.code==6012){return false;}
//                 if(data.code==0){
//                     alert("修改成功");
//                     $(".canbox").slideUp();
//                     $(".setting-value b").html(box);
//                     $(".emailchg").css({"display":"none"}).next("span").css({"display":"none"});
//                 }
//             }
//         })
//     }
// })
var picId=null,picUrl=null;
$(".sc-top").on("click", "a", function () {
    $(".info-key").css({"display": "none"});
    $("#upload").css({"display":"block"});
    $(".sc-top h2").html('编辑个人资料');

    // if(check=="N"&& (flag & 1) != 0){
    //     $(".emailchg").css({"display":"inline"}).next("span").css({"display":"inline"});
    // }else{
    //     $(".emailchg").css({"display":"none"}).next("span").css({"display":"none"});
    // }
    var name = $("ul.info-key li:eq(0) span:eq(1)").html();
    $(".setting-value input[name=name]").attr("value", name);
    name = $("ul.info-key li:eq(1) span:eq(1)").html();
    $(".setting-value input[name=nickName]").attr("value", name);
    name = $("ul.info-key li:eq(2) span:eq(1)").html();
    name == "学生" ? (name = 0) : (name = 1);
    $(".setting-value .identify>div:eq(" + name + ") i").attr("class", "choosed");
    name = $("ul.info-key li:eq(3) span:eq(1)").html();
    $(".setting-value input[name=graduateFrom]").attr("value", name);
    name = $("ul.info-key li:eq(4) span:eq(1)").html();
    $(".setting-value input[name=signature]").attr("value", name);
    name = $("ul.info-key li:eq(5) span:eq(1)").html();
    $(".setting-value input[name=birthDay]").attr("value", name);
    name = $("ul.info-key li:eq(6) span:eq(1)").html();
    $(".setting-value select[name=education]").attr("value", name);
    name=$("ul.info-key li:eq(7) span:eq(1)").html();
    $(".setting-value b").html(name);
    $(".setting-value").css({"display": "block"});
})
$(".canbox").on("click",".c-off",function () {
    $(".canbox").slideUp();
    $("body").css({"overflow":"scroll"});
});
$(".canbox").on("click",".c-form .bg-c4",function(){
    $(".canbox").slideUp();
    $("body").css({"overflow":"scroll"});
});

// $(".setting-value").on("click",".emailchg",function(){
//     $(".canbox-3").slideDown();
// })
jQuery(function () {
    var $ = jQuery,
        $list = $('#fileList'),
    // 优化retina, 在retina下这个值是2
    //    ratio = window.devicePixelRatio || 1,

    // 缩略图大小
        thumbnailWidth = 200,
        thumbnailHeight = 200,

    // Web Uploader实例
        uploader;
    // 初始化Web Uploader
    uploader = WebUploader.create({

        // 自动上传。
        auto: true,

        // swf文件路径
        swf: 'Uploader.swf',

        // 文件接收服务端。
        server: '/api/view/user/ucanfile/upload?token='+token,

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
    uploader.on('fileQueued', function (file) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '</div>'
            ),
            $img = $li.find('img');

        $list.html($li);

        // 创建缩略图
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo($li)
                .find('span');
        }

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file,data) {
        $('#' + file.id).addClass('upload-state-done');
        picId=data.data.id;
        picUrl=data.data.newUrl;
        // alert(data.message);
    });
    // 文件上传失败，现实上传出错。
    uploader.on('uploadError', function (file) {
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
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').remove();
    });
    //-------------------------------------
});

$(".setting-value").on("click","button.save",function(){
    var obj={};
    var val=$(".setting-value li input[name=name]").val().trim();
    obj.name=val;
    val=$(".setting-value li input[name=nickName]").val().trim();
    obj.nickName=val;
    val=$(".setting-value li input[name=graduateFrom]").val().trim();
    obj.graduateInstitutions=val;
    val=$(".setting-value li input[name=signature]").val().trim();
    obj.about=val;
    val=$(".setting-value li input[name=birthDay]").val().trim();
    obj.dateBirth=val;
    val=$(".setting-value li select[name=education]").val();
    obj.education=val;
    obj.id=userId;
    obj.photoFileId=picId;
    var t=new Date().getTime();
    $.ajax({
        type:"POST",
        url:"/api/view/user/system/user/update?token="+token+"&t="+t,
        data:obj,
        success:function(data){
            notlogin(data);
            if(data.code==0){
                userStr.user.name=obj.name;
                userStr.user.photoUrl=picUrl||userStr.user.photoUrl;
                sessionStorage.obj =JSON.stringify(userStr);
                var text="保存成功";
                $(".canbox-2 .sc-date").html(text);
                $(".canbox-2 .c-form a").attr("class","ok");
                $(".canbox-2").slideDown();
            }
        },
        error:function(err){
            alert("保存失败，请稍后重试");
        }
    })
});

$(".info-key li input[name=pwdold]").on("change",function(){
    if(!$(this).val().trim()){
        $(".info-key li input[name=pwdnew]").attr("readonly",true);
        $(".info-key li input[name=pwdcfm]").attr("readonly",true);
    }else{
        $(".info-key li input[name=pwdnew]").attr("readonly",false);
        $(".info-key li input[name=pwdcfm]").attr("readonly",false);
    }
});
function mypwd(){
    $(".my_school").css('display','block');
    $(".my_btn").css('display','block');
}
$(".info-key .save").on("click",function(){
    var val=$(".info-key li input[name=pwdold]").val().trim();
    if(val){
        var newpwd1=$(".info-key li input[name=pwdnew]").val().trim();
        var newpwd2=$(".info-key li input[name=pwdcfm]").val().trim();
        if(newpwd1.length==0){
            $(".info-key li input[name=pwdnew]").siblings(".red").html("请输入新密码");
            //alert("请输入新密码");
            return false;
        }else if(newpwd1.length<8||newpwd1.length>16){
            $(".info-key li input[name=pwdnew]").siblings(".red").html("密码的长度为8至16位");
            //alert("密码的长度为8至16位");
            return false;
        }else if(!isPasswd(newpwd1)){
            $(".info-key li input[name=pwdnew]").siblings(".red").html("密码由字母、数字、下划线组成");
            return false;
        }else if(newpwd2!==newpwd1){
            $(".info-key li input[name=pwdnew]").siblings(".red").html("");
            $(".info-key li input[name=pwdcfm]").siblings(".red").html("两次密码输入不一致，请再次输入");
            //alert("两次密码输入不一致，请再次输入");
            return false;
        }else{
            var t=new Date().getTime();
            $.ajax({
                type:"POST",
                url:"/api/view/user/system/user/updatePassword",
                data:{
                    "t":t,
                    token:token,
                    oldPassword:val,
                    newPassword:newpwd1
                },
                success:function(data){
                    notlogin(data);
                    if (data.code == 0) {
                        var t = new Date().getTime();
                        var text="保存成功,请重新登录";
                        $(".canbox-2 .sc-date").html(text);
                        $(".canbox-2 .c-form a").attr("class","bg-c1");
                        $(".canbox-2").slideDown();
                    }
                },
                error: function (err) {
                    alert("保存失败，请稍后重试");
                }
            })
        }
    }else {//没有修改密码
        var text = "保存成功";
        $(".canbox-2 .sc-date").html(text);
        $(".canbox-2 .c-form a").attr("class","ok");
        $(".canbox-2").slideDown();
        $(".canbox-2").on("click", ".ok", function () {
            $(".canbox").slideUp();
            window.location.reload();
        });
    }
});

function isPasswd(str) {
    var reg = /^(\w){8,16}$/;
    if(!reg.exec(str)) return false;
    return true
}
//修改密码保存成功后的弹框中的关闭按钮
$(".canbox-2 .c-off").on("click",function(){
    if($(".ok").size()==0){
        $(".canbox").slideUp();
        window.location.href="../login/login.html";
    }else{
        $(".canbox").slideUp();
        window.location.reload();
    }
});
//修改密码保存成功后的弹框中的确定按钮
$(".canbox-2").on("click",".bg-c1",function(){
    $(".canbox").slideUp();
    window.location.href="../login/login.html";
});
//没有修改密码保存成功后的弹框中的确定按钮
$(".canbox-2").on("click",".ok",function(){
    $(".canbox").slideUp();
    window.location.reload();
});
$(".info-key").on("click","button.cancel",function(){
    window.location.reload();
});
$(".setting-value").on("click","button.cancel",function(){
    window.location.reload();
});





layui.use('laydate', function() {
    var laydate = layui.laydate;
    $("#birthDay").on("click",function(){
        var one={
            min:'1900-01-01',
            max:laydate.now(),
            zIndex:999999
        }
        one.elem=this;
        laydate(one);
    });
});
























