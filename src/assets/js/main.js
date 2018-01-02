// Variable to store the languages
var languages = {};
var jsClasses = {
	content: 'js-content',
	menuItem: 'js-menu-item',
	flagItem: 'js-flag-item'
}
var site = {
	startSpinner: function () {},
	stopSpinner: function () {},
	controlHistory: function(){
		console.log(history);
	},
	_writePage: function (pageId, content) {
		var page = document.getElementById(pageId);
		var pageTitle = page.querySelector('h1');
		var pageContent = page.querySelector("." + jsClasses.content);
		var innerContent = "";
		pageTitle.innerHTML = content.pages[pageId].title;

		for (var i = 0; i < content.pages[pageId].body.length; i++) {
			innerContent += concatHtml(content.pages[pageId].body[i]);
		}

		pageContent.innerHTML = innerContent;
		var children = $('#' + pageId + ' .'+jsClasses.content).children();
		for (var i = 0; i < children.length; i++) {
			var tag = children[i].tagName.toLowerCase();
			var item = i + 1;
			anime.timeline({
					loop: false
				})
				.add({
					targets: '#' + pageId + ' .'+jsClasses.content+' ' + tag + ':nth-child(' + item + ') .letter',
					opacity: [0, 1],
					easing: "easeInOutQuad",
					duration: 700,
					delay: function (el, i) {
						return 8 * (i + 1)
					}
				})
		}

	},
	writeContent: function (obj, lang) {
		var content = obj[lang].content;
		var divs = document.querySelectorAll("." + jsClasses.menuItem);
		// Menu items
		for (var i = 0; i < divs.length; i++) {
			divs[i].querySelector('div').innerHTML = content.menu[i].name;
		}
		//figure
		var figCaption = projects.querySelector('#figCaption');
		figCaption.innerHTML = content.pages.projects.img.alt;
    // About page
		this._writePage('intro', content);
		// About page
		this._writePage('about', content);
		// Projects page
		this._writePage('projects', content);
		// Contact page
		this._writePage('contact', content);
	}
}

function concatHtml(obj) {
	var string = "";
	if (typeof obj.content === "string") {
		var str = obj.content;
		var c = "";
		var isTag = false;
		for (var i = 0, len = str.length; i < len; i++) {
			if (str.charAt(i) == "<") {
				isTag = true;
			}
			if (!isTag) {
				c += "<span class='letter'>" + (str.charAt(i)) + "</span>";
				//c +=str.charAt(i);
			} else {
				c += str.charAt(i);
			}
			if (str.charAt(i) == ">") {
				isTag = false;
			}
		}
		string = "<" + obj.tag + ">" + c + "</" + obj.tag + ">";
	} else {
		string = "<" + obj.tag + ">";
		for (var i = 0; i < obj.content.length; i++) {
			string += concatHtml(obj.content[i]);
		}
		string += "</" + obj.tag + ">";
	}
	return string;
}
// Things that need to wait jquery
$(function () {
	// Menu behavior
	$("#menu").on("click", "." + jsClasses.menuItem, function (e) {
		e.preventDefault();
		var objThis = $(this);
		var id = objThis.attr("href");

		site.controlHistory(id);
		$('.active').removeClass('active');
		objThis.addClass('active');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 90
		}, 600);
	});

	// Language menu behavior
	$("#languages").on("click", "." +jsClasses.flagItem + "", function (e) {
		e.preventDefault();
		var lang = $(this).attr('data-lang');
		var flag = $(this).attr('data-flag');
		var mainFlag = $('#main-flag');

		// Change the active flag
		mainFlag.removeClass().addClass('flag').addClass(flag);

		// Check if the language is loaded
		if (!languages[lang]) {
			// load the language
			site.startSpinner();
			$.getJSON('/assets/lang/' + lang + '.json', function (data) {
				site.stopSpinner();
				languages[lang] = data;
				site.writeContent(languages[lang], lang);
			});
			//

		} else {
			site.writeContent(languages[lang], lang);
		}

	});


	// cache the navigation links
	var $navigationLinks = $('#menu > a');
	// cache (in reversed order) the sections
	var $sections = $($(".site-section").get().reverse());

	// map each section id to their corresponding navigation link
	var sectionIdTonavigationLink = {};
	$sections.each(function () {
		var id = $(this).attr('id');
		sectionIdTonavigationLink[id] = $('#menu > a[href="#' + id + '"]');
	});

	// throttle function, enforces a minimum time interval
	function throttle(fn, interval) {
		var lastCall, timeoutId;
		return function () {
			var now = new Date().getTime();
			if (lastCall && now < (lastCall + interval)) {
				// if we are inside the interval we wait
				clearTimeout(timeoutId);
				timeoutId = setTimeout(function () {
					lastCall = now;
					fn.call();
				}, interval - (now - lastCall));
			} else {
				// otherwise, we directly call the function
				lastCall = now;
				fn.call();
			}
		};
	}

	function highlightNavigation() {
		// get the current vertical position of the scroll bar
		var scrollPosition = $(window).scrollTop();

		// iterate the sections
		$sections.each(function () {
			var currentSection = $(this);
			// get the position of the section
			var sectionTop = currentSection.offset().top - 100;

			// if the user has scrolled over the top of the section
			if (scrollPosition >= sectionTop) {
				// get the section id
				var id = currentSection.attr('id');
				// get the corresponding navigation link
				var $navigationLink = sectionIdTonavigationLink[id];
				// if the link is not active
				if (!$navigationLink.hasClass('active')) {
					// remove .active class from all the links
					$navigationLinks.removeClass('active');
					// add .active class to the current link
					$navigationLink.addClass('active');
				}
				// we have found our section, so we return false to exit the each loop
				return false;
			}
		});
	}

	$(window).scroll(throttle(highlightNavigation, 100));
	/*  */
});
