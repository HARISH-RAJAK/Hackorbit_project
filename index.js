import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import { User } from './Models/User.js';
import { Question } from './Models/Questions.js';


var message ="";
var data_array = [];
const app = express();
const port = 5000;
let for_user_name ;

mongoose.connect('mongodb+srv://rajakharish027:1NSCY7IfJ1PYqWMr@cluster0.kgwdgrc.mongodb.net/',{
  "dbname":"prep_app"
}).then(() => {
  console.log("connected to database")
}).catch((err) => {
  console.log("error in connecting to database", err)
});

app.use(express.static(path.join(path.resolve(),'./public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/', (req, res) => {
  res.render('index.ejs');
});
 
app.get('/login', (req, res) => {
  res.render('login.ejs',{message});
});

app.get('/home', (req, res) => {
  res.render('home.ejs',{for_user_name});
});

app.post('/home', (req, res) => {
  User.findOne({phone:req.body.phone}).then((user) => {
  if(user){
    if(user.password == req.body.password){
      for_user_name=user;
      res.render('home.ejs', {for_user_name});
    }else{
      res.render('login.ejs', {
        message : "password is incorrect"
      });
    }
  }else{
    res.json({
      "message" : "user not found"
    });
  }
 }).catch((err) => {
  console.log("error in finding user", err);
  return res.status(500).json({
    "message" : "error in finding user"
  });
 });
});

app.get('/register', (req, res) => {
  message ="";
  res.render('register.ejs',{message});
});

app.post('/registration-data', async(req, res) => {
 try {
  let user = await User.create(req.body);
  res.render('login.ejs', {
    message : "user created successfully"
  });
 }
 catch (error) {
  console.log("error in creating user", error);

  if(error.code == 11000){
    message = "user already exists";
    return res.render('register.ejs', {message} );
  }
  return res.status(500).json({
    "message" : "error in creating user"
  });
 }
});

app.get('/jee_subject', (req, res) => {
  res.render('jee_content/jee_subject.ejs');
});


app.get('/jee_physics', (req, res) => {
  res.render('jee_content/jee_physics.ejs');
});

app.get('/j_phy', async (req, res) => {
  const url = req.query.chap;
  let chap = "";
  for(let i=0;i<url.length-1;i++){
    chap+=url[i];
  }
  let data_array = []; 
  if (chap == "jeePhy1") {
    try {
      const data = mongoose.models[chap] || mongoose.model(chap, Question.schema);
      data_array = await data.find().exec();
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ message: "Error fetching data" });
    }
  }
  res.render('jee_content/data.ejs', { data_array,chap });
});


app.post('/j_phy', (req, res) => {
  res.render('jee_content/data.ejs');
});


app.get('/iit/phy', (req, res) => {
  res.send("this is about physics");
});

app.get('/edutube',(req,res)=>{
res.render('edutube.ejs');
});


app.get('/admin', (req, res) => {
  res.render('admin.ejs');
});

app.post('/admin', (req, res) => {
  const { question, answer, option1, option2, option3, option4 } = req.body;
  console.log(req.body);
    const jeePhy1 = mongoose.model('jeePhy1', Question.schema );          
    jeePhy1.create({
    year: req.body.year,
    video1: req.body.video1,
    video2: req.body.video2,
    video3: req.body.video3,
    textsolution: req.body.textsolution,
    imagesolution: req.body.imagesolution,
    question: question,
    answer: answer,
    option1: option1,
    option2: option2,
    option3: option3,
    option4: option4,
    answer: answer,
  }).then(() => {
    res.render('admin.ejs', {
      message: "question added successfully"
    });
  }).catch((err) => {
    console.log("error in adding question", err);
    return res.status(500).json({
      "message": "error in adding question"
    });
  });
});


app.get('/test', async(req,res)=> {
let question = req.query.question;
const title = question.substring(0,6 );
let collection_folder = question.split('.')[0];
let chapter_num = collection_folder.split('y')[1];
let question_num = parseInt(question.split('.')[1], 10);
let chapter_name="";
if(chapter_num=='1'){
  chapter_name= "UNITS AND DIMENTION"
}
else if(chapter_num=='2'){
  chapter_name="1-D kinemetics"
}

let data_array=[];
const data = mongoose.models[collection_folder] || mongoose.model(collection_folder, Question.schema);
data_array = await data.find().exec();
res.render('jee_content/test.ejs',{title,data_array,question_num,chapter_name,});
});

app.listen(port, () => {
  console.log(`server is running at ${port}`)
})