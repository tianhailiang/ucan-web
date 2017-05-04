var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

module.exports = {
    init: function () {
        var vm = new Vue({
            el: '#classroom',
            created: function () {
                this.loadNav();
                this.loadClass('');
            },
            data: {
                isLoading: 0,
                rows: [],
                // 导航名称
                navAllIds: '',
                navList: [],
                // 每页12个
                size: 12,
                // 初始页码
                page: 1,
                maxPage: '-',
                // 课程类型
                courseTopicsIds: '',
                // loading flag
//              loading: 0,
                isA: false,
                filterType: '',
                isBool: false
            },
            methods: {
                // 获取课程导航
                loadNav: function () {
                    var $this = this;
                    axios.get('/api/view/guest/courses/courseTopics', {
                        params: {}
                    })
                        .then(function (response) {
                            // console.log(response)
                            var data = response.data.data;
                            this.$set(this, 'navList', data);
                            var navAllIds = [];
                            data.map(function (item, index, arr) {
                                navAllIds.push(item.id);
                            });


                            this.$set(this, 'navAllIds', navAllIds.join());
                             // console.log(this.navAllIds) //1,2,3,4,5,6
                            this.$set(this, 'currentNavId', this.navAllIds);
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });
                },

                changeClassNav: function (ids) {
                    this.$set(this, 'courseTopicsIds', ids);
                    this.$set(this, 'page', 1);
                    this.loadClass('');

                },

                loadClass: function (sort) {
//                  if(this.loading) {
//                      return;
//                  }
//                  this.$set(this, 'loading', 1);
                    var $this = this;
                    var sortArr = "";
                    var minPrice = "";
                    var maxPrice = "";
                    var status = "";
                    var recStatus = "";
                    var mode = "";
                    var isFinsh = "1";
                    var objSort = {
                		createdAt: '{"keys":"createdAt","sortType":"desc"}',
                		desc: '{"keys":"countCostPrice","sortType":"desc"}',
                		asc: '{"keys":"countCostPrice","sortType":"asc"}',
                		score: '{"keys":"attention","sortType":"desc"}'
                	}
                	$(".classroom-main .cul .sort-type-price .down").css("border-top-color","#aaa");
                	$(".classroom-main .cul .sort-type-price .up").css("border-bottom-color","#aaa");
                    
                     console.log(sort) 

                    if(sort !== "live" && sort !== "1"){
                    	$("input[type=radio]").attr("checked",false);
                    	this.isBool = false;
                    }

                    if(sort == "asc"){
                    	isA = true;
                    	this.$set(this, 'isA', true);
                    	$(".classroom-main .cul .sort-type-price .down").css("border-top-color","#eb6100");
                    	$(".classroom-main .cul .sort-type-price .up").css("border-bottom-color","#aaa");
                    }else if(sort == "desc"){
                    	isA = false;
                    	$(".classroom-main .cul .sort-type-price .up").css("border-bottom-color","#eb6100");
                    	$(".classroom-main .cul .sort-type-price .down").css("border-top-color","#aaa");
                    	this.$set(this, 'isA', false);
                    }
                	if(sort == ""){
                		sort = "";
                    	objSort = "";
                	}
                	if(sort && sort.indexOf("-") > 0 ){
                		sortArr = sort.split("-");
                	}
                	if(typeof sortArr != "string"){
               			minPrice = sortArr[0];
                		maxPrice = sortArr[1];
                	}
                	if(sort == "live"){
                		mode = sort;
                	}else if(sort == "1"){
                		recStatus = sort;
                		isFinsh = "";
                	}

                    axios.get('/api/view/guest/courses/findPageQuery', {
                        params: {
                            page: this.page-1,
                            size: this.size,
                            topicId: this.courseTopicsIds,
                            sort: objSort[sort],
                            minPrice: minPrice,
                            maxPrice: maxPrice,
                            status: status,
                            recStatus: recStatus,
                            mode: mode,
							isFinsh: isFinsh
                        }
                    })
                        .then(
                            function(response) {

                                console.log(response)
                                var data = response.data.data;
                                // 判断图片，价钱存在与否
                                if(data && data.rows.length !== 0){
                                	$(".course-content").css("text-align","left");
                                	$(".course-content .course-content-ul").show();
                                	$(".course-content img").hide();
                                	$(".paginator").show();
	                                for(var i = 0;i<data.rows.length;i++){

	                           	        if(!data.rows[i].ucanFile){
	                                        data.rows[i].ucanFile = "./img/default-course.png";
	                                    }else{
                                            console.log(data.rows[i].ucanFile.newUrl)
	                                        data.rows[i].ucanFile = data.rows[i].ucanFile.newUrl;

	                                    }

	                                    if(recStatus){
	                                    	data.rows[i].id = data.rows[i].id + "&recStatus=1";
	                                    }
	                               	}

	                            	this.$set(this, 'rows', data.rows);
				                    this.$set(this, 'filterType', sort);
//				                    this.$set(this, 'page', 1);
//	                                this.$set(this, 'loading', 0);
	                                this.$set(this, 'maxPage', Math.ceil(data.total/this.size));
                                    console.log(this.rows)
                                }else{
                                	$(".course-content-ul").parent().css("text-align","center");
                                	$(".course-content .course-content-ul").hide();
                                	$(".course-content img").show();
                                	$(".paginator").hide();
                                }
                            }.bind(this)
                        )
                        .catch( function(error) {console.log(error);});
                },
                
                gotoPage: function(){
                    var $pageNum = $('.goto-num');
                    var pageNum = $pageNum.val();
                    pageNum = Math.max(pageNum, 1);
                    pageNum = Math.min(pageNum, this.maxPage);
                    $pageNum.val(pageNum);
                    this.$set(this, 'page', pageNum);
                    this.loadClass('');
                }
               //判断教师可不可以进入其他老师课程详情
//             Jump: function(id){
//          	if(sessionStorage.obj){
//             		var userStr = JSON.parse(sessionStorage.obj);
//          		if(userStr.user.groups == "teacher"){
//          			alert("老师端不可查看课程信息");
//          			return;
//          		}
//          	}
//          	window.location.href = "./course.html?courseId=" + id;
//             }
            }
        });
    }
};