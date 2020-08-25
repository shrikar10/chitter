const express = require('express');
const path = require("path");
const jwt = require("jsonwebtoken");

const config = require("./config/config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const chitterRoute = require("./routes/chitter.routes");
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI,
   {useNewUrlParser: true,useUnifiedTopology: true});
mongoose.connection.on('error',()=>{
  throw new Error("Unable to connect to database")
})
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine" , "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  if (req.cookies.t) {
    const decoded = jwt.verify(req.cookies.t, config.JWT_SECRET);
    if (decoded) return res.status(200).redirect("/chitter");
  }
  const message = req.query.isSignedup == "success" ? "You can Login now!" : "";
  res.status(200).render("index.ejs", { title: "Chitter", message });
});
app.use("/api", authRoute);
app.use("/users", userRoute);
app.use("/chitter", chitterRoute);
    
app.get("/*", (req, res) =>
    res.render("404.ejs", { title: "Ye konsi line me aa gaye aap?" })
  );
app.listen(config.PORT,(err) =>{
    if(err){
        console.log('An error occures');
    }
    console.log("Server started"+ config.PORT);
});