$("#menu").on( "click", ".js-menu-item" , function(e) {
  e.preventDefault();

  var id = $(this).attr("href");
  console.log(id );
  $('html, body').animate({
          scrollTop: $(id).offset().top - 100
      }, 600);
});
