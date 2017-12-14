// Variable to store the languages
var languages = {};
var site= {
  startSpinner: function(){},
  stopSpinner: function(){},
  writeContent: function(obj, lang){
    var content = obj[lang].content;
    var divs = document.querySelectorAll('.js-menu-item');
    // Menu items
    for (var i = 0; i < divs.length; i++) {
        divs[i].querySelector('div').innerHTML = content.menu[i].name;
    }
    // About page
    var about = document.getElementById('about');
    var aboutTitle = about.querySelector('h1');
    var aboutContent = about.querySelector('.js-content');
    var innerContent = "";
    var figCaption = about.querySelector('#figCaption');
    aboutTitle.innerHTML = content.pages.about.title;
    figCaption.innerHTML = content.pages.about.img.alt;
    for (var i = 0; i < content.pages.about.body.length; i++) {
      innerContent += concatHtml (content.pages.about.body[i]);
    }
    aboutContent.innerHTML = innerContent;

    // Projects page
    var projects = document.getElementById('projects');
    var projectsTitle = projects.querySelector('h1');
    var projectsContent = projects.querySelector('.js-content');
    var innerContent = "";
    projectsTitle.innerHTML = content.pages.projects.title;
    for (var i = 0; i < content.pages.projects.body.length; i++) {
      innerContent += concatHtml (content.pages.projects.body[i]);
    }
    projectsContent.innerHTML = innerContent;

    // Contact page
    var contact = document.getElementById('contact');
    var contactTitle = contact.querySelector('h1');
    var contactContent = contact.querySelector('.js-content');
    var innerContent = "";
    contactTitle.innerHTML = content.pages.contact.title;
    for (var i = 0; i < content.pages.contact.body.length; i++) {
      innerContent += concatHtml (content.pages.contact.body[i]);
    }
    contactContent.innerHTML = innerContent;
  }
}

function concatHtml (obj) {
  var string = "";
  if (typeof obj.content === "string") {
    string = "<" +  obj.tag + ">"+ obj.content+ "</"+obj.tag+">";
  }else{
    string = "<" +  obj.tag + ">";
    for (var i = 0; i < obj.content.length; i++) {
      string += concatHtml (obj.content[i]);
    }
    string += "</"+obj.tag+">";
  }
  return string;
}
// Things that need to wait jquery
$(function() {
  // Menu behavior
  $("#menu").on( "click", ".js-menu-item" , function(e) {
    e.preventDefault();
    var id = $(this).attr("href");
    console.log(id );
    $('html, body').animate({
            scrollTop: $(id).offset().top - 100
        }, 600);
  });

  // Language menu behavior
  $("#languages").on("click", ".js-flag-item", function(e) {
    var lang = $(this).attr('data-lang');
    var flag = $(this).attr('data-flag');
    var mainFlag = $('#main-flag');

    // Change the active flag
    mainFlag.removeClass().addClass('flag').addClass(flag);

    // Check if the language is loaded
    if (!languages[lang]){
      console.log("Language being added");
      // load the language
      site.startSpinner();
      $.getJSON('/assets/lang/'+lang+'.json', function(data) {
        site.stopSpinner();
         languages[lang] =data;
         site.writeContent(languages[lang], lang);
      });
      //

    }else{
      console.log("Language already loaded");
      site.writeContent(languages[lang], lang);
    }

  });
  /*  */
});
