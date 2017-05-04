var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

var courseId = 0;
if (location.href.match(/courseId=(\d+)/)) {
    courseId = RegExp.$1;
    // console.log(courseId);
}else{
    console.error('评价加载失败 => 缺少courseId参数');
}

module.exports = {
    init: function () {
        var vm = new Vue({
            el: '#class-evaluate',
            created: function () {
                this.loadData();
            },
            data: {
                isLoading: 0,
                rows: [],
                // 每页12个
                size: 4,
                maxPage: '-',
                // 初始页码
                page: 1
            },
            methods: {
                loadData: function () {
                    var $this = this;
                    axios.get('/api/view/guest/courses/evaluations/query', {
                        params: {
                            courseId: courseId,
                            page: this.page-1,
                            size: this.size
                        }
                    })
                        .then(function (response) {
                            var data = response.data.data;
                            // 判断图片，价钱存在与否
                            for(var i = 0;i<data.rows.length;i++){
                       	         if(!data.rows[i].students.ucanFile){
                                    data.rows[i].students.ucanFile = "./img/body-header.png";
                                }else{
                                    data.rows[i].students.ucanFile = data.rows[i].students.ucanFile.newUrl;
                                }
                            }
                            this.$set(this, 'rows', data.rows);
//          		        this.$set(this, 'page', 1);
                            this.$set(this, 'maxPage',Math.ceil(data.total/this.size));
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });
                },
                
                gotoPage: function(){
                    var $pageNum = $('.goto-num');
                    var pageNum = $pageNum.val();
                    pageNum = Math.max(pageNum, 1);
                    pageNum = Math.min(pageNum, this.maxPage);
                    $pageNum.val(pageNum);
                    this.$set(this, 'page', pageNum);
                    this.loadData();
                }
            }
        });
    }
};