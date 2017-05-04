//var $ = require('/modules/lib/jquery.js');
//$(document.body).on('click', '.tl-backward', function () {
//    if ($(this).hasClass('animating') || $(this).hasClass('disabled')) {
//        return;
//    }
//    var $btn = $(this);
//    $btn.addClass('animating');
//    $btn.siblings('.disabled').removeClass('disabled');
//    var $outer = $(this).parents('.slider-outer');
//    var width = $outer.width();     
//    var ox = $outer.data('ox');
//    $outer.find('.slider-el').animate({
//        'margin-left': '+=' + (width + ox)
//    }, {
//        complete: function () {
//            if(parseInt($(this).css('margin-left')) >= 0) {
//                $btn.addClass('disabled');
//            }
//            $btn.removeClass('animating');
//        }
//    });
//})
//    .on('click', '.tl-forward', function () {
//    if ($(this).hasClass('animating') || $(this).hasClass('disabled')) {
//        return;
//    }
//    var $btn = $(this);
//    $btn.addClass('animating');
//    $btn.siblings('.disabled').removeClass('disabled');
//    var $outer = $(this).parents('.slider-outer');
//    var width = $outer.width();
//    var ox = $outer.data('ox');
//    $outer.find('.slider-el').animate({
//        'margin-left': '-=' + (width + ox)
//    }, {
//        complete: function () {
//            if($(this).width() + parseInt($(this).css('margin-left')) <=  width) {
//                $btn.addClass('disabled');
//            }
//            $btn.removeClass('animating');
//        }
//    });
//});
var $ = require('/modules/lib/jquery.js');
$(document.body).on('click', '.tl-backward', function () {
    if ($(this).hasClass('animating') || $(this).hasClass('disabled')) {
        return;
    }
    var $btn = $(this);
    $btn.addClass('animating');
    $btn.siblings('.disabled').removeClass('disabled');
    var $outer = $(this).parents('.slider-outer');
    var width = $outer.width();     
    var ox = $outer.data('ox');
    $outer.find('.slider-el').animate({
        'margin-left': '+=' + (width)
    }, {
        complete: function () {
            if(parseInt($(this).css('margin-left')) >= 0) {
                $btn.addClass('disabled');
            }
            $btn.removeClass('animating');
        }
    });
})
    .on('click', '.tl-forward', function () {
    if ($(this).hasClass('animating') || $(this).hasClass('disabled')) {
        return;
    }
    var $btn = $(this);
    $btn.addClass('animating');
    $btn.siblings('.disabled').removeClass('disabled');
    var $outer = $(this).parents('.slider-outer');
    var width = $outer.width();
    var ox = $outer.data('ox');
    $outer.find('.slider-el').animate({
        'margin-left': '-=' + (width)
    }, {
        complete: function () {
            if($(this).width() + parseInt($(this).css('margin-left')) <=  width) {
                $btn.addClass('disabled');
            }
            $btn.removeClass('animating');
        }
    });
});