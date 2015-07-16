var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('get request to home directory worked');
});

//use id to get which is the file number-name combo
//example is 1-Vi
app.get('/:id', function(req, res) {
  var path = './user/'+ req.params.id +'.json';
  fs.readFile(path, function(err, data) {
    if(err) return res.send(404 + ' File not found');
    res.send(data.toString());
  });
});

app.post('/', function(req, res) {
  fs.readdir('./user', function (err, files) {
    if(err) return res.send(404 + ' File not found');
    var count = files.length + 1 || 1;
    var obj = JSON.stringify(req.body);
    //combination of file number and first name into an id reduces chance of naming collision after files are deleted
    var id = count + '-' + JSON.parse(obj).firstName;
    var path = './user/' + id + '.json';

    fs.writeFile(path, obj, function(err) {
    if(err) return res.send(500 + ' Write file error');
    });
    res.send('File Received');
  });
});


app.put('/:id', function(req, res) {
  var id = req.params.id;
  var path = './user/' + id + '.json';
  //grab request arguements
  var obj = JSON.stringify(req.body);
  //create object based on resource format and check to see which properties are being written in
  var objProps = {
    firstName: JSON.parse(obj).firstName || null,
    email: JSON.parse(obj).email || null,
    powerLevel: JSON.parse(obj).powerLevel || null
  };
  //read directory to see if the file exists
  fs.readdir('./user/', function(err, files) {
    if(err) return res.send(404 + ' File not found');
    //parse through directory names to find match
    for(var i = 0; i < files.length; i++) {
      //if there is a match then rewrite to correct properties
      if(files[i] === id + '.json'){
        fs.readFile(path, 'utf8', function(err, data) {
          //grab the file info and parse into object literal notation
          var user = JSON.parse(data);
          //initialize a new object to be written into the destination file
          var newObj = {firstName: null, email:null, powerLevel:null};
          //Assign properties into new object if a new value was given. if not then pass in the old information
          for(var prop in newObj){
            newObj[prop] = (objProps[prop]) ? objProps[prop] : user[prop];
          }
          //write to file
          fs.writeFile(path, JSON.stringify(newObj), function(err) {
            if(err) return res.send('Write file error');
          });
          res.send('File updated');
        });
      //if there is no match then write to new file
      }else{
        fs.writeFile(path, JSON.stringify(objProps), function(err) {
          if(err) return res.send(500 +' Write file error');
        });
      }
    }
  });
});

app.delete('/:id', function(req, res) {
  var path = './user/' + req.params.id + '.json';
  fs.unlink(path, function(err) {
    if(err) return res.send(404 + ' File not found');
  });
  res.send(req.params.id + ' has been deleted');
});


app.listen(port, function() {
  console.log('Server is listening on port ' + port );
});
