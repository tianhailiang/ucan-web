var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

module.exports = {
    init: function () {
        var vm = new Vue({
            el: '#box-1on1',
            created: function () {
                this.loadNav();
                this.loadClass();
            },
            data: {
                isLoading: 0,
                rowsOne: [],
                // 导航名称
                navAllIds: '',
                navList: [],
                currentNavId: 0
            },
            methods: {
                // 获取课程导航
                loadNav: function () {
                    var $this = this;
                    axios.get('/api/view/guest/courses/courseTopics', {
                        params: {}
                    })
                        .then(function (response) {
                            var data = response.data.data;
                            this.$set(this, 'navList', data);
                            var navAllIds = [];
                            data.map(function (item, index, arr) {
                                navAllIds.push(item.id);
                            });
                            this.$set(this, 'navAllIds', navAllIds.join());
                            this.$set(this, 'currentNavId', this.navAllIds);
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });
                },

                changeClassNav: function (id) {
                    var $this = this;
                    axios.get('/api/view/guest/courses/findPageQuery', {
                        params: {
                            topicId: id,
                            mode: "ooo",
                            size: 9999,
							isFinsh: "1"
                        }
                    })
                        .then(
                        function (response) {
                                var data = response.data.data.rows;
                                // 判断图片，价钱存在与否
                                for(var i = 0;i<data.length;i++){
                           	         if(!data[i].ucanFile){
                                        data[i].ucanFile = "./img/default-course.png";
                                    }else{
                                        data[i].ucanFile = data[i].ucanFile.newUrl;
                                    }
                                }
                                this.$set(this, 'rowsOne', data);
                                var $el = $('#box-1on1');
                                $el.find('.tl-backward').addClass('disabled');
                                $el.find('.tl-forward').removeClass('disabled');
                                $el.find('.slider-wrapper').find('.slider-el').css('margin-left', 0);
                            }.bind(this)
                        )
                        .catch(function (error) {
                            console.log(error);
                        });
                },

                loadClass: function () {
                    var $this = this;
                    axios.get('/api/view/guest/courses/findPageQuery', {
                        params: {
                            mode: "ooo",
                            size: 9999,
							isFinsh: "1"
                        }
                    })
                        .then(
                            function (response) {
                                var data = response.data.data.rows;
                                // 判断图片，价钱存在与否
                                for(var i = 0;i<data.length;i++){
                           	         if(!data[i].ucanFile){
                                        data[i].ucanFile = "./img/default-course.png";
                                    }else{
                                        data[i].ucanFile = data[i].ucanFile.newUrl;
                                    }
                                }
                                this.$set(this, 'rowsOne', data);
                            }.bind(this)
                        )
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        });
    }
};
