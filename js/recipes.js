/**
 * Binds events to the Recipe Gallery controls.
 * Flavor checkboxes, Sort selector
 * @constructor
 */
 
function baileysRecipesClass()
{
		var $galUi        = $('.gallery-controls'),
			$galUiCheck   = $galUi.find('.checkbox input'),
			$galUiSelect  = $galUi.find('.selector select');


	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		$galUiCheck.on('change', function(e) 
		{
			var $this = $(this);

			if(this.checked)
				$this.parent('span').addClass('checked');
			else
				$this.parent('span').removeClass('checked');
		});

		$galUiSelect.change( function(e) 
		{
			var $this = $(this);
			$this.parent('.selector').children('span').text($this.val());
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
