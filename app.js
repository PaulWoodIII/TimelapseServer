
/**
 * Module dependencies.
 */

var express = require('express');
var ArticleProvider = require('./ArticleProvider').ArticleProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var articleProvider = new ArticleProvider('localhost', 27017);

// Routes

app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', { 
            locals: {
                title: 'Pedaling Paul',
                articles:docs
            }
        });
    })
});

app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

app.get('/picture', function(req, res){
	ArticleProvider.findAll(function(error, docs){
	   res.send(docs);
	   res.send('<form method="post" enctype="multipart/form-data">'
	     + '<p>Public ID: <input type="text" name="title"/></p>'
	     + '<p>Image: <input type="file" name="image"/></p>'
	     + '<p><input type="submit" value="Upload"/></p>'
	     + '</form>');
	});
})

app.post('/picture', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  // res.send(format('\nuploaded %s (%d Kb) to %s as %s'
  //   , req.files.image.name
  //   , req.files.image.size / 1024 | 0 
  //   , req.files.image.path
  //   , req.body.title));
  
  stream = cloudinary.uploader.upload_stream(function(result) {
    console.log(result);
    res.send('Done:<br/> <img src="' + result.url + '"/><br/>' + 
             cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));
  }, { public_id: req.body.title } );
  fs.createReadStream(req.files.image.path, {encoding: 'binary'}).on('data', stream.write).on('end', stream.end);
  
});

app.listen(3000);
