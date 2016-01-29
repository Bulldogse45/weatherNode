var http = require("http");
var renderer = require("./renderer.js")
var Location = require("./location.js");


http.createServer(function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html' });
  var userLocation = new Location(request.connection.remoteAddress);
  userLocation.on("end", function(locationJSON){
    var values = {location:locationJSON.city};
    console.log(locationJSON.city);
    renderer.view('index', values, response);
    response.end();
  });

}).listen(3000);

console.log('Server running on localhost:3000');
