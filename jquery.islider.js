(function($) {

	"use strict";

	var $slider;
	var slidesCount = 0;
	var $active = null;
	var $controls = $('.slider .slider-ctrl');
	var interval = null;
	var intervalIdx = 0;
	var animations = {
		fin: ['fadeIn', 'fadeInUp', 'fadeInLeft', 'fadeInRight', 'fadeInBottom'],
		fout: ['fadeOut', 'fadeOutUp', 'fadeOutLeft', 'fadeOutRight', 'fadeOutBottom']
	}
	var config = {
		auto: true,
		interval: 10000,
		distance: 250,
		useAnimateCss: true,
		buttonsHtml: '',
		onChange: function(index) {}
	}
	var errPrefix = 'iSlider Error: ';

	var assertAnimateCss = function() {
		var links = document.querySelectorAll('link[rel=stylesheet]');
		links = Array.prototype.filter.call(links, function(link) {
			return link.href.indexOf('animate') >= 0;
		})
		if (false /*!links.length */) {
			throw 'iSlider Error: Please include animate.css file: "https://daneden.github.io/animate.css/"';
		}
	}

	var insertCustomCss = function() {
		var style = "html, body { overflow-x: hidden; } .slide-item { transition: opacity 0.5s ease; }";
		var tag = document.createElement('style');
		tag.innerText = style;
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(tag);
	}

	var iSlider = function(cfg) {
		insertCustomCss();
		$slider = $(this);
		slidesCount = $slider.children().length;
		for (var key in cfg) {
			if (config.hasOwnProperty(key))
				config[key] = cfg[key];
			else
				console.warn(errPrefix + 'Invalid config option "'+ key +'"');
		}
		void(config.useAnimateCss && assertAnimateCss());
		init();
		return $slider;
	}

	var iSliderNext = function() {
		var next = $active.index() + 1;
		if (next > slidesCount - 1) {
			next = 0;
		}
		setActive(next);
	}

	var iSliderPrev = function() {
		var prev = $active.index() - 1;
		if (prev < 0) {
			prev = slidesCount - 1;
		}
		setActive(prev);
	}

	var saveState = function(instance) {
		instance.iSlider = {};
		instance.iSlider.next = iSliderNext.bind(instance);
		instance.iSlider.prev = iSliderPrev.bind(instance);
		instance.iSlider.setActive = setActive.bind(instance);
		return instance;
	}

	var createButtons = function() {
		var $parent = $slider.parent();
		var $buttons = $('<div class="iSlider-btns" />');
		var $list = $('<ul>');
		var count = $slider.find('.slide').length;

		for (var i = 0; i < count; i++) {
			var html = '<li><button class="iSlider-btn" data-idx="'+ i +'">';
			html += config.buttonsHtml;
			html += '</button></li>';

			var prev = $list.html();
			$list.html(prev + html);
		}

		$buttons.append($list);
		$parent.append($buttons);

		$('.iSlider-btns .iSlider-btn').on('click', function(e) {
			restartInterval();
			setActive(parseInt($(this).data('idx')));
		});
	}

	var init = function() {
		$slider.find('.slide').hide(0);
		$slider.find('.slide').each(function() {
			var items = $(this).find('.slide-item').css({opacity: '0'});
			$(this).hide(0);
		});
		setActive(0);

		createButtons();

		if (config.auto)
			createInterval();
	}

	var createInterval = function() {
		interval = setInterval(function() {
			if (intervalIdx < slidesCount - 1)
				intervalIdx++
			else
				intervalIdx = 0;
			setActive(intervalIdx);
		}, config.interval);
	}

	var restartInterval = function() {
		clearInterval(interval);
		createInterval();
	}

	var setActive = function(idx) {
		var $indicator = $controls.find('li:eq('+idx+')').find('button');
		$controls.find('.active').removeClass('active');
		$indicator.addClass('active');
		setButtonActive(idx);
		setElementActive($($slider.children().get(idx)));

		config.onChange(idx);
	}

	var setButtonActive = function(idx) {
		var $container = $('.iSlider-btns');
		$container.find('.iSlider-btn-active').removeClass('iSlider-btn-active');
		$container.find('ul li').eq(idx).find('button').addClass('iSlider-btn-active');
	}

	var setElementActive = function($el) {
		if ($active) {
			hideSlide($active, $el);
		}
		else {
			setTimeout(function() {
				setNextSlide($el);
			}, 1)
		}
	}

	var hideSlide = function($slide, $next) {
		var items = $slide.find('.slide-item');
		items.each(function(i, it) {
			it.className = it.className.replace(/animated [a-zA-Z]+/, '');
			setTimeout(function() {
				var anim = Math.floor(Math.random() * animations.fout.length);
				anim = animations.fout[anim];
				$(it).addClass('animated '+ anim);
				setTimeout(function() {
					it.style.opacity = '0';
					if (i == items.length - 1) {
						setTimeout(function() {
							$slide.hide(0);
							if ($next) {
								setNextSlide($next);
							}
						}, 250);
					}
				}, 1000);
			}, i * config.distance);
		})
	}

	var setNextSlide = function($slide) {
		$active = $slide;
		void($slide && showSlide($slide));
	}

	var showSlide = function($slide) {
		var items = $slide.find('.slide-item');
		$slide.show();
		items.each(function(i, it) {
			it.className = it.className.replace(/animated [a-zA-Z]+/, '');
			setTimeout(function() {
				var anim = Math.floor(Math.random() * animations.fin.length);
				anim = animations.fin[anim];
				$(it).addClass('animated '+ anim);
				setTimeout(function() {
					it.style.opacity = '1';
				}, 1000);
			}, i * 250);
		});
	}

	$.fn.iSlider = function(cfg) {
		return saveState(iSlider.bind(this)(cfg || {}));
	}

}(jQuery));