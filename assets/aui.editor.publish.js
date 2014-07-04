(function($, Symphony) {
	'use strict';

	Symphony.Extensions.AssociationUIEditor = function() {
		var fields, trigger;

		var init = function() {
			// console.log('editor');
			trigger = createTrigger();
			fields = Symphony.Elements.contents.find('.field[data-editor^="aui-editor"]');
			setTimeout(function() {
				fields.each(attachEditor);
			},0);
		};

		var createTrigger = function() {
			return $('<a />', {
				class: 'aui-editor-trigger',
				text: 'trigger'
			})
		};

		var attachEditor = function() {
			var item = $(this).find('.item');

			if(!item.find('.aui-editor-trigger').length) {
				item.prepend(trigger.clone());				
			}
		};

		// API
		return {
			init: init
		};
	}();

	$(document).on('ready.aui-editor', function() {
		Symphony.Extensions.AssociationUIEditor.init();
	});

})(window.jQuery, window.Symphony);
