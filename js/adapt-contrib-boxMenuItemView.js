define([
  "core/js/adapt",
  "core/js/views/menuView"
], function(Adapt, MenuView) {

  var BoxMenuItemView = MenuView.extend({

    events: {
      'click .js-menu-btn-view' : 'onClickMenuItemButton'
    },

    className: function() {
      var nthChild = this.model.get('_nthChild');
      return [
        'm-boxmenu__item',
        'm-boxmenu__item-' + this.model.get('_id') ,
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
      this.$el.imageready(_.bind(function() {
        this.setReadyStatus();
      }, this));
    },

    onClickMenuItemButton: function(event) {
      if(event && event.preventDefault) event.preventDefault();
      if(this.model.get('_isLocked')) return;
      Backbone.history.navigate('#/id/' + this.model.get('_id'), { trigger: true });
    }

  }, {
    template: 'boxmenu-item'
  });

  return BoxMenuItemView;

});
