define([
    "core/js/views/menuView",
    "./adapt-tileMenuItemView",
    "core/js/adapt",
], function(MenuView, TileMenuItemView, Adapt) {

    var TileMenuView = MenuView.extend({

        events: {
            'mousemove .firsttileview .menu-header' : 'firstPGlaunch',
            'mousemove .firsttileview .menu-tile-items' : 'firstPGlaunch'/*,
            'keyup .tiles-menu-inner .menu-header' : 'accessibilityOn',
            'keyup .tiles-menu-inner .menu-tile-items' : 'accessibilityOn'*/
        },

        className: function() {
            return MenuView.prototype.className.apply(this) + " tilesmenu-menu";
        },

        postRender: function() {
            var nthChild = 0;
            //BELOW PULLS TITLE
            /*var navtitle2 = this.model.get("displayTitle");
            Adapt.offlineStorage.set('mycourseTitle', navtitle2);
            var courseholder = Adapt.offlineStorage.get("mycourseTitle");*/

            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable') && !item.get('_isHidden')) {
                    item.set('_nthChild', ++nthChild);
                    this.$('.menu-tile-items').append(new TileMenuItemView({model: item}).$el);
                }

                if(item.get('_isHidden')) {
                    item.set('_isReady', true);
                }
            });

            /* COUNTS MENU ITEMS AND PLACES NUMBER */
            $(".menu-item").each(function(i) {
                $(this).attr('name', 'nth-child-' + parseInt(i+1));
                $(this).find(".menu-item-button").attr('data-content', ++i);
                $('.menu-item-button[data-content="' + i + '"]').click(function(){
                    /* Below addes page number in for the menu */
                    $('.navpagenum').text( 'Page ' + i + ' of ' + nthChild );
                    $('.arianavpgnum').text( 'Page ' + i + ' of ' + nthChild ).attr('role','region').attr('tabindex','0').addClass('aria-label');
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
            if ($('.navigation-back-button').hasClass('display-none')) {
                //Do Nothing on Main Menu
            } else {
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-title').addClass('submenu-title');
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-body').addClass('submenu-body');
            }

            var getUrlParameter = function getUrlParameter(sParam) { 
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
                for (i = 0; i < sURLVariables.length; i++) { 
                    sParameterName = sURLVariables[i].split('='); 
                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                };
            };
            var menulaunch = getUrlParameter('menulaunch');
            
            if(!menulaunch == ''){
                $('html#adapt').addClass('menulaunch');
            } else {
                //Don't launch to menu respect page 1 launch
            }

            // Triggers Page 1 when Accessibility button is pressed
            var config = this.model.get("_tilesMenu");
            var launchPGone = config && config._gotoPageone;
            // Tracks 3 tile across or not
            var threeAcross = config && config._threeacross;
            if (threeAcross == true) {
                $('.location-menu').addClass('tile3across');
            }

            if (launchPGone == true) {
                console.log("TILE MENU PAGE 1 LAUNCH IS OFF.");
            } else if ($('html#adapt').hasClass('menulaunch')) {
                console.log("MENU LAUNCH URL PARAMETER USED");
            } else if (launchPGone == false || $('.location-menu').hasClass('accessibility')) {
                this.listenToOnce(Adapt, "menuView:postRender pageView:postRender", this.navigateTo); 
            }

        },

        firstPGlaunch: function() {
            // Checks if you are on Main Menu or Sub Menu
            if ($('html#adapt').hasClass('menulaunch')) {
                    console.log("MENU LAUNCH URL PARAMETER USED");
            } else if ($('.navigation-back-button').hasClass('display-none')) {
                $( '.firsttileview .nth-child-1 .origbutton .viewtext' ).trigger( 'click' );
            } else {
                //Do Nothing on SUB Menu
                $('.tiles-menu-inner').removeClass('firsttileview');
            }
        },

        navigateTo: function() {
            if ($('html#adapt').hasClass('menulaunch')) {
                    console.log("MENU LAUNCH URL PARAMETER USED");
            } else if ( $('.navpagenum:empty').length ) {
                window.setTimeout(function(){
                    console.log("1st view of TILE MENU.");
                    $( '.firsttileview .nth-child-1 .origbutton .viewtext' ).trigger( 'click' );
                }, 555);
            } else {
                $('.tiles-menu-inner').removeClass('firsttileview');
                console.log("TILE MENU has been viewed before.");
            } 
        },

        accessibilityOn: function(e) {
            var code = e.keyCode || e.which;
            if (code == '9') {
                $( '.tiles-menu-inner .nth-child-1 .origbutton .viewtext' ).trigger( 'click' );
            }
        }

    }, { template: 'tilesmenu' });

    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new TileMenuView({model: model}).$el);
    });

});
