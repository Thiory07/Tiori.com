// Variable to store the languages
var languages = {};
var jsClasses = {
	content: 'js-content',
	menuItem: 'js-menu-item',
	flagItem: 'js-flag-item'
}
var site = {
	start: function(){ 
		this.setSections(); 
		this.setMenu(); 
	},
	setSections: function(){ 
		this.sections = document.getElementsByClassName('site-section'); 
	},
	setMenu: function(){ 
		this.menuItems =  document.getElementById('menu').getElementsByClassName(jsClasses.menuItem); 
	}
}
site.start();
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

	/*  */
});

















// Pure Javascript code 

console.log("Javascript loaded");
//languages button
window.languages = document.getElementById("languages");
window.languages.addEventListener("click", function(e) {
	console.log("Languages click");
  window.languages.classList.toggle("show");
});

// Throttle for events that fire multiple times per seccond
window.addEventListener('scroll', throttle(highlightNavigation, 20));
window.addEventListener('resize', throttle(setSiteVar, 20));
function setSiteVar(){
	site.setSections();
}
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
	if ((time + wait - Date.now()) < 0) {
	  fn();
	  time = Date.now();
    }
  }
}
// On Scroll change navigation
function highlightNavigation() {
  	
	var scrollPosition = document.documentElement.scrollTop;
	var change = true;
	//console.log(scrollPosition);
	removeHighlightNavigation();
	console.log( "debug window scroll:" + scrollPosition);
	for(let i= site.sections.length; i >0; i--){
		if (scrollPosition > site.sections[i].offsetTop && change) {
			site.menuItems[i].classList.add('active');
			change=false;
			return false;
  		}
	}

}
function removeHighlightNavigation(){
	let elems = document.querySelectorAll(".active");
	[].forEach.call(elems, function(el) {
		el.classList.remove("active");
	});
}
