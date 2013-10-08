/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  
  
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};


/**
 * Add Array.prototype.indexOf
 * Fix for IE8
 */
 
if (!Array.prototype.indexOf) 
{
	Array.prototype.indexOf = function(obj, start) {
		 for (var i = (start || 0), j = this.length; i < j; i++) {
			 if (this[i] === obj) { return i; }
		 }
		 return -1;
	}
}

/**
 * The menu that slides in from the right edge of the screen
 * when you hover over the tab that protrudes from the black border.
 * @constructor
 */
 
function baileysMenuClass()
{
	var menuOpen = false,
		
		$tabs      = $('#tabs'),
		$tabsNav   = $('.tab-anchor'),
		$panels    = $('.tab-panel'),
		$container = $('.container'),

		//Mouse menu scroll variables
		//------------------------------------------------------------------
		$gal       = $("#nav-clip"),
		galW       = $gal.outerHeight(true),
		galSW      = $gal[0].scrollHeight,
		wDiff      = (galSW/galW)-1,  
		mPadd      = 60,  			          // Mousemove Padding
		damp       = 20,  			          // Mousemove response softness
		mX         = 0,   			          // Real mouse position
		mX2        = 0,   			          // Modified mouse position
		posX       = 0,
		mmAA       = galW-(mPadd*2),          // The mousemove available area
		mmAAr      = (galW/mmAA),    
		menuClock,

		$mms,		//Mouse Move Scroller (MMS)
		 mmsH,		//MMS Height
		 mmsSH,		//MMS Scroll Height
		 mmsHDiff,	//MMS Height Difference
		 mmsMPadd,	//MMS Mouse Padding
		 mmsDamp,	//MMS Dampening (response softness)
		 mmsMPos,	//MMS Mouse Position
		 mmsMMPos,	//MMS Modified Mouse Position
		 mmsYPos,	//MMS Y Position
		 mmsAA,		//MMS Available Area
		 mmsAAR,	//MMS Available Area Ratio
		 mmsTimer,	//MMS Menu Timer

		openDistance = 450;
		
		
		$mms		= $("#nav-clip");
		 mmsH		= $mms.outerHeight(true);
		 mmsSH		= $mms.scrollHeight;
		 mmsHDiff	= (mmsSH/mmsH)-1;
		 mmsMPadd	= 60;
		 mmsDamp	= 20;
		 mmsMPos	= 0;
		 mmsMMPos	= 0;
		 mmsYPos	= 0;
		 mmsAA		= mmsH-(mmsMPadd*2);
		 mmsAAR		= (mmsH/mmsAA);
		 
		
/*
mms = mouse move scroll
$gal   = $mms
galW   = mmsH
galSW  = mmsSH
wDiff  = mmsHDiff
mPadd  = mmsMPadd
damp   = mmsDamp
mX     = mmsMPos
mX2    = mmsMMPos
mmAA   = mmsAA
mmAAr  = mmsAAR
menuClock = mmsTimer

*/


	/**
	 * Adjust items based on the window size.
	 */
	function _windowResize() 
	{
		$tabs.css('height', $(window).height());
		
		var winHeight = $(window).height(),
			y1 = $('#tab-1 h1').height(),
			y2 = winHeight - $('ul.social').offset().top;
			diff = winHeight - (y1+y2),
			$menuClip = $('#nav-clip'),
			menuClipHeight = $('#nav-clip').height();
			
			$menuClip.height(diff-70);
			
			/*
			if(menuClipHeight > diff) 
			{
				$menuClip.css('overflow-y','scroll');
			}
			else
			{
				$menuClip.css('overflow-y','auto');
			}
			*/
			
			galW   = $gal.outerHeight(true);
			galSW  = $gal[0].scrollHeight;
			wDiff  = (galSW/galW)-1;
			
			if(galW == galSW) 
			{
				clearInterval(menuClock);
			}
			else
			{
				_startMenuClock();
			}

	}

	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		//Swap the menu tabs back and forth or close the menu
		$tabsNav.on('click', function(e) 
		{
			var $this = $(this);
			
			if($this.hasClass('selected'))
			{
				closeMenu();
			}
			else
			{
				var tab = $this.attr('href');
				
				$tabsNav.removeClass('selected');
				$this.addClass('selected');
				
				$panels.hide();
				$(tab).fadeIn('slow');
				openMenu();
			}
			
			e.preventDefault();
		});
		
		//Close the menu when clicking anywhere on the container
		$container.on('click', function(e) 
		{
			if (menuOpen) 
			{
				closeMenu();
			}
		});
		
		$(window).resize(_windowResize);
	}
	
	/**
	 * Allow the menu to be scrolled based on the mouse position.
	 */
	function _addMouseScroll()
	{
		$gal.mousemove(function(e) 
		{
			if(galW < galSW) 
			{
				mX = e.pageY - $(this).parent().offset().top - this.offsetTop;
				mX2 = Math.min( Math.max(0, mX-mPadd), mmAA ) * mmAAr;
			}
		});
		
	}
	
	/**
	 * The interval timer function for the mouse menu scroller.
	 * polls every 20 milliseconds. You can adjust higher or lower.
	 */
	function _startMenuClock()
	{
		window.clearInterval(menuClock);
		menuClock = setInterval(function()
		{
			posX += (mX2 - posX) / damp; 
			$gal.scrollTop(posX*wDiff);
			//console.log('running..');
		}, 20);
	}
	
	/**
	 * Opens the menu.
	 */
	function openMenu()
	{
		$tabs.animate({right: 0}, 300, 'easeInOutCubic');
		moveContainer('left');
		
		if(galW < galSW)
			_startMenuClock();

		menuOpen = true;
	}
	
	/**
	 * Closes the menu.
	 */
	function closeMenu()
	{
		$tabs.animate({right: -1*openDistance}, 300, 'easeInOutCubic');
		moveContainer('right');
		$tabsNav.removeClass('selected');
		
		clearInterval(menuClock);

		menuOpen = false;
	}

	/**
	 * Moves the page content over when the menu opens.
	 */
	function moveContainer(direction) 
	{
		var left = -1 * openDistance,
			right = 450;

		//Assume opening left, otherwise right
		if(direction=='right') 
		{
			left = 0;
			right = 0;
		}

		$container.animate({left: left, right: right }, 300, 'easeInOutCubic');
	}
	
	/**
	 * Initialize.
	 */
	this.init = function()
	{
		$panels.hide();
		$($panels[0]).show();
		_bindEvents();
		_windowResize();
		
		if(!Modernizr.touch)
			_addMouseScroll();
	}
}

