var chalk = require('chalk');
var mongoose = require('mongoose');

// connect to mongo
mongoose.connect( 'mongodb://localhost/wikistack' );
var db = mongoose.connection;
db.on( 'error', console.error.bind( console, chalk.red( "!! MONGO ERROR::" ) ) );

// helpers
function titleToUrl(title) {
  title = title.replace(/\s/g, '_'); // replace whitespace with '-'
  title = title.replace(/\W/g, ''); // replace nonalpha chars with ''
  return title;
}

// user schema
var userSchema = new mongoose.Schema( {
  name: {type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true }
} );

// page schema
var pageSchema = new mongoose.Schema( {
  title: {type: String, required: true },
  urlTitle: {type: String, required: true },
  content: {type: String, required: true },
  date: {type: Date, default: Date.now},
  status: {type: String, enum: ['open','closed']},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags: {type: [String], default: function() { return [] }}
} );

pageSchema.pre('validate', function(next) {
  this.urlTitle = titleToUrl(this.title);
  next();
});

// route property on page resolves to /wiki/urlTitle
pageSchema.virtual( 'route' ).get( function() {
  return '/wiki/' + this.urlTitle;
} );

pageSchema.virtual( 'findSimilar' ).get( function() {
  return (function( cb ) {
    return Page.find({
      tags: {$in: this.tags},
      _id: {$ne: this._id}
    }, cb);
  }).bind( this );
} );

// findByTag searches for pages by tag
pageSchema.statics.findByTag = function( tags, cb ) {
  return this.find({
    tags: {$in: tags}
  }).exec( cb );
}

// create objects
var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

// export
module.exports = {
  Page: Page,
  User: User
};
