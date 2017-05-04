// var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

module.exports = {
    init: function () {
        var vm = new Vue({
            el: '#class-aside',
            created: function () {
                this.loadData();
            },
            data: {
                isLoading: 0,
                rowsTwo: [],
                currentRows: [],
                index: 0,
                size: 5,
                maxIndex: 0
            },
            methods: {
                loadData: function () {
                    var $this = this;
                    axios.get('/api/view/guest/costs/findPageTime', {
                        params: {
                        	removeFlag: 0
                        }
                    })
                        .then(function (response) {
                            var data = response.data.data;
                            // 判断图片，价钱存在与否
                            var beginTime = "";
                            for(var i = 0;i<data.rows.length;i++){
                                if(!data.rows[i].coursePlans.courses.ucanFile){
                                    data.rows[i].coursePlans.courses.ucanFile = "./img/default-course.png";
                                }else{
                                    data.rows[i].coursePlans.courses.ucanFile = data.rows[i].coursePlans.courses.ucanFile.newUrl;
                                }
                            }
                            this.$set(this, 'currentRows', data.rows);
                            this.$set(this, 'maxIndex', Math.ceil(data.rows.length/this.size) - 1);
                            this.$set(this, 'rowsTwo', this.currentRows.slice(this.index * this.size, (this.index + 1) * this.size));
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        });
    }
};