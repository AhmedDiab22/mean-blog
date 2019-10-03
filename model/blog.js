const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const JWT = require('jsonwebtoken');
const config = require('../config/database')


let titleLengthChecker = (title) =>{
    if(!title){
        return false
    }else{
        if(title.length < 5 || title.length > 30 ){
            return false
        }else{
            return true
        }
    }
};
let alphaNumeriticChecker = (title) =>{
    if(!title) {
        return false
    }else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(title);
    }
};
let bodyLengthCheker = (body) =>{
    if(!body){
        return false;
    }else{
        if(body.length < 5 || body.length > 500){
            return false;
        }else{
            return true
        }
    }
};
let commentLengthCheker = (comment) =>{
    if(!comment[0]){
        return false;
    }else{
        if(comment[0].length < 1 || comment[0].length > 200){
            return false;
        }else{
            return true
        }
    }
};

const bodyVlaidator = [
    {
        validator :bodyLengthCheker , msg : 'username must bs more than 5 chars but no more than 500'
    }
];
const titleVlaidator = [
    {
        validator : titleLengthChecker , msg : 'title must bs more 5 chars but no more than 50'
    }
];
const commentVlaidator = [
    {
        validator : commentLengthCheker , msg : 'comments may not exceed 200 char ..'
    }
];
const blogSchema = new Schema({
    title : {type: String , required : true , validate : titleVlaidator},
    body  : {type: String , required : true , validate : bodyVlaidator},
    createdBy : { type : String },
    createAt : {type : Date , default : Date.now()},
    likes :  {type: Number , default : 0},
    likedBy : {type : Array},
    dislike : {type : Number , default : 0},
    dislikedBy : {type : Array},
    comments : [
        {
            comment : {type : String , validate : commentVlaidator},
            commentator : {type : String}

        }
    ]
});

module.exports = mongoose.model('Blog' , blogSchema);