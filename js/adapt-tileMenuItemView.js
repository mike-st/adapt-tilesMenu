define([ "core/js/views/adaptView", "core/js/adapt" ], function(AdaptView, Adapt) {

    var TileMenuItemView = AdaptView.extend({

        events: {
            'click .viewtext' : 'onClickMenuItemButton',
            'click #tilemenupopup' : 'menunotifyPopup'
        },

        className: function() {
            var classes = "menu-item";
            var modelClasses = this.model.get("_classes");

            if (modelClasses) classes += " " + modelClasses;
            if (this.isVisited()) classes += " visited";
            if (this.model.get("_isOptional")) classes += " optional";
            if (this.model.get("_isComplete")) classes += " completed";
            if (this.model.get("_isLocked")) classes += " locked";

            return classes;
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');

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

            Adapt.notify.popup(popupObject);

        },

        isVisited: function() {
            if (this.model.get("_isVisited")) return true;

            var components = this.model.findDescendantModels("component");

            return _.find(components, function(component) {
                return component.get("_isComplete") && component.get("_isAvailable") &&
                    !component.get("_isOptional");
            });
        }

    }, { template: "tilesmenu-item", type: "menu" });

    return TileMenuItemView;

});