/**
 * The near fullscreen size content slider.
 * Might be pushed over by the baileysMenu.
 * @constructor
 */
function baileysSliderClass()
{
	var currentSlide = 0,
		newSlide = 1,
		browserWidth = $(window).innerWidth(),
		
		$border = $('.border'),
		$container = $('.container'),
		$slides = $('.slide'),
		$counter = $('.counter'),
		$counterLis = $('.counter li'),
		$counterLinks = $('.counter a'),
		counterWidth = $counterLis.outerWidth(true) * $counterLis.length;

	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		$counterLinks.click(function() 
		{
			newSlide = parseInt($(this).prop('rel'));
			slide('right');
		});
		
		$container.swipe( 
		{
			swipeLeft:function(event, direction) 
			{
				newSlide = currentSlide < ($counterLis.length - 1) ? (currentSlide + 1) : 0;
				slide('right');
			},
			swipeRight:function(event, direction) 
			{
				newSlide = currentSlide > 0 ? (currentSlide - 1) : ($counterLis.length - 1);
				slide('left');		
			},
			threshold:30, allowPageScroll: 'none'
		});

	}
	
	/**
	 * Slide the content left or right.
	 */
	function slide(direction) 
	{
		var currentSlideLeft = browserWidth,
			newSlideLeft = 0;
		
		if (direction == 'right') 
		{
			currentSlideLeft = (-1 * browserWidth);
			newSlideLeft = (browserWidth);
		}
		else 
		{
			newSlideLeft = (-1 * browserWidth);
		}

		$slides.eq(currentSlide)
			.removeClass('current')
			.animate({left: currentSlideLeft}, 400, 'easeInOutCubic');
		
		$slides.eq(newSlide)
			.addClass('current')
			.css({left: newSlideLeft, display : 'block'})
			.animate({left: 0}, 400, 'easeInOutCubic', function()
				{
					//Mark the appropriate nav link as active
					$counterLinks.removeClass('active');
					$counterLinks.eq(newSlide).addClass('active');
					currentSlide = newSlide;
				});	
	}

	/**
	 * Sizes the slides and content div appropriately.
	 */
	function _windowResize() 
	{
		$container.height($border.height());
		$slides.height($container.height());
		browserWidth = $(window).innerWidth();
		$slides.filter(':not(.current)').css({left:-1*browserWidth});
	}

	/**
	 * Initialize.
	 */
	this.init = function()
	{
		_bindEvents();
		$slides.eq(currentSlide).show().addClass('current');
		$counter.width(counterWidth).height(10);
		_windowResize();
		$(window).resize(_windowResize);
	}
}

