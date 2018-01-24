var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", function(req, res){
    res.send("Connected");
});

// Listen
app.listen(3000, function(){
    console.log("Server started @ localhost:3000");
});