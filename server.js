const express= require('express');
const app=express();
app.use(express.urlencoded({extended:false}))
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser:true, useUnifiedTopology:true
})
const shortUrl=require('./models/shortUrl')
app.set('view engine', 'ejs');
app.post("/shortUrls",async(req,res)=>{
await shortUrl.create({
    full:req.body.fullUrl
})
res.redirect('/');
})
app.get('/', async(req,res)=>{
   const urls= await shortUrl.find();
   res.render('index',{shortUrls:urls});
});

app.get('/:shortUrl', async(req,res)=>{
    const foundurl=await shortUrl.findOne({short:req.params.shortUrl})
    if(foundurl==null)
    {
        return res.sendStatus(404);
        
    }
    foundurl.clicks++;
    foundurl.save();
    res.redirect(foundurl.full);
})
app.listen(process.env.PORT||5000);