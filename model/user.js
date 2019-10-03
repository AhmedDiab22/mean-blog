const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const JWT = require('jsonwebtoken');
const config = require('../config/database')


let emailLengthChecker = (email) =>{
    if(!email){
        return false
    }else{
        if(email.length < 5 || email.length > 30 ){
            return false
        }else{
            return true
        }
    }
};
let validEmailChecker = (email) =>{
    if(!email) {
        return false
    }else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ;
        return regExp.test(email);
    }
};
let usernameLengthCheker = (username) =>{
    if(!username){
        return false;
    }else{
        if(username.length < 8 || username.length > 15){
            return false;
        }else{
            return true
        }
    }
};
let passwordLengthCheker = (password) =>{
    if(!password){
        return false;
    }else{
        if(password.length < 8 || password.length > 35){
            return false;
        }else{
            return true
        }
    }
};

let validateUsername = (username) =>{
    if(!username){
        return false
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username)
    }
};
let validatePassword = (password) =>{
    if(!password){
        return false
    }else{
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password)
    }
};
const usernameVlaidator = [
    {
        validator :usernameLengthCheker , msg : 'username must bs at least 8 chars but no more than 15'
    },
    {
        validator : validateUsername,
        message : 'Username must not have any specail cahrs'
    }
];
const emailVlaidator = [
    {
        validator : emailLengthChecker , msg : 'Email must bs at least 5 chars but no more than 30'
    },
    {
        validator : validEmailChecker,
        message : 'must be a valid email'
    }
];
const passwordVlaidator = [
    {
        validator : passwordLengthCheker , msg : 'password must bs at least 8 chars but no more than 35'
    },
    {
        validator : validatePassword,
        message : 'must have at least one uppercase , lowercase , special chars and number '
    }
];
const userShema = new Schema({
    email : {type : String , unique : true , required : true , lowercase : true , validate : emailVlaidator},
    username : { type : String , unique : true , required : true , lowercase : true , validate : usernameVlaidator  },
    password : { type : String , required : true  , validate : passwordVlaidator}
});

userShema.methods.generateToken = function (){
    const token = JWT.sign({user_id : this._id } , config.secret , {expiresIn : '24h'});
    return token
}

userShema.pre('save' , function(next){
    if(!this.isModified('password'))
    return next

    bcrypt.hash(this.password , null , null , (err , hash)=>{
        if (err) return next(err);
        this.password = hash;
        next()
    })
})
userShema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password , this.password);
}
module.exports = mongoose.model('UserAngular' , userShema);