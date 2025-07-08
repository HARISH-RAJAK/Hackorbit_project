
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', (req, res) => {
 res.render('landing.ejs');
});

app.get('/login', (req, res) => {
 res.render('login.ejs');
});

app.get('/register', (req, res) => {
 res.render('register.ejs');
});

app.get('/home', (req, res) => {
 res.render('home.ejs');
});

app.get('/renting',(req,res)=>{
    res.render('renting.ejs');
});

app.get('/cropinfo',(req,res)=>{
    res.render('cropinfo.ejs');
});

app.get('/schemes',(req,res)=>{
    res.render('schemes.ejs');
});

app.get('/importexport',(req,res)=>{
    res.render('importExport.ejs');
});

app.get('/profile',(req,res)=>{
    res.render('profile.ejs');
});

app.get('/workers',(req,res)=>{
    res.render('workers.ejs');
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
