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
	 * Finds all links with .external-link class and displays
	 */
	function _blockExternalLinks()
	{
		$('.external-link').click(function(event) 
		{
			event.preventDefault();
			$('#leaving-site').find('.continue-link').attr('href',this.href);
			jQ_modalOverlay.triggerHandler('modalDeativate');
			jQ_modalOverlay.triggerHandler('modalActivate','#external-link-warning');
		});
	}

/**
 * jQuery Modal Plugn
 * A simple plugin to produce lightweight modals.
 * @constructor
 */
(function ($) {
    $.fn.extend({
        modal: function (options) 
		{
            var defaults = {
					overlay: 0.8,
					closeButton: null
				};
			
            if(!$('#modal-overlay').length)
			{
				$("body").append($("<div id='modal-overlay'></div>"));
				
				$("body").append($('<div id="leaving-site" class="leaving-site modal-box" role="dialog" aria-describedby="leaving-site" style="display:none">'+
                               '  <h2>Thank you for visiting our web site</h2>'+
                               '  <h3>You are now leaving baileyscreamers.com</h3>'+
                               '  <p>This link will take you to a web site not owned or operated by HP Hood LLC, and our '+
                               '    Terms of Use and Privacy Policy will not apply for use of that web site. HP Hood LLC '+
                               '    is not responsible for the content, operation, potential collection and use of data for'+ 
                               '    web sites not owned or operated by or on behalf of our company. HP Hood LLC encourages '+
                               '    you to read both the Terms of Use and Privacy Policy of this site and every web site you visit.</p>'+
                               '  <a class="close-link" href="#">return to baileyscreamers.com</a>'+
                               '  <a class="continue-link" href="#">Continue</a>'+
                               '</div>'));
			}
							   
            options = $.extend(defaults, options);
			
            return this.each(function () 
			{
                var o = options;
                $(this).click(function (e) 
				{
                    var margin_left  ,
                    	margin_top   ,
						$modal       ,
						$overlay     = $("#modal-overlay");

                    e.preventDefault();

                    $overlay
					  .css({
                        "display": "block",
                        opacity: 0
                      })
					  .fadeTo(200, o.overlay);

										
					if($(this).hasClass('external-link')) {
						$modal = $('#leaving-site');
						$modal.find('.close-link').click(function(){
							close_modal($modal);
						});
						$modal.find('.continue-link').attr('href',this.href);
					}
					else {
						$modal = $($(this).attr('href'));
					}
					
                   	margin_left = -($modal.outerWidth() / 2) + 'px';
                    margin_top  = -($modal.outerHeight()/ 2) + 'px';

                    $overlay.click(function () {
                        close_modal($modal)
                    });

                    $(o.closeButton).click(function () {
                        close_modal($modal);
                    });
					
                    $modal
					  .css({
                        "display": "block",
                        "position": "absolute",
                        "opacity": 0,
                        "z-index": 9999,
                        "left": "50%",
                        "margin-left": margin_left,
						"margin-top": margin_top,
                        "top": "50%"
                      })
					  .fadeTo(200, 1);
					  
                })
            });

            function close_modal($modal) 
			{
                $("#modal-overlay").fadeOut(200);
                $modal.css({
                    "display": "none"
                });
            }
        }
    })
})(jQuery);


/**
 * Some lean modal functionality.
 * @constructor
 */
