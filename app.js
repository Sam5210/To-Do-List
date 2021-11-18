//Requiring the necessary node modules

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

//Mongoose setup
mongoose.connect("mongodb://localhost:27017/toDoListDB", {useNewUrlParser: true});

//Item schema setup
const itemSchema = new mongoose.Schema({
    name: {type: String, required: [true, "No name specified for item."]}
});
const Item = mongoose.model("Item", itemSchema);

//Default items setup
const affirmation0 = new Item ({name: "The following are default entries."})
const affirmation1 = new Item ({name: "Enjoy the day."});
const affirmation2 = new Item ({name: "Create a future you want from today."});
const affirmation3 = new Item ({name: "Just do it."});
const defaultItems = [affirmation0, affirmation1, affirmation2, affirmation3];

//List schema setup
const listSchema = new mongoose.Schema({
    name: {type: String, required: [true, "No name specified for list."]}, 
    items: [itemSchema]
});
const List = mongoose.model("List", listSchema);


//Server setup
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(request, response){
    Item.find({}, function(error, items){
        if(error){
            console.log(error);
        }   
        else{
            if(items.length == 0){
                response.render("list", {listType: "Today", newListItems: defaultItems});
            }
            else{
                response.render("list", {listType: "Today", newListItems: items});
            }
        }
    });
});

app.post("/", function(request, response){
    const itemName = request.body.userInputList;
    const listName = request.body.listPage;
    const item = new Item ({name: itemName});
    if(listName === "Today"){
        item.save();
        response.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(error, result){
            if(error){
                console.log(error);
            }
            else{
                result.items.push(item);
                result.save();
                response.redirect("/" + listName);
            }
        });
    }
});

app.post("/delete", function(request, response){
    const item = request.body.checkbox;
    Item.deleteOne({_id: item}, function(error){
        if(error){
            console.log(error);
        }
        else{
            console.log("Successfully deleted item.");
            response.redirect("/");
        }
    });
});
app.get("/favicon.ico", function(request, response){response.send("<h1>Favicon</h1>")});

app.get("/:route", function(request, response){
    const customListName = request.params.route;
    List.findOne({name: customListName}, function(error, result){
        if(error){
            console.log(error);
            response.send("Error has occurred.");
        }
        else{
            if(result){
                response.render("list", {listType: result.name, newListItems: result.items});
            }
            else{
                const list = new List ({
                    name: customListName,
                    items: []
                });
                list.save();
                response.render("list", {listType: customListName, newListItems: defaultItems});
            }
        }
    });

});

app.listen(process.env.PORT || 3000);