const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/database');
const cors = require('cors');
const port = process.env.PORT || 3200;
const authentication = require('./routes/authentications');
const blogs = require('./routes/blog');
const path = require('path')



app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
app.use(express.json());
app.use(cors());
app.use('/authenticate' , authentication);
app.use('/blogs' , blogs);


mongoose.connect(config.uri , { useNewUrlParser: true }).then(()=>{
    console.log('mongo db has been worked successfully');
    
}).catch((err)=>{   
    console.log('Has been error occured');
})

app.get('*' , (req , res)=>{
    res.sendFile(path.join(__dirname +  '/dist/index.html'));
})


app.listen(port , ()=>{
    console.log(`server runninng on ${port}...`);
});