function baileysModalClass()
{
	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
	}

	/**
	 * Initialize.
	 */
	this.init = function()
	{
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
	    menuTimer = null,
		
		$tabs      = $('#tabs'),
		$tabsnav   = $('.tab-anchor'),
		$panels    = $('.tab-panel'),
		$container = $('.container'),
		$leftRightNav = $('.nav-left, .nav-right'),

		$gal       = $("#nav-clip"),
		galW       = $gal.outerHeight(true),
		galSW      = $gal[0].scrollHeight,
		wDiff      = (galSW/galW)-1,  
		mPadd      = 60,  			 // Mousemove Padding
		damp       = 10,  			 // Mousemove response softness
		mX         = 0,   			 // Real mouse position
		mX2        = 0,   			 // Modified mouse position
		posX       = 0,
		mmAA       = galW-(mPadd*2), // The mousemove available area
		mmAAr      = (galW/mmAA),    

		menuClock  ,
		
		openDistance = 450;

	/**
	 * Adjust items based on the window size.
	 */
	function _windowResize() 
	{
		$tabs.css('height', $(window).height());
		
		var winHeight = $(window).height(),
			y1 = $('#tab-1 h1').height(),
			y2 = winHeight - $('ul.menu_two').offset().top;
			diff = winHeight - (y1+y2),
			$menuClip = $('#nav-clip'),
			menuClipHeight = $('#nav-clip').height();
			
			$menuClip.height(diff-80);
			
			galW   = $gal.outerHeight(true);
			galSW  = $gal[0].scrollHeight;
			wDiff  = (galSW/galW)-1;
			
			if(galW == galSW) {
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
		$tabsnav.on('click', function(e) 
		{
			var $this = $(this);
			
			if($this.hasClass('selected'))
			{
				closeMenu();
			}
			else
			{
				var tab = $this.attr('href');
				
				$tabsnav.removeClass('selected');
				$this.addClass('selected');
				
				$panels.hide();
				$(tab).fadeIn('slow');
				openMenu();
			}
			
			e.preventDefault();
		});
	
		$container.on('click', function(e) 
		{
			if (menuOpen) 
			{
				closeMenu();
			}
		});
		
		$('.txt-site-search')
		  .focus(function(){
		    this.placeholder = '';
		  })
		  .blur(function(){
		    this.placeholder = 'type search here';
		  });
		
		$(window).resize(_windowResize);
	}
	
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
	
	function openMenu()
	{
		$tabs.animate({right: 0}, 300, 'easeInOutCirc');
		moveContainer('left');
		$leftRightNav.fadeOut('fast');
		
		if(galW < galSW)
			_startMenuClock();

		menuOpen = true;
	}
	
	function closeMenu()
	{
		$tabs.animate({right: -1*openDistance}, 300, 'easeInOutCirc');
		moveContainer('right');
		$tabsnav.removeClass('selected');
		$leftRightNav.fadeIn('fast');
		
		clearInterval(menuClock);

		menuOpen = false;
	}
	
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

		$container.animate({left: left, right: right }, 300, 'easeInOutCirc');
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
		$nav = null,
		$navLis = null,
		$navLinks = null,
		navWidth = 0,
		slideCount = 0;


	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _buildNav() 
	{
		var navLinks = '',
			first = 'active',
			slides = $('.slide');
		
		slides.each(function( index ) 
		{
			navLinks += '<li><a href="#" class="'+first+'"></a></li>';
			first = '';
		});

		$nav = $('<ul class="counter"></ul>').append(navLinks);
		$container.after($nav);

		$navLis = $('.counter li');
		$navLinks = $('.counter a');
		navWidth = $navLis.outerWidth(true) * $navLis.length;
		slideCount = $navLis.length-1;
	}

	/**
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		$navLinks.click(function() 
		{
			newSlide = $(this).parent('li').index();
			slide('right');
		});
		
		$container.swipe( 
		{
			swipeLeft:function(event, direction) 
			{
				slide('right');
			},
			swipeRight:function(event, direction) 
			{
				slide('left');		
			},
			threshold:30, allowPageScroll: 'none'
		});
		
		$('.nav-left').click(function()
		{
			slide('left');
		});
		
		$('.nav-right').click(function()
		{
			slide('right');
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
			newSlide = currentSlide > 0 ? (currentSlide - 1) : slideCount;
			currentSlideLeft = (-1 * browserWidth);
			newSlideLeft = (browserWidth);
		}
		else 
		{
			newSlide = (currentSlide < slideCount) ? (currentSlide + 1) : 0;
			newSlideLeft = (-1 * browserWidth);
		}

		$slides.eq(currentSlide)
			.removeClass('current')
			.animate({left: currentSlideLeft}, 400, 'easeInOutCirc');
		
		$slides.eq(newSlide)
			.addClass('current')
			.css({left: newSlideLeft, display : 'block'})
			.animate({left: 0}, 400, 'easeInOutCirc', function()
				{
					//Mark the appropriate nav link as active
					$navLinks.removeClass('active');
					$navLinks.eq(newSlide).addClass('active');
					currentSlide = newSlide;
				});	

		_playSlideAnimation(newSlide);
		
	}

	/**
	 * Play whatever animations are needed when a new slide is displayed
	 */
	function _playSlideAnimation(index)
	{
		var animFuncName = $slides.eq(index).data('animation-function'),
			animFunc     = objPromos[animFuncName];
			
		if(typeof(animFunc) === "function") 
		{
			animFunc.call();
		}
		
	}


	/**
	 * Play whatever animations are needed when a new slide is displayed
	 */
	//this._setSlide = function(index)
	function _setSlide(index)
	{
		var hideLeft;
		
		index = ((index < 0) ? 0 : ((index > slideCount) ? slideCount : index));
		hideLeft = (-1 * browserWidth);
			
		$slides
			.css({left: hideLeft})
			.removeClass('current')
			.eq(index)
				.addClass('current')
				.css({left: 0, display : 'block'})
		
		$navLinks.removeClass('active');
		$navLinks.eq(index).addClass('active');
		currentSlide = index;
	}
	

	/**
	 * Sizes the slides and content div appropriately.
	 */
	function smartHeight() 
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
		var slide = 0;
		
		_buildNav();
		_bindEvents();
		//$slides.eq(currentSlide).show().addClass('current');
		if(!docCookies.getItem('baileysLastSlide')) {
			docCookies.setItem("baileysLastSlide", 0, Infinity);
		}
		else {
			slide = parseInt(docCookies.getItem('baileysLastSlide')) + 1;
			slide = ((slide < 0) ? 0 : ((slide > slideCount) ? 0 : slide));
			docCookies.setItem("baileysLastSlide", slide, Infinity);
		}
		
		_setSlide(slide);
		$nav
		  .width(navWidth)
		  .height(10);
		smartHeight();
		$(window).resize(smartHeight);
		_playSlideAnimation(currentSlide);
	}
}

