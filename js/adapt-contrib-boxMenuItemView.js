define([
  "core/js/adapt",
  "core/js/views/menuView"
], function(Adapt, MenuView) {

  var BoxMenuItemView = MenuView.extend({

    events: {
      'click .js-btn-navigate' : 'onClickMenuItemButton'
    },

    className: function() {
      var nthChild = this.model.get('_nthChild');
      return [
        'm-box-menu__item',
        'm-box-menu__item-' + this.model.get('_id') ,
        this.model.get('_classes'),
        this.model.get('_isVisited') ? 'is-visited' : '',
        this.model.get('_isComplete') ? 'is-completed' : '',
        this.model.get('_isLocked') ? 'is-locked' : '',
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
    template: 'boxMenuItem'
  });

  return BoxMenuItemView;

});
