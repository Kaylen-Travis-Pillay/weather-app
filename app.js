var express = require("express");
var app = express();
var body_parser = require("body-parser");
var credentials = require("./credentials.json");
var request = require("request");
var send = require("gmail-send");
var api_data;

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Functions

function emailBody() {
    
}

function getData(success, fail){
    request(credentials.api_key, function (error, response, body) {
        if (response.statusCode === 200) {
            api_data = JSON.parse(body);
            success();
        }else{
            fail();
        }
    });
}

// Routes
app.get("/", function(req, res){
    res.render("home");
});

app.post("/email-weather", function(req, res){
    
    getData(function() {
        console.log(api_data.query.results.channel.item.title);
        console.log(credentials.user);
        console.log(credentials.pass);
    },function(){});
    res.redirect("/");
});

// Listen
app.listen(3000, function(){
    console.log("Server started @ localhost:3000");
});