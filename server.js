var express = require('express')
  , format = require('util').format;
    
var app = express.createServer(express.logger());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: 'static/images' }));
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({
   dumpExceptions: true, 
   showStack: true
 }));
 
app.get('/', function(request, res) {
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.post('/', function(req, res, next){
  // the uploaded file can be found as `req.files.image` and the
  // title field as `req.body.title`
  res.send(format('\nuploaded %s (%d Kb) to %s as %s'
    , req.files.image.name
    , req.files.image.size / 1024 | 0 
    , req.files.image.path
    , req.body.title));
});