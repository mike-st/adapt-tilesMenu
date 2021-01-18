define([
    "core/js/views/menuView",
    "./adapt-tileMenuItemView",
    "core/js/adapt",
], function(MenuView, TileMenuItemView, Adapt) {

    var TileMenuView = MenuView.extend({

        events: {
            'mousemove .firsttileview .menu-header' : 'firstPGlaunch',
            'mousemove .firsttileview .menu-tile-items' : 'firstPGlaunch',
            'mousemove .tiles-menu-inner .menu-header' : 'accessibilityOn',
            'mousemove .tiles-menu-inner .menu-tile-items' : 'accessibilityOn'
        },

        className: function() {
            return MenuView.prototype.className.apply(this) + " tilesmenu-menu";
        },

        postRender: function() {
            this.setUpItems();

            /* COUNTS MENU ITEMS AND PLACES NUMBER */
            var numofpgs = $(".menu-item").length;
            $(".menu-item").each(function(i) {
                $(this).attr('name', 'nth-child-' + parseInt(i+1));
                $(this).find(".menu-item-button").attr('data-content', ++i);
                $('.menu-item-button[data-content="' + i + '"]').click(function(){
                    /* Below addes page number in for the menu */
                    console.log('Page ' + i + ' of ' + numofpgs)
                    $('.navpagenum').text( 'Page ' + i + ' of ' + numofpgs );
                    $('.arianavpgnum').text( 'Page ' + i + ' of ' + numofpgs ).attr('role','region').attr('tabindex','0').addClass('aria-label');
                });

                //Replace UL list tags to p tags
                $('.menu-item-button[data-content="' + i + '"] .origbutton ul').replaceWith(function(){
                    return $("<p />", {html: $(this).html()});
                });

                //Replace OL list tags to p tags
                $('.menu-item-button[data-content="' + i + '"] .origbutton ol').replaceWith(function(){
                    return $("<p />", {html: $(this).html()});
                });

                //PUT P tags in front of TABLE tags to hide
                $('.menu-item-button[data-content="' + i + '"] .origbutton').find('table').wrap( "<p></p>" );

                //BELOW COUNTS BODY MESSAGE STRING COUNT IF TOO LONG MAKES BUTTON
                var myPtag = $('.menu-item-button[data-content="' + i + '"] .origbutton').find('p:first');
                var howmanyPtag = $('.menu-item-button[data-content="' + i + '"] .origbutton').find('p');

                if(myPtag.text().length >= 200 || howmanyPtag.length > 1){
                    $('.menu-item-button[data-content="' + i + '"] .origbutton p:first').addClass('myPtag').html($('.menu-item-button[data-content="' + i + '"] .origbutton p:first').html().substring(0, 200) + " ...<br/>" + "<div id=\"tilemenupopup\">+ Read more</div>");
                } else {
                    $('.menu-item-button[data-content="' + i + '"] .origbutton p:first').addClass('myPtag');
                }
            });

            // Checks if you are on Main Menu or Sub Menu
            if ($('.nav__back-btn').hasClass('u-display-none')) {
                //Do Nothing on Main Menu
                //BELOW PULLS TITLE
                var navtitle2 = $( '.menu-title-inner' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            } else {
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-title').addClass('submenu-title');
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-body').addClass('submenu-body');
                //BELOW PULLS TITLE
                var navtitle2 = $( '.menu-title-inner' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            }

            // Triggers Page 1 when Accessibility button is pressed
            var config = this.model.get("_tilesMenu");
            var launchPGone = config && config._gotoPageone;

            if (launchPGone == true) {
                console.log("TILE MENU PAGE 1 LAUNCH IS OFF.");
            } else if (launchPGone == false || $('.location-menu').hasClass('accessibility')) {
                this.listenToOnce(Adapt, "menuView:postRender pageView:postRender", this.navigateTo); 
            }

        },

        firstPGlaunch: function() {
            // Checks if you are on Main Menu or Sub Menu
            if ($('.nav__back-btn').hasClass('u-display-none')) {
                $( '.firsttileview .menu-item[name="nth-child-1"] .origbutton .viewtext' ).trigger( 'click' );
            } else {
                //Do Nothing on SUB Menu
                $('.tiles-menu-inner').removeClass('firsttileview');
            }
        },

        navigateTo: function() {
            if( $('.navpagenum:empty').length ) {
                window.setTimeout(function(){
                    console.log("1st view of TILE MENU.");
                    $( '.firsttileview .menu-item[name="nth-child-1"] .origbutton .viewtext' ).trigger( 'click' );
                }, 555);
            } else {
                $('.tiles-menu-inner').removeClass('firsttileview');
                console.log("TILE MENU has been viewed before.");
            } 
        },

        accessibilityOn: function(e) {
            if ($('.location-menu').hasClass('accessibility')) {
                console.log("TILE MENU Accessibility On");
                $( '.tiles-menu-inner .menu-item[name="nth-child-1"] .origbutton .viewtext' ).trigger( 'click' );
            } else {
                //DO NOTHING
            }
            
        },

        setUpItems: function() {
            var items = this.model.getAvailableChildModels();
            var $items = this.$(".menu-tile-items");

            for (var i = 0, j = items.length; i < j; i++) {
                var nthChild = { model: items[i] };

                $items.append(new TileMenuItemView(nthChild).$el);
            }
        }

    }, { template: 'tilesmenu' });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new TileMenuView({model: model}).$el);

    });

});
