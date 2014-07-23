(function($, Symphony) {
	'use strict';

	Symphony.Language.add({
		'Edit': false,
		'Associated {$section-name}': false
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
			console.log('createTriggerTemplate');
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
			var trigger = $(this),
				page = templatePage.clone(),
				link = trigger.parents('.item').data('link');

			// Adjust nested section
			page.find('iframe').attr('src', link).on('load.aui-editor', function() {
				var iframe = $(this),
					contents = iframe.contents();

				// Remove elements
				contents.find('body').addClass('aui-editor-section');
				contents.find('#header').remove();
				contents.find('#context .actions').remove();
				contents.find('#content .actions .delete').remove();

				// Modify content
				contents.find('#breadcrumbs a').each(function(index) {
					var link = $(this),
						sectionName;

					link.removeAttr('href');

					if(index === 0) {
						name = link.text();
						link.text(Symphony.Language.get('Associated {$section-name}', {
							'section-name': name
						}));
					}
				});

				iframe.removeClass('hidden');
			});

			// Cancel page
			page.on('click.aui-editor', function() {
				page.addClass('cancel');
				setTimeout(function() {
					page.remove();
				}, 500);
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
