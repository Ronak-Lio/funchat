const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin')

const {JWT_SECRET} = require('../config/keys')


router.get('/' , (req, res) => {
    res.send('Hello')
});





router.post('/signup' , (req, res) => {
const {name , email , password , pic} = req.body;

    if(!email || !password || !name){
        return res.status(422).json({error : "Please add all the fields"})
    }

    User.findOne({email : email}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "User with that email already exists"})
        }
            bcrypt.hash(password , 12).then(hashedpassword => {

                console.log("Hashed password" , hashedpassword);

                const user = new User({
                    email,
                    password : hashedpassword,
                    name, 
                    pic
                })

                console.log("User is " , user);
                 
                user.save().then(user => {
                    res.json({message : "Successfully saved"})

                })
                .catch(err => {
                    console.log(err)
                })
            })
        
    }).catch(err => {
        console.log(err)
    })
});






router.post('/signin' , (req, res)=> {


    console.log("Req Body is " , req.body);


    const {email , password} = req.body;


    if(!email || !password){
        return res.status(422).json({error : "please add email or password"})
    }

    User.findOne({email : email}).then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email or password"})
        }

        bcrypt.compare(password , savedUser.password).then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id : savedUser._id }, JWT_SECRET);
                const {_id,name , email , chats , pic} = savedUser
                res.json({token , user : {_id ,name , email , chats , pic}})
            }else{
                return res.status(422).json({error : "Invalid password"})
            }
        }) 
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router