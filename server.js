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
    if(err) return res.send('Write file error');
    });
    res.send('post worked');
  })
});

app.put('/:id', function(req, res) {
  var id = req.params.id;
  var path = './user/' + id + '.json';
  var obj = JSON.stringify(req.body);
  console.log(obj);
  var objProps = {
    firstName: JSON.parse(obj).firstName,
    email: JSON.parse(obj).email,
    powerLevel: JSON.parse(obj).powerLevel
  }
  console.log(objProps);
  fs.readdir('./user/', function(err, files) {
    if(err) return res.send(404 + ' File not found');
    for(var i = 0; i < files.length; i++) {
      if(files[i] === id + '.json'){
        console.log('found matching file');
        /*fs.readFile(path, function(err, data) {
          var user = data;
          console.log(JSON.stringify(user.toString()));
          console.log(JSON.parse(user));
          var newObj = {firstName: null, email:null, powerLevel:null};
          console.log(newObj);
          for(prop in newObj){
            newObj[prop] = (objProps[prop]) ? objProps[prop] : user[prop];
          }
          console.log(newObj)
          fs.writeFile(path, newObj, function(err) {
            if(err) return res.send('Write file error');
          })
        });
        */

      }else{
        var newObj = {firstName: null, email:null, powerLevel:null};
        for(prop in newObj){
          newObj[prop] = (objProps[prop]) ? objProps[prop] : null;
        }
        fs.writeFile(path, newObj, function(err) {
          if(err) return res.send('Write file error');
        });
      }
    }
  });
});

app.delete('/:id', function(req, res) {
  var path = './user/' + req.params.id + '.json';
  fs.unlink(path, function(err) {
    if(err) return res.send(404 + ' File not found');
  })
  res.send(req.params.id + ' has been deleted');
});


app.listen(port, function() {
  console.log('Server is listening on port ' + port );
});
