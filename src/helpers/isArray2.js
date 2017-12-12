module.exports.register = function(Handlebars, options){
  Handlebars.registerHelper('ifObject', function(item, options) {
  if(typeof item === "object") {

    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});
}
