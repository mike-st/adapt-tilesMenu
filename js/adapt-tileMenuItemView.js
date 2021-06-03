define([ "core/js/views/adaptView", "core/js/adapt" ], function(AdaptView, Adapt) {

    var TileMenuItemView = AdaptView.extend({

        events: {
            'click .viewtext' : 'onClickMenuItemButton',
            'click #tilemenupopup' : 'menunotifyPopup'
        },

        className: function() {
            var nthChild = this.model.get('_nthChild');
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                this.model.get('_isLocked') ? 'locked' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            var nthChild = this.model.get("_nthChild");

            if (graphic && graphic.src) {
                this.$el.imageready(this.setReadyStatus.bind(this));
                return;
            }

            this.setReadyStatus();
        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            if(this.model.get('_isLocked')) return;

            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        },

        menunotifyPopup: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var bodyText = this.model.get('body');
            var titleText = this.model.get('displayTitle');

            var popupObject = {
                title: titleText,
                body: bodyText
            };

            Adapt.trigger('notify:popup', popupObject);

        }

    }, { template: "tilesmenu-item", type: "menu" });

    return TileMenuItemView;

});
