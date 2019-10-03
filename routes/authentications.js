const User = require('../model/user');
const express = require('express');
const router = express.Router();
const config = require('../config/database');
const JWT = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.post('/register' , (req , res)=>{
    if(!req.body.email){
        return res.status(200).json({success : false , msg : 'Email not provided'});
    }else{
        if(!req.body.username){
            return res.status(200).json({success : false , msg : 'username not provided'});
        } else{
            if(!req.body.password){
                return res.status(200).json({success : false , msg : 'password not provided'});
            }else{
                let user = new User({
                    email : req.body.email.toLowerCase(),
                    username : req.body.username.toLowerCase(),
                    password : req.body.password,
                });
                user.save((err)=>{
                    if(err){
                        if(err.code === 11000){
                            return res.status(200).send('username or email has been already exists..');
                        }else{
                            if(err.errors){
                                if(err.errors.email){
                                    return res.status(200).json({success : false , msg : err.errors.email.message});
                                }else{
                                    if(err.errors.username){
                                        return res.status(200).json({success : false , msg : err.errors.username.message});
                                    }else{
                                        if(err.errors.password){
                                            return res.status(200).json({success : false , msg : err.errors.password.message});
                                        }else{
                                            return res.status(200).json({success : false , msg : err
                                            });
                                        }
                                    }
                                }
                            }
                            else{
                                return res.status(200).json({success : false , msg : 'could not save the user' , err
                            })     
                            }
                        }
                    }else{
                        const token =  user.generateToken();
                        return res.status(200).json({success : true , user : user.username , token : token })
                    }
                })
            }
        } 
    }
})


// router.get('/checkEmail/:email' , (req, res)=>{
//     if(!req.body.email){
//         res.json({success : false , msg : 'Email was not provided'})
//     }else{
//         User.findOne({email : req.params.email} , (err , user)=>{
//             if(err){
//                 return res.status(200).json({success : false , msg : err})
//             }else{
//                 if(user){
//                     return res.status(200).json({success : false , msg : 'Email is already token' })
//                 }else{
//                     return res.status(200).json({success : true , msg : 'Email is available' })
//                 }
//             }
//         })
//     }
// });


// router.get('/checkUsername/:username' , (req, res)=>{
//     if(!req.body.username){
//         res.status(200).json({success : false , msg : 'insert your username'})
//     }else{
//         User.findOne({username : req.params.username} , (err , user)=>{
//             if(err){
//                 return res.status(200).json({success : false , msg : err})
//             }else{
//                 if(user){
//                     return res.status(200).json({success : false , msg : 'username is already token' })
//                 }else{
//                     return res.status(200).json({success : true , msg : 'username is available' })
//                 }
//             }
//         })
//     }
// });


router.post('/login' , (req,res)=>{
            User.findOne({username : req.body.username } , (err , user)=>{
                if(err){
                    res.status(200).json({success : false , msg : err})
                }else{
                    if(!user){
                        res.status(404).json({success : false , msg : 'username not found'});
                    }else{
                        const validPassword = user.comparePassword(req.body.password);
                        if(!validPassword){
                            res.status(404).json({success : false , msg : 'Password Invalid'});
                        }else{
                            const token =  user.generateToken();
                            res.status(200).json({success : true , msg : 'welcome ' + user.username , token : token , user : {username : user.username }});
                        }   
                    }
                }
            })
})


// router.use((req ,res, next)=>{
//     const token = req.header('auth');
//     if(!token){
//         return res.status(401).send('Acess denied ... No Tocken protected')
//     }
//     try{
//         const user = JWT.verify( token , config.secret);
//         req.decoded = user;
        
//         next();
//     }catch(ex){
//         return res.status(400).send('Invalid Token')        
//     }
// });

// import onther Auth middleware
router.get('/profile' , auth ,  (req,res)=>{
    User.findOne({_id : req.decoded.user_id}).select('username email').exec((err, user)=>{
        if(err){
            return res.status(404).send(err)
        }else{
            if(!user){
                return res.status(404).send('User not found')
            }else{
                return res.status(200).send( { user : user })
            }
        }
    })
    
})



router.get('/profile' ,auth ,(req,res)=>{
    User.findOne({_id : req.decoded.user_id}).select('username email').exec((err, user)=>{
        if(err){
            return res.status(404).send(err)
        }else{
            if(!user){
                return res.status(404).send('User not found')
            }else{
                return res.status(200).send( { user : user })
            }
        }
    })
    
})









module.exports = router
