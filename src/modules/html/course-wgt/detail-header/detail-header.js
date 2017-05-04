/**
 * @file 事件中心
 * @author Lone(chenguoliang@baidu.com)
 * @version 1.0
 */
var $ = require('/modules/lib/jquery.js');
var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
var Dialog = require('/modules/lib/jquery.ui.dialog.js');
var juicer = require('/modules/lib/juicer.js');

var app = {
    init: function() {
        this.bind();
    },
    bind: function() {
        var me = this;
        if (!me.yuyueTpl) {
            me.yuyueTpl = juicer($('#y-yuyue-dialog').html());
        }
        if (!me.skanTpl) {
            me.skanTpl = juicer($('#y-skan-dialog').html());
        }
        $('.detail-header').on('click', '.to-check-class', function() {
            var dialogData = $(this).hasClass('ready')
                ? {tpl: me.yuyueTpl, width: 720, height: 470}
                : {tpl: me.skanTpl, width: 850, height: 700};
            var d = new Dialog({
                width: dialogData.width,
                height: dialogData.height,
                autoDispose: true,
                className: 'y-yuyue',
                content: dialogData.tpl.render(),
                open: function() {
                    var $selectList = $('.class-select-ul').find('.select-li');
                    $('.skan-all-container').on('click', '#select-all', function() {
                        if ($(this).is(':checked')) {
                            $selectList.not('.has-select').find('.checkbox').prop('checked', true);
                        } else {
                            $selectList.find('.checkbox').prop('checked', false);
                        }
                    }).on('click', '.to-check-class', function() {
                        var list = $selectList.not('.has-select').find('.checkbox:checked');
                        if (list.length == 0 ) {
                            return;
                        }
                        $.each(list, function(index, el) {
                            console.log($(el).val());
                        });
                    });
                    $('.yuyue-all-container').on('click', '.select-li', function() {
                        if ($(this).hasClass('has-select')) {
                            return;
                        } else {
                            $(this).parent().find('.selected').removeClass('selected').find('.select-status').text('可预约');
                            $(this).addClass('selected').find('.select-status').text('已预约');
                        }
                    }).on('click', '.to-check-class', function() {
                        var data = $(this).prev().find('.select-li.selected').data('val');
                        console.log(data);
                    });
                },
                close: function() {}
            });
        });
    }
};


module.exports = app;
