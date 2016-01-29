var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");

function Location(ip) {
  EventEmitter.call(this);
  locationEmitter = this;

  var request = https.get('https://freegeoip.net/json/?q='+ ip, function(response) {
    var body = "";
    if (response.statusCode !== 200) {
        request.abort();
        //Status Code Error
        locationEmitter.emit("error", new Error("There was an error getting the location for your location. (" + http.STATUS_CODES[response.statusCode] + ")"));
    }
    response.on("data", function(responseInfo){
      body += responseInfo;
      locationEmitter.emit("data", responseInfo);
    });
    response.on('end', function () {
        if(response.statusCode === 200) {
            try {
                //Parse the data
                var location = JSON.parse(body);
                locationEmitter.emit("end", location);
            } catch (error) {
                console.log(error.message);
                locationEmitter.emit("error", error);
            }
        }
    }).on("error", function(error){
        locationEmitter.emit("error", error);
    });
  console.log(`Got response: ${response.statusCode}`);
  // consume response body
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
};

util.inherits( Location , EventEmitter );

module.exports = Location;
