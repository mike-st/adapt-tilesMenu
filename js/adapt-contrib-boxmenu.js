define([
  'core/js/adapt',
  'core/js/views/menuView',
  "./adapt-contrib-boxMenuItemView"
], function(Adapt, MenuView, BoxMenuItemView) {

  var BoxMenuView = MenuView.extend({

    className: function() {
      return MenuView.prototype.className.apply(this) + " m-boxmenu";
    },

    postRender: function() {
      var nthChild = 0;

      this.model.getChildren().each(function(item) {
        if (item.get('_isAvailable') && !item.get('_isHidden')) {
          item.set('_nthChild', ++nthChild);
          this.$('.m-boxmenu__item-container-inner').append(new BoxMenuItemView({model: item}).$el);
        }

        if(item.get('_isHidden')) {
          item.set('_isReady', true);
        }
      });
    }

    }, {
        template: 'boxmenu'
    });

  Adapt.on('router:menu', function(model) {
    $('.location-menu').append(new BoxMenuView({model: model}).$el);
  });

});
