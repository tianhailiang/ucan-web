// var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
require('/modules/js/slider.js');

module.exports = {
    init: function () {
        var vm = new Vue({
            el: '#recom-course',
            created: function () {
                this.loadData();
            },
            data: {
                isLoading: 0,
                rows: []
            },
            methods: {
                loadData: function () {
                    var $this = this;
                    axios.get('/api/view/guest/courses/findList', {
                        params: {}
                    })
                        .then(function (response) {
                           
                            var data = response.data.data;

                            for(var i = 0;i<data.length;i++){
                                if(!data[i].ucanFile){
                                    data[i].ucanFile = "./img/default-course.png";
                                }else{

                                    //http://ucan.bin-go.cc
                                    // data[i].ucanFile = data[i].ucanFile.newUrl;

                                    data[i].ucanFile ="http://ucan.bin-go.cc"+ data[i].ucanFile.newUrl;
                                }
                            }

                            
                            this.$set(this, 'rows', data);
                        }.bind(this))
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        });
    }
};