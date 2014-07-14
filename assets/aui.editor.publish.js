(function($, Symphony) {
	'use strict';

	Symphony.Language.add({
		'Edit': false
	});

	Symphony.Extensions.AssociationUIEditor = function() {
		var fields,
			templateTrigger, templatePage;

		var init = function() {
			fields = Symphony.Elements.contents.find('.field[data-editor^="aui-editor"]');
			templateTrigger = createTriggerTemplate();
			templatePage = createPageTemplate();

			attachEditor();
		};

		var createTriggerTemplate = function() {
			return $('<a class="aui-editor-trigger">' + Symphony.Language.get('Edit') + '</a>');
		};

		var createPageTemplate = function() {
			return $('<div class="aui-editor-wrapper"><div class="aui-editor-page"><iframe class="hidden" width="100%" height="100%" frameborder="0" /></div></div>');
		};

		var attachEditor = function() {
			fields.each(attachTrigger);
		};

		var attachTrigger = function() {
			var item = $(this).find('.item'),
				trigger = templateTrigger.clone();

			trigger.on('click.aui-editor', loadPage);
			item.not('.aui-editor-trigger').prepend(trigger);				
		};

		var loadPage = function() {
			var page = templatePage.clone();

			// Adjust nested section
			page.find('iframe').attr('src', Symphony.Context.get('root') + '/symphony/').on('load.aui-editor', function() {
				var iframe = $(this),
					contents = iframe.contents();

				contents.find('body').addClass('aui-editor-section');
				contents.find('#header').remove();
				contents.find('#context .actions').remove();

				iframe.removeClass('hidden');
			});

			Symphony.Elements.contents.append(page);
		};

		// API
		return {
			init: init
		};
	}();

	$(window).on('load.aui-editor', function() {
		Symphony.Extensions.AssociationUIEditor.init();
	});

})(window.jQuery, window.Symphony);
