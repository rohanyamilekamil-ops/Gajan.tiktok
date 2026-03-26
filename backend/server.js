const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("YOUR_MONGODB_URL")
.then(()=>console.log("DB Connected"));

// Model
const User = mongoose.model("User",{
  email:String,
  password:String
});

const Video = mongoose.model("Video",{
  url:String,
  likes:Number
});

// Signup
app.post("/signup",(req,res)=>{
  new User(req.body).save();
  res.json({msg:"Signup"});
});

// Login
app.post("/login", async (req,res)=>{
  const user = await User.findOne(req.body);
  if(user) res.json({msg:"Login OK"});
  else res.json({msg:"Wrong"});
});

// Upload (simple)
app.post("/upload",(req,res)=>{
  new Video({url:req.body.url,likes:0}).save();
  res.json({msg:"Uploaded"});
});

// Get videos
app.get("/videos", async (req,res)=>{
  res.json(await Video.find());
});

app.listen(3000,()=>console.log("Server running"));const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("YOUR_MONGODB_URL");

// Models
const User = mongoose.model("User", {
  email:String,
  password:String
});

const Video = mongoose.model("Video", {
  url:String,
  likes:Number
});

// Signup
app.post("/signup", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await new User({email:req.body.email,password:hash}).save();
  res.json({msg:"Signup done"});
});

// Login
app.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.json({msg:"User not found"});

  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.json({msg:"Wrong password"});

  const token = jwt.sign({id:user._id},"SECRET");
  res.json({token});
});

// Upload (simple URL)
app.post("/upload", async (req,res)=>{
  await new Video({url:req.body.url,likes:0}).save();
  res.json({msg:"Uploaded"});
});

// Get videos
app.get("/videos", async (req,res)=>{
  res.json(await Video.find().sort({_id:-1}));
});

app.listen(3000, ()=>console.log("Server running"));
