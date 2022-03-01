require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const {Schema} = mongoose;

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

   //for encryption purpose
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });  //for encryption purpose

const User = mongoose.model('User', userSchema);


app.get('/',(req, res)=>{
    res.render('home');
});

app.get('/login',(req, res)=>{
    res.render('login');
});

app.get('/register',(req, res)=>{
    res.render('register');
});

/////getting data from the client and storing in the database. i.e, register and save new users as they fill in the form///

app.post('/register', (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
});

//post request for login so registered users can login//

app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});










app.listen(3000,()=>{
    console.log('server is running...')
})