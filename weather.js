
var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

function Weather(zip) {
  EventEmitter.call(this);
  weatherEmitter = this;

  var request = http.get('http://api.openweathermap.org/data/2.5/forecast?zip='+zip + ',us&appid=2cfd5e3ad5ebbe40c611b2961a498f71&units=imperial', function(response) {
    var body = "";
    if (response.statusCode !== 200) {
        request.abort();
        //Status Code Error
        weatherEmitter.emit("error", new Error("There was an error getting the weather for your location. (" + http.STATUS_CODES[response.statusCode] + ")"));
    }
    response.on("data", function(responseInfo){
      body += responseInfo;
      weatherEmitter.emit("data", responseInfo);
    });
    response.on('end', function () {
        if(response.statusCode === 200) {
            try {
                //Parse the data
                var weather = JSON.parse(body);
                weatherEmitter.emit("end", weather);
            } catch (error) {
                console.log(error.message);
                weatherEmitter.emit("error", error);
            }
        }
    }).on("error", function(error){
        weatherEmitter.emit("error", error);
    });
  console.log(`Got response: ${response.statusCode}`);
  // consume response body
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
};

util.inherits( Weather , EventEmitter );

module.exports = Weather;
