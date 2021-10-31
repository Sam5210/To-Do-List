const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = [];
const workItems = [];
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (request, response) => {
    let today = date.getDate();
    response.render("list", {listType: today, newListItems: items});
});
app.post("/", (request, response) => {
    const item = request.body.userInputList;
    if(request.body.listPage === "Work"){
        workItems.push(item);
        response.redirect("/work");
    }
    else{
        items.push(item);
        response.redirect("/")
    }
    console.log(request.body.listPage);
});
app.get("/work", (request, response) => {
    response.render("list", {listType: "Work", newListItems: workItems});
});
app.listen(3000);
