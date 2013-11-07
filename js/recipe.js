/**
 * Binds events to the Recipe Gallery controls.
 * Flavor checkboxes, Sort selector
 * @constructor
 */
 
function baileysRecipeClass()
{
	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		$('.social-share-button').modal({closeButton: '.close-box'});

		$('#recipe-tabs').each(function()
		{
			// For each set of tabs, we want to keep track of
			// which tab is active and it's associated content
			var $active, $activeLi, $content, $links = $(this).find('.tab a');
			
			// If the location.hash matches one of the links, use that as the active tab.
			// If no match is found, use the first link as the initial active tab.
			$active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
			$activeLi = $active.parent('li');
			$activeLi.addClass('active');
			$content = $($active.attr('href'));
			$content.show();
			
			// Hide the remaining content
			$links.not($active).each(function () 
			{
				$($(this).attr('href')).hide();
			});
			
			// Bind the click event handler
			$(this).on('click', 'a', function(e)
			{
				if ($(this).parent('li').hasClass('recipe-home'))
					return;
					
				// Make the old tab inactive.
				$activeLi.removeClass('active');
				$content.hide();
				
				// Update the variables with the new link and content
				$active = $(this);
				$activeLi = $(this).parent('li');
				$content = $($(this).attr('href'));
				
				// Make the tab active.
				$activeLi.addClass('active');
				$content.show();
				
				// Prevent the anchor's default click action
				e.preventDefault();
			});
		});
	}
	
	
	/**
	 * Initialize.
	 */
	this.init = function()
	{
		_bindEvents();
	}
}
