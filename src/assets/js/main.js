// Variable to store the languages
var languages = {};
var jsClasses = {
  content: 'js-content',
  menuItem: 'js-menu-item',
  flagItem: 'js-flag-item'
}
var site = {
  start: function() {
    this.setSections();
    this.setMenu();
  },
  setSections: function() {
    this.sections = document.getElementsByClassName('site-section');
  },
  setMenu: function() {
    this.menuItems = document.getElementById('menu').getElementsByClassName(jsClasses.menuItem);
  },
  scrollOffset: -20
}
site.start();

/**/
customScrollTo = function(to, duration) {
  const
    element = document.scrollingElement || document.documentElement,
    start = element.scrollTop,
    change = to - start,
    startDate = +new Date(),
    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    easeInOutQuad = function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    },
    animateScroll = function() {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };
  animateScroll();
};
/**/


// Pure Javascript code 
console.log("Javascript loaded");
//languages button
window.languages = document.getElementById("languages");
window.languages.addEventListener("click", function(e) {
  window.languages.classList.toggle("show");
  window.addEventListener("click", closeLanguages);
});
var closeLanguages = function(evt) {
	var flyoutElement = document.getElementById('languages'),
        targetElement = evt.target;  // clicked element
    do {
        if (targetElement == flyoutElement) {
            // This is a click inside. Do nothing, just return.
            return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
    } while (targetElement);
    // This is a click outside.
     window.languages.classList.remove("show");
    window.removeEventListener("click", closeLanguages);
    return;
}

// Throttle for events that fire multiple times per seccond
window.addEventListener('scroll', throttle(highlightNavigation, 2));
window.addEventListener('resize', throttle(setSiteVar, 2));

function setSiteVar() {
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
  removeClass('active');
  for (let i = site.sections.length - 1; i > 0; i--) {
    if (scrollPosition >= site.sections[i].offsetTop + site.scrollOffset && change) {
      site.menuItems[i - 1].classList.add('active');
      change = false;
      return false;
    }
  }
}

function removeClass(classes) {
  let elems = document.querySelectorAll("." + classes);
  [].forEach.call(elems, function(el) {
    el.classList.remove(classes);
  });
}


// menu click
for (var i = 0; i < site.menuItems.length; i++) {
  site.menuItems[i].addEventListener("click", clickMenu);
}

function clickMenu() {
  var href = this.getAttribute('href');
  customScrollTo(document.querySelectorAll(href)[0].offsetTop + site.scrollOffset, 400);
}