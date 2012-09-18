var express = require('express')
  , format = require('util').format;
var fs = require('fs');
var cloudinary = require('cloudinary');
    
var app = express.createServer(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({
   dumpExceptions: true, 
   showStack: true
 }));
 
app.get('/', function(request, res) {
  // res.send('<form method="post" enctype="multipart/form-data">'
  //   + '<p>Title: <input type="text" name="title" /></p>'
  //   + '<p>Image: <input type="file" name="image" /></p>'
  //   + '<p><input type="submit" value="Upload" /></p>'
  //   + '</form>');
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Public ID: <input type="text" name="title"/></p>'
    + '<p>Image: <input type="file" name="image"/></p>'
    + '<p><input type="submit" value="Upload"/></p>'
    + '</form>');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.post('/', function(req, res, next){
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