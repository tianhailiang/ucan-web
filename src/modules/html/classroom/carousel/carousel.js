var $ = require('/modules/lib/jquery.js');
module.exports = {
    init: function () {
        var wd = "850px";
        $(function () {
            $('.class-carousel').css(
                {
                    width: wd
                }
            )
                .find('.carousel-wp ').css({
                width: wd,
                'margin-left': -wd
            })
                .find('li').each(function(){
                $(this).css({
                    width: wd
                });
            });
            $('.class-carousel').each(function () {
                var $this = $(this);
                var $wp = $this.find('.carousel-wp');
                var $list = $this.find('.carousel-list');
                var $items = $list.children();
                var $container = $wp.find('#slideContainer');
                var count = $items.length;
                var item_size = 850;
                var dur = 1000;
                var interval = 8000;
                var curIdx = 0;
                var fixIdx = function (idx) {
                    if (idx < 0)
                        return
                    (count - 1);
                    if (idx >= count)
                        return 0;
                    return idx;
                };

                var goto = function (idx) {
                    var idx = fixIdx(idx);
                    $items.eq(idx).addClass('active').siblings().removeClass('active');
                    if (curIdx != idx) {
                        var offsetX = -idx * item_size;
                        $container.stop().animate({'left': offsetX}, dur);
                        curIdx = idx;
                    }
                };

                $items.each(function (index, element) {
                    var $cur = $(this);
                    var $a = $cur.find('a');
                    $a.data('index', index);
                    $a.click(function () {
                        var index = $(this).data('index');
                        goto(index);
                        return false;
                    });
                });

                var autoFlag = true;

                window.setInterval(function () {
                    if (autoFlag) {
                        goto(curIdx + 1);
                    }
                }, interval);

                $this.hover(function () {
                    autoFlag = false;
                }, function () {
                    autoFlag = true;
                });

                goto(0);
            });
        });
    }
};