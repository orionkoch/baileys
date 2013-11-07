/**
 * Binds events to the Product Locator controls.
 * Flavor, Size, Zip, Distance
 * @constructor
 */
 
function baileysMapUIClass()
{
	var $mapUi        = $('.map-ui'),
		$mapUiSelect  = $mapUi.find('.selector select'),
		$mapUiRadio   = $mapUi.find('.radio input');
		

	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		$mapUiSelect.change( function(e) 
		{
			var $this = $(this);
			$this.parent('.selector').children('span').text($this.val());
		});

		$mapUiRadio.on('change', function(e) 
		{
			var $this = $(this),
				name = $this.attr('name'),
				group = null;

			group = $('input[name="'+name+'"]');
			group.each(function()
			{
				$(this).parent('span')
				  .removeClass('checked');
			});
			
			$this.parent('span').addClass('checked');
		});
		
		$mapUi
		  .mouseenter(function(){
			$mapUi.animate({bottom: 60}, 200);
		  })
		  .mouseleave(function(){
		    $mapUi.animate({bottom: 55}, 200);
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
