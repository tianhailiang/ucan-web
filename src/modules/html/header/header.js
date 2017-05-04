var $ = require('/modules/lib/jquery.js');



module.exports = {
    init: function () {
        this.dropMenu();
        this.showNav();

       
    },

    showNav: function () {
        var $nav = $('#main-nav');
        var url = location.href;
        // if(/(index|quxue)\.html/.test(location.href))){
        //     $nav.find('.nav-' + RegExp.$1).addClass('current');
        // }
        switch (!0) {
            case /index\.html/.test(url) || location.pathname === '/':
                $nav.find('.nav-index').addClass('current');
                break;

            case /quxue\.html/.test(url):
                $nav.find('.nav-quxue').addClass('current');
                break;

            case /about\.html/.test(url):
                $nav.find('.nav-about').addClass('current');
                break;
        };
    },

    dropMenu: function () {
        var timer = null;
        var $dropDownList = $('#user-drop-down'),
            $dropDownMenu = $('#user-drop-down-btn');

        $dropDownMenu.hover(
            function () {
                if (timer) {
                    clearTimeout(timer);
                }
                $dropDownList.show();
            },
            function () {
                timer = setTimeout(function () {
                    $dropDownList.hide();
                }, 300)
            }
        );
    }
};
