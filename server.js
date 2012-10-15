var express = require('express')
  , format = require('util').format;
var fs = require('fs');
var cloudinary = require('cloudinary');
var nodemailer = require("nodemailer");
    
var app = express.createServer(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({
   dumpExceptions: true, 
   showStack: true
 }));
 
// create reusable transport method (opens pool of SMTP connections) var smtpTransport =
nodemailer.createTransport("SMTP",{ service: "Gmail", auth: { user: "", pass: "" } });
 
// Routes 
 
app.get('/', function(req, res){
	res.send('<form method="post" enctype="multipart/form-data">'
   + '<p>Post Title: <input type="text" name="title"/></p>'
   + '<p>Post Content: <input type="text" name="content"/></p>'
	 + '<p>Image: <input type="file" name="image"/></p>'
	 + '<p><input type="submit" value="Upload"/></p>'
	 + '</form>');
});
 
app.post('/', function(req, res, next){
  
	// send mail with defined transport object
  var mailOptions = {
     from: "", // sender address
     to: "", // list of receivers
     subject: req.body.title, // Subject line
     text: req.body.content, // plaintext body
		 attachments:[
       {
				 fileName: req.body.title,
         streamSource: req.files.image
			 }
		 ]
  }
 
  smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
		   console.log(error);
			 res.send('Failed');
		}else{
		   console.log("Message sent: " + response.message);
			 res.send('Worked');
		}
  });
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});