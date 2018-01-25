var express = require("express");
var app = express();
var body_parser = require("body-parser");
var credentials = require("./credentials.json");
var request = require("request");
var nodemailer = require('nodemailer');
var api_data;

var transporter = nodemailer.createTransport({
    service: credentials.service,
    auth: {
        user: credentials.user,
        pass: credentials.pass
    }
});

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Functions

function buildEmailBody() {
    var string_builder = "Hi,\nHeres your weather:\n\n";
    string_builder += "Today's Conditions: "+ api_data.query.results.channel.item.condition.date +"\n";
    string_builder += "\tTemperature: " + api_data.query.results.channel.item.condition.temp +
         " Degr.Cel - " + api_data.query.results.channel.item.condition.text + "\n";
    
    string_builder += "Forecast: \n";
    api_data.query.results.channel.item.forecast.forEach(function(forcast){
        string_builder += "\t" + forcast.day + ", " + forcast.date + "\n";
        string_builder += "\t\t-High: " + forcast.high + " Degr.Cel\n";
        string_builder += "\t\t-Low: " + forcast.low + " Degr.Cel\n";
        string_builder += "\t\t-Descr: " + forcast.text + "\n\n";
    });

    return string_builder;
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
        var mailOptions = {
            from: credentials.user,
            to: req.body.emailAddr,
            subject: "Weather from Weatherly - " + api_data.query.results.channel.item.condition.date,
            text: buildEmailBody()
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.redirect("http://www.google.com");
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect("/");
            }
        }); 
    },function(){
        console.log("Could not get data");
        res.redirect("/");
    });
    
});

app.get("*", function(req, res){
    res.redirect("/");
});

// Listen
app.listen(3000, function(){
    console.log("Server started @ localhost:3000");
});