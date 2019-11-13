const express=require('express');
const path=require('path');
var mongoose = require('mongoose');
const bodyParser=require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db=mongoose.connection;

db.once('open', function(){
  console.log('connected to mongodb');
});

db.on('error',function(err){
  console.log(err);
});

const app=express();


let Article =require('./models/article');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));


//home route
app.get('/',function(req,res){
 /*let articles = [
   {
     id:1,
     title:'article one',
     author:'brad traversy',
     body:'this is article one'
   },
   {
     id:2,
     title:'article two',
     author:'brad traversy',
     body:'this is article two'
   },
   {
     id:3,
     title:'article three',
     author:'brad traversy',
     body:'this is article three'
   }

 ];*/
  Article.find({}, function(err,articles){

if(err){
  console.log(err);

}else{
  console.log("Check articles:-");
  console.log(articles);
  res.render('index',{
    title:'Articles',
    articles: articles
  });
}
});


});



app.get('/articles/add',function(req,res){
  res.render('add_articles',{
    title:'Add Article'
  });
});


app.post('/articles/add',function(req,res){
    let article=new Article();
    //console.log(req.body.title);
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        res.redirect('/');
      }
    });

});

app.listen(3000,function(){
  console.log('server start on port 3000');

});
