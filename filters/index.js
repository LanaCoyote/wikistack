module.exports = function( swig ) {
  var pageLink = function( page ) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };
  pageLink.safe = true;

  var userLink = function( user ) {
    return '<a href="/users/' + user._id.toString() + '">' + user.name + '</a>';
  }
  userLink.safe = true;

  swig.setFilter( 'pageLink', pageLink );
  swig.setFilter( 'userLink', userLink );
};
