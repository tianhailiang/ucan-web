var $ = require('/modules/lib/jquery.js');
require('/modules/lib/jquery.ui.dialog.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
require('/modules/lib/json.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

/*
 关于 regFlag：
 是否为签约用户条件： (regFlag & 1) != 0
 是否为智慧之星条件： (regFlag & 2) != 0
 是否为实名认证条件： (regFlag & 4) != 0
 是否为资格认证条件： (regFlag & 8) != 0
 是否可上门授课条件： (regFlag & 16) != 0
 是否为随时报名条件： (regFlag & 32) != 0
 */

var courseId = 0;
if (location.href.match(/courseId=(\d+)/)) {
	courseId = RegExp.$1;
} else {
	console.error('课程详情加载失败 => 缺少courseId参数');
}

var token = "";
var courseId = getQueryString("courseId");

var recStatus = getQueryString("recStatus");
var isBool = false;
var userT = "";
var isCheckbox = false;

  
if (sessionStorage.obj) {
	//获取token 
	var userStr = JSON.parse(sessionStorage.obj);
	var token = userStr.user.userToken;
	userT = userStr.user.groups;
	if(userT == "teacher"){
		$(".collectS").hide();
	}else{
		$(".collectS").show();
	}
	//进入页面判断用户有没有收藏
	axios.get('/api/view/user/favorite/courses/findList', {
		params: {
			courseId: courseId,
			token: token
		}
	}).then(function (response) {
		notlogin(response.data);
		if(response.data.data.length){
			$(".detail-header .slider-content .detail-info ul li:first-child i").css("background", "url(./img/i-sc-f.png) no-repeat");
			isBool = true;
		}
	}.bind(this));
}


$(".collectS").show();

//获取URL参数中的name:value
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

//用户登录验证
function notlogin(data) {
	if (data.code != 0) {
		alert(data.message);
		if (data.code == 6012) {
			location.href = "./pages/login/login.html";
		}
	}
}

module.exports = {
	init: function () {

		var vm = new Vue({
			el: '#course-detail',
			created: function () {
				this.loadData();
				if (sessionStorage.obj) {
					this.searchLive();
				}
			},
			data: {
				isLoading: 0,
				co: {},
				selectedCourse: -1,
				showClasses: 0,
				showClass: 0,
				rows: [],
				rowsS: [],
				live: 0,
                // 每页12个
                size: 10,
                // 初始页码
                page: 1,
                maxPage: '-',
                courseIdStr: "",
                newTimes: "",
                judge: ""
			},
			methods: {
				loadData: function () {
					var $this = this;


					//http://ucan.bin-go.cc/api/view/guest/courses/findOne?id=349
					
					axios.get('/api/view/guest/courses/findOne', {
							params: {
								id: courseId
							}
						})
						.then(function (response) {
							var costData = response.data.data;
							console.log(costData)
							if (costData.ucanFile) {
								costData.courseImg = costData.ucanFile.newUrl;
							} else {
								costData.courseImg = "./img/default-course.png";
							}
							costData.flag = costData.teacher.regFlagStr;
							this.$set(this, 'co', costData);
						}.bind(this))
						.catch(function (error) {
							console.log(error);
						});
				},
				
				collect: function () {
//					var params = new URLSearchParams();
//					params.append('courseId', courseId);
//					//                    params.append('mode', this.co.mode);
//					params.append('token', token);
					
					if(!isBool){

						if(userT=="teacher"){

							alert("教师不允许收藏课程");

						}else{
							axios.post('/api/view/user/favorite/courses/add?token='+token+'&courseId='+courseId)
								.then(function (response) {

								if (response.data.code == 0) {
									$(".detail-header .slider-content .detail-info ul li:first-child i").css("background", "url(./img/i-sc-f.png) no-repeat");
									isBool = true
								
								} else {
									notlogin(response.data);
								}
							});	
						}

					}else{
						axios.post('/api/view/user/favorite/courses/remove?token='+token+'&courseId='+courseId)
							.then(function (response) {
							notlogin(response.data);
							if (response.data.code == 0) {
								$(".detail-header .slider-content .detail-info ul li:first-child i").css("background", "url(./img/i-sc.png) no-repeat");
								isBool = false
							} else {
								if(response.data.code == 1500){
									alert("系统繁忙，稍后重试。")
								}
							}
						});
					}
				},

				getClasses: function (id) {
//					$('.class-dialog').dialog({
//					   resizable: false,
//					   height: 'auto',
//					   width: 400,
//					   modal: true
//					});
					if (this.showClasses) {
						return;
					}

					// 显示弹窗
//					this.$set(this, 'showClasses', 1);
					var date = new Date();
					var m = date.getMonth() + 1;
					var em = date.getMonth() + 2;
					var d = date.getDate();
					var hour = date.getHours();
					var minute = date.getMinutes();
					var second = date.getSeconds();
					var beginDate = date.getFullYear() + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
					var endDate = date.getFullYear() + '-' + (em > 9 ? em : '0' + em) + '-' + (d > 9 ? d : '0' + d);
					var newTime = date.getFullYear()+"-"+((date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1))+"-"+(date.getDate()>9?date.getDate():'0'+date.getDate())+" "+(date.getHours()>9?date.getHours():'0'+date.getHours())+":"+(date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes())+":"+(date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds());
					
					// console.log(recStatus)
					
					if(recStatus){
					  
					   this.$set(this, 'showClass', 1);
						axios.get('/api/view/user/rec/findList', {
							params: {
								token:token,
								courseId: courseId
							}
						})
						.then(function (response) {
							var data = response.data.data;
							notlogin(response.data);
							this.$set(this, 'rowsS', data);
						}.bind(this))
						.catch(function (error) {
							console.log(error);
						});

					}else{
					  this.$set(this, 'showClasses', 1);
						axios.get('/api/view/user/costs/findPage', {
							params: {
								token:token,
								courseId: courseId,
//								beginDate: beginDate,
//								beginDate: '2017-02-20',
								endDate: endDate,
								size: 999,
								sort:'{"keys":"beginTime","sortType":"asc"}'
							}
						})
						.then(function (response) {
							var data = response.data.data;
							
							notlogin(response.data);
							for(var i = 0;i<data.rows.length;i++){
								if(data.rows[i].rooms){
									data.rows[i].checked = false;
								}else if(data.rows[i].scheduleFlag == 1){
									data.rows[i].checked = false;
								}else if(newTime > data.rows[i].endTime){
									data.rows[i].checked = false;
								}else{
									data.rows[i].changeChecked = true;
									data.rows[i].checked = false;
								}
							}
							this.$set(this, 'rows', data.rows);
							this.$set(this, 'newTimes', newTime);
						}.bind(this))
						.catch(function (error) {
							console.log(error);
						});
					}
					
				},

				// 预约课程
				subscribeCourse: function (rows) {
						var arrId = [];
						for(var i = 0;i<rows.length;i++){
							if(rows[i].checked) arrId.push(rows[i].id);
						}
						var costId = arrId.join(",");
						// TODO
						if (arrId.length == 0) {
							alert('请选择要预约的课程');
							return;
						}
						axios.post('/api/view/user/course/schedules/saveSchedules?token='+token+'&costIds='+costId)
							.then(function (response) {
							var data = response.data;
							alert(data.message);
							window.location.reload();
						}.bind(this))
							.catch(function (error) {
							console.log(error);
						});
				},
				
				selectS: function(rows){
					if($("#select-all")[0].checked == true){
						for(var i = 0;i<rows.length;i++){
							if(rows[i].changeChecked){
								$(".checkboxSS")[i].checked = true;
								rows[i].checked = true;
							}
						}
					}else{
						for(var j = 0;j<rows.length;j++){
							if(rows[j].changeChecked){
								$(".checkboxSS")[j].checked = false;
								rows[j].checked = false;
							}
						}
					}
				},
				
				changeChecked: function(index,rows){
					if($(".checkboxSS")[index].checked){
						$(".checkboxSS")[index].checked = true;
						rows[index].checked = true;
						$("#select-all")[0].checked = false;
					}else{
						$("#select-all")[0].checked = false;
						$(".checkboxSS")[index].checked = false;
						rows[index].checked = false;
					}
				},
				
				searchLive: function(){
					axios.get('/api/view/user/course/schedules/findCourse', {
						params: {
							courseId: courseId,
							token: token
						}
					}).then(function (response) {
						notlogin(response.data);
						var data = response.data.data;
						if(!data){
							data.roomId = 1;
						}

						console.log(data)
						
						this.$set(this, 'judge', data);
						
					}.bind(this));
				}
			}
		});
	}
};
