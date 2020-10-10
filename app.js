// Install these packages via npm: npm install express aws-sdk multer multer-s3 

var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
// 	accessKeyId: 'Your Amazon S3 Access Key',
//     secretAccessKey: 'Your Amazon S3 Secret Key',    
    region: 'us-east-1'
});

var app = express();
var s3 = new aws.S3({ /* ... */ });

app.use(bodyParser.json());

var promise = new Promise(function(resolve, reject) { 
  s3.listBuckets(function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
   else resolve(s3 = data.Buckets[0].Name);           // successful response
  });
}).catch((error) => {
  console.error(error);
});

var d1 = "";
promise.then((value) => {
  console.log(value);
    d1 = value;
}).catch((error) => {
  console.error(error);
});
    
console.log(d1);
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: d1,
        key: function (req, file, cb) {
            cb(null, file.originalname);
            }
        })
});

app.post('/upload', upload.array('uploadFile',1), function (req, res, next) {
    res.send("File uploaded successfully to Amazon S3 Server!");
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.listen(3300, function () {
    console.log('Amazon s3 file upload app listening on port 3300');
});
