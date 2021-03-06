var http = require("http");
var renderer = require("./renderer.js")
var Location = require("./location.js");
var Weather = require("./weather.js");


http.createServer(function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html' });
  var userLocation = new Location(request.connection.remoteAddress);

  userLocation.on("end", function(locationJSON){
    var userWeather = new Weather(locationJSON.zip_code);
    userWeather.on("end", function(weatherJSON){
      console.log(weatherJSON);
      var values = {
        location:locationJSON.city,
        todaysHigh: weatherJSON.list[0].main.temp_max,
        todaysLow: weatherJSON.list[0].main.temp_min,
        todaysMain: weatherJSON.list[0].weather[0].main,
        tomorrowsHigh: weatherJSON.list[1].main.temp_max,
        tomorrowsLow: weatherJSON.list[1].main.temp_min,
        tomorrowsMain: weatherJSON.list[1].weather[0].main
      };

      renderer.view('index', values, response);
      response.end();
    });
  });

}).listen(3000);

console.log('Server running on localhost:3000');
