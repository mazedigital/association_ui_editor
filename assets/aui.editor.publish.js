(function($, Symphony) {
	'use strict';

	Symphony.Language.add({
		'Edit': false,
		'Associated {$section-name}': false,
		'You just closed the editor for “{$title}”.': false
	});

	Symphony.Extensions.AssociationUIEditor = function() {
		var fields,
			templateTrigger, templateEditor,
			editors = {};

		var init = function() {
			fields = Symphony.Elements.contents.find('.field[data-editor^="aui-editor"]');
			templateTrigger = createTriggerTemplate();
			templateEditor = createEditorTemplate();

			attachEditor();
		};

		var createTriggerTemplate = function() {
			return $('<a class="aui-editor-trigger">' + Symphony.Language.get('Edit') + '</a>');
		};

		var createEditorTemplate = function() {
			return $('<div class="aui-editor"><div class="aui-editor-page"><iframe class="is-hidden" width="100%" height="100%" frameborder="0" /></div></div>');
		};

		var attachEditor = function() {
			fields.each(attachTrigger);
		};

		var attachTrigger = function() {
			var item = $(this).find('.item'),
				trigger = templateTrigger.clone();

			trigger.on('mousedown.aui-editor', triggerPage);
			item.not('.aui-editor-trigger').prepend(trigger);				
		};

		var triggerPage = function(event) {
			var link = $(this).parent().data('link');

			event.preventDefault();
			event.stopPropagation();

			if(editors[link]) {
				showEditor(link);
			}
			else {
				loadEditor(link);
			}
		};

		var loadEditor = function(link) {
			var editor = templateEditor.clone();

			// Prepare page
			editor.find('iframe').attr('src', link).on('load.aui-editor', loadPage);

			// Prepare editor closing
			editor.on('click.aui-editor', closeEditor);

			// Attach editor
			editor.data('link', link);
			editors[link] = editor;
			showEditor(link);
		};

		var closeEditor = function() {
			var editor = $(this),
				link = editor.data('link');

			editor.addClass('is-canceled');
			resetScrollHeight();

			// Hide wrapper
			setTimeout(function() {
				editor.addClass('is-hidden');
			}, 500);

			// Prepare undo
			prepareUndo(link);
		};

		var loadPage = function() {
			var iframe = $(this),
				editor = iframe.parents('.aui-editor'),
				contents = iframe.contents(),
				title = contents.find('#symphony-subheading').text(),
				link = editor.data('link'),
				height;

			// Store title
			editor.data('title', title);

			// Remove elements
			contents.find('body').addClass('aui-editor-section');
			contents.find('#header').remove();
			contents.find('#context .actions').remove();
			contents.find('#contents .actions .delete').remove();

			// Modify header links
			contents.find('#breadcrumbs a').each(modifyHeader);

			// Show content
			iframe.removeClass('is-hidden');

			// Set height
			height = contents.find('#wrapper').height();
			editor.data('height', height);
			setScrollHeight(link);
		};

		var modifyHeader = function(index) {
			var link = $(this),
				sectionName;

			// Remove internal links
			link.removeAttr('href');

			// Set title
			if(index === 0) {
				link.text(Symphony.Language.get('Associated {$section-name}', {
					'section-name': link.text()
				}));
			}
		};

		var showEditor = function(link) {
			var editor = editors[link];

			if(editor.is('.is-hidden')) {
				editor.removeClass('is-hidden');
				editor.removeClass('is-canceled');
				setScrollHeight(link);
			}
			else {
				Symphony.Elements.contents.append(editor);
			}
			
			// Remove existing undo options
			Symphony.Elements.header.find('.notifier .undo').trigger('detach.notify');
		};

		var prepareUndo = function(link) {
			var id = new Date().getTime(),
				editor = editors[link],
				title = editor.data('title');

			// Offer undo option after removing a field
			Symphony.Elements.header.find('div.notifier').trigger(
				'attach.notify', 
				[Symphony.Language.get('You just closed the editor for “{$title}”.', {title: title}) + '<a id="' + id + '">' + Symphony.Language.get('Restore?') + '</a>', 'protected undo']
			);

			// Prepare field recovery
			$('#' + id).on('click.aui-editor', function() {
				showEditor(link);
				$(this).parent().trigger('detach.notify');
			});
		};

		var setScrollHeight = function(link) {
			var editor = editors[link],
				height = editor.data('height');

			Symphony.Elements.contents.css({
				minHeight: height,
				maxHeight: height,
				overflow: 'hidden'
			});
		};

		var resetScrollHeight = function() {
			Symphony.Elements.contents.removeAttr('style');
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
