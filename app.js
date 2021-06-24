const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Bolg_Website",{ useNewUrlParser: true });

const itemSchema = {
  title: String,
  content: String
};
const contactSchema = {
  firstName: String,
  lastName: String,
  subject: String
};

const Item = mongoose.model("Item",itemSchema);
const Post = mongoose.model("Post",itemSchema);
const Contact = mongoose.model("Contact",contactSchema);

app.get("/",(req, res) => {
  Item.find({},(error,homeStartingContent) => {
    Post.find({},(err,posts) => {
      res.render("home", {startingContent: homeStartingContent, posts: posts});
    });
  });
});

app.get("/about",(req, res) => {
  Item.find({},(error,aboutContent) => {
    res.render("about", {aboutContent: aboutContent});
  });
});

app.get("/contact",(req, res) => {
  Item.find({},(error,contactContent) => {
    res.render("contact", {contactContent: contactContent});
  });
});

app.get("/compose",(req, res) => {
  res.render("compose");
});

app.post("/compose",(req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  const item = new Post({
    title: post.title,
    content: post.content
  });
  item.save();
  res.redirect("/");

});

app.post("/contact",(req,res) => {
  const cont = new Contact({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    subject: req.body.subject
  });
  cont.save();
  res.redirect("/");
});

app.get("/posts/:postName",(req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({},(err,posts) => {
    posts.forEach((post) => {
      const storedTitle = _.lowerCase(post._id);
      if (storedTitle === requestedTitle) {
        res.render("post", {title: post.title,content: post.content});
      }
    });
  });

});

app.listen(3000,() => {
  console.log("Server started on port 3000");
});