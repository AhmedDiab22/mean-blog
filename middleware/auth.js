const config = require('../config/database');
const JWT = require('jsonwebtoken');


module.exports = function (req ,res, next){
    const token = req.header('auth');
    if(!token){
        return res.status(401).send('Acess denied ... No Tocken protected')
    }
    try{
        const user = JWT.verify( token , config.secret);
        req.decoded = user;
        next();
    }catch(ex){
        return res.status(400).send('Invalid Token')        
    }
}
