(function(window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;
  
    function CheckList(selector) {
      if (!selector) {
        throw new Error('No selector provided');
      }
      this.$element = $(selector);
      if (this.$element.length === 0) {
        throw new Error('Could not find element with selector: ' + selector);
      }
    }
    CheckList.prototype.addRow = function(bobaOrder) {
      // remove any existing rows that match the email address
      this.removeRow(bobaOrder.emailAddress);
      // create a new instance of a row, using the coffee order info
      var rowElement = new Row(bobaOrder);
      // add the new row instance's $element property to the checklist
      this.$element.append(rowElement.$element);
    };
    CheckList.prototype.removeRow = function(email) {
      this.$element
        .find('[value="' + email + '"]')
        .closest('[data-boba-order="checkbox"]')
        .remove();
    };
    CheckList.prototype.addClickHandler = function(fn) {
      this.$element.on('click', 'input', function(event) {
        // Why not preventDefault here?
        // Because it would prevent the item from being checked.
        var email = event.target.value;
        this.removeRow(email);
        fn(email);
        // yep. need `.bind` after this one, otherwise
        // jQuery sets `this` to the `input` and not the instance of `CheckList`
      }.bind(this));
    };
  
    function Row(bobaOrder) {
      var $div = $('<div/>', {
        'data-boba-order': 'checkbox',
        class: 'checkbox'
      });
  
      var $label = $('<label></label>');
  
      var $checkbox = $('<input></input>', {
        type: 'checkbox',
        value: bobaOrder.emailAddress
      });
  
      var description = bobaOrder.type + ' ';
      if (bobaOrder.flavor) {
        description += bobaOrder.flavor + ' ';
      }
      description += bobaOrder.boba + ', ';
      description += ' (' + bobaOrder.emailAddress + ')';
      description += ' [' + bobaOrder.sweetness + '% Sweetness]';
  
      $label.append($checkbox);
      $label.append(description);
      $div.append($label);
  
      this.$element = $div;
    }
  
    App.CheckList = CheckList;
    window.App = App;
  })(window);
  