/**
 * Promo slide animation functions
 * @constructor
 */
 
function baileysPromoAnimationsClass()
{
	var promo1Played = false,
		promo2Played = false;
		
	this.animatePromo1 = function() 
	{
		var $promo1h1      = $('.promo1-h1'),
			$links         = $('.promo1-link'),
			$link1         = $links.eq(0),
			$link2         = $links.eq(1),
			$link3         = $links.eq(2),
			$promo1bottles = $('.promo1-bottles');

		$promo1h1.fitText(2.15, {minFontSize: '20px', maxFontSize: '49px'});

		function play()
		{
			//console.log('playing promo 1 animations...');
			$promo1h1.fadeIn(300, function()
			{
				$link1.fadeIn(300, function()
				{
					$link1.css('display', 'block');
					$link2.fadeIn(300, function()
					{
						$link2.css('display', 'block');
						$link3.fadeIn(300, function()
						{
							$link3.css('display', 'block');
							$promo1bottles
							  .fadeIn(300)
							  .css('display', 'block');
							promo1Played = true;
						});
					});
				});
			});
		}
		
		if(!promo1Played)
			setTimeout(play, 1000);
	}
	
	this.animatePromo2 = function() 
	{
		var $promo2h1      = $('.promo2-h1'),
			$promo2h2      = $('.promo2-h2'),
			$promo2meet    = $('.promo2-meet'),
			$promo2bottles = $('.promo2-bottle');
			$bottle1       = $promo2bottles.eq(0),
			$bottle2       = $promo2bottles.eq(1),
			$bottle3       = $promo2bottles.eq(2);
		
		if(promo2Played) return;
		
		function play()
		{
			//console.log('playing promo 2 animations...');
			$promo2h1.fadeIn(200, function()
			{
				$promo2h2.fadeIn(200, function()
				{
					$promo2meet.fadeIn(200, function()
					{
						$bottle1.animate({opacity: 1}, 200, function() 
						{
							$bottle2.animate({opacity: 1}, 200, function() 
							{
								$bottle3.animate({opacity: 1}, 200, function()
								{
									$('.promo2-bottles-label').fadeIn(200);
									promo2Played = true;
								});
							});
						});
					});
				});
			});
		}
	
		if(!promo2Played)
			setTimeout(play, 1000);
	}

}

/**
 * The Baileys intro.
 * @constructor
 */
function baileysSubpageClass()
{
	var $content = $('.content');
	
	/*
	 * Binds click and hover events to DOM elements.
	 */
	function _bindEvents()
	{
		//If there are any common subpage events, 
		//bind them here.
	}

	this.addScrollBars = function()
	{
		$(window).resize(contentScrollbars);
	}
	/*
	 * Adds vertical scroll bars to the content area
	 * when the content is too tall for the container.
	 */
	function contentScrollbars()
	{
		var contH   = $content.outerHeight(true),
			contSH  = $content[0].scrollHeight;

		if(contSH > contH)
			$content.css('overflow-y','scroll');
		else
			$content.css('overflow-y','auto');
	}

	/**
	 * Fades DOM elements in according to the order
	 * specified by the data-fadein-order attribute.
	 */
	function _fadeInElements()
	{
		var $els = $('.fadeIn'),
			$elsArr = $els.toArray(),
			index = 0,
			timer,
			limit;

		$elsArr.sort(function(a, b){
			// convert to integers from strings
			a = $(a).data("fadein-order");
			b = $(b).data("fadein-order");
			
			// compare
			if(a > b) {
				return 1;
			} else if(a < b) {
				return -1;
			} else {
				return 0;
			}
		});

		$elsArr.unshift($('.heading')[0]);
		limit = $elsArr.length-1;
			
		timer =	setInterval(function() 
		{
			$($elsArr[index]).animate({opacity:'1'}, 200);
			if(index==limit) {
				clearTimeout(timer);
			}

			index++;
		},
		200);
	}

	/**
	 * Initialize.
	 */
	this.init = function()
	{
		_bindEvents();
		_fadeInElements();
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
		$nav       = $('.nav-left, .nav-right'),
		
		isHomePage = ([ '/', '/index.html', '/index.htm', '/default.asp', '/default.aspx', '/baileys/' ].indexOf( location.pathname ) > -1) ? true : false;


	/**
	 * Starts the animations for a first-time visitor to any sub page.
	 */
	function _startSubpageIntro()
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
	function _startHomepageIntro()
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
										$nav.animate({opacity: 1}, 200);
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
			$counter   = $('.counter'),
			$nav       = $('.nav-left, .nav-right');
	
		$brand.css('top', -10);
		$tabs.css('right', -450);
		$overlay.hide();
		$counter.show();
		//$nav.animate({opacity: 1}, 200);
		$nav.fadeIn(200);
	}

	
	/**
	 * It all starts here!
	 */
	this.init = function()
	{
		
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

		$('#brand')
		  .mouseenter(function(){
			$(this).animate({top: '-5px'}, 200);
		  })
		  .mouseleave(function(){
		    $(this).animate({top: '-10px'}, 200);
		  });
		  
		$('.external-link').modal();
	}
}