/**
 * The Baileys intro.
 * @constructor
 */
function baileysIntroClass()
{
	var $introLogo = $('.intro-logo'),
		$brand     = $('#brand'),
		$tabs      = $('#tabs'),
		$overlay   = $('#overlay'),
		$counter   = $('.counter'),
		$tabLabels = $('.tab-anchor span'),
		
		isHomePage = ([ '/', '/index.html', '/index.htm', '/default.asp', '/default.aspx' ].indexOf( location.pathname ) > -1) ? true : false;


	/**
	 * Starts the animations for a first-time visitor to any sub page.
	 */
	//function _startSubpageIntro()
	this.startSubpageIntro = function()
	{
		_startSubpage();
		
		setTimeout(function()
		{
			$tabLabels.show();
			$tabLabels.animate({left: '-110px'}, 300, function()
			{
				setTimeout(function()
				{
					$tabLabels.animate({left: 0}, 300, function()
					{
						$tabLabels.hide();
					});
				}, 3000);
			});
		}, 1000);
	}

	/**

	 * Starts the animations for a first-time visitor to the home page.
	 */
	//function _startHomepageIntro()
	this.startHomepageIntro = function()
	{
		setTimeout(function()
		{
			$introLogo.fadeIn('fast', function()
			{
				setTimeout(function()
				{
					$introLogo.fadeOut('fast', function()
					{
						$brand.animate({top: 0}, 700, function()
						{
							$tabs.animate({right: -450}, 700, function()
							{
								$overlay.fadeOut('slow');
								$counter.fadeIn('slow');
								$tabLabels.show();
								$tabLabels.animate({left: '-110px'}, 300, function()
								{
									setTimeout(function()
									{
										$tabLabels.animate({left: 0}, 300, function()
										{
											$tabLabels.hide();
										});
									}, 3000);
								});
							});
						});
					});
				}, 3000);
			});
		}, 2000);
	}
	
	/**
	 * Skips the animations and sets the screen items in their starting place on any subpage.
	 */
	function _startSubpage()
	{
		var $brand     = $('#brand'),
			$tabs      = $('#tabs'),
			$overlay   = $('#overlay'),
			$counter   = $('.counter');
			//$tabLabels = $('.tab-anchor span');
	
		$brand.css('top', 0);
		$tabs.css('right', -450);
		//$tabLabels.hide();
		$overlay.hide();
		$counter.show();
	}
	
	/**
	 * It all starts here!
	 */
	this.init = function()
	{
		/*
		if(!docCookies.getItem('baileysFirstVisit') && isHomePage)
		{
			docCookies.setItem("baileysFirstVisit", "true", Infinity);
			_startHomepageIntro();
		}
		else if(!docCookies.getItem('baileysFirstVisit') && !isHomePage)
		{
			docCookies.setItem("baileysFirstVisit", "true", Infinity);
			_startSubpageIntro();
		}
		else 
		{
			_startSubpage();
		}
		*/
		/*
		if(!docCookies.getItem('baileysFirstVisit'))
		{
			docCookies.setItem("baileysFirstVisit", "true", Infinity);
			_startHomepageIntro();
		}
		else 
		{
			console.log('starting subpage...');
			_startSubpage();
		}
		*/
	}
}


