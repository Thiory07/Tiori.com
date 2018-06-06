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


var languages = document.getElementById("languages");
languages.addEventListener("click", function(e) {
	languages.classList.toggle("show");
});