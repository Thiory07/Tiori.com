// Variable to store the languages
var languages = {};
var site= {
  startSpinner: function(){},
  stopSpinner: function(){},
  _writePage: function(pageId, content){
    var page = document.getElementById(pageId);
    var pageTitle = page.querySelector('h1');
    var pageContent = page.querySelector('.js-content');
    var innerContent = "";
    console.log(pageId);
    pageTitle.innerHTML = content.pages[pageId].title;

    for (var i = 0; i < content.pages[pageId].body.length; i++) {
      innerContent += concatHtml (content.pages[pageId].body[i]);
    }
    pageContent.innerHTML = innerContent;
  },
  writeContent: function(obj, lang){
    var content = obj[lang].content;
    var divs = document.querySelectorAll('.js-menu-item');
    // Menu items
    for (var i = 0; i < divs.length; i++) {
        divs[i].querySelector('div').innerHTML = content.menu[i].name;
    }
    //figure
    var figCaption = about.querySelector('#figCaption');
    figCaption.innerHTML = content.pages.about.img.alt;
    // About page
    this._writePage('about', content);
    // Projects page
    this._writePage('projects', content);
    // Contact page
    this._writePage('contact', content);
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
    e.preventDefault();
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
