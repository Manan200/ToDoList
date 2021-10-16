const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = 4000

app.set('view engine','ejs')
app.use(express.static('static'))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/todoDB')

const itemSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model('Item',itemSchema)

const item1 = new Item({
    name: "Wake up at 7 a.m.",
})
const item2 = new Item({
    name: "Take a Bath",
})
const item3 = new Item({
    name: "Have breakfast",
})

const arr = [item1,item2,item3]

app.get('/',(req,res)=>{
    Item.find({},(err,data)=>{
        if(data.length==0){
            Item.insertMany(arr,(err)=>{
                if(err)
                  console.log('err')
                else
                  console.log('Items successfully saved to Database!');  
            })
            res.redirect('/')
        }
        else{
            res.render('list',{newListItems: data}) 
        }
    })
    
})

app.post('/',(req,res)=>{
    const itemName = req.body.n;
    const item = new Item({
       name: itemName
    })
    item.save()
    res.redirect('/')
})

app.post('/delete',(req,res)=>{
    const check = req.body.checkbox;
    Item.findByIdAndRemove(check,(err)=>{
        if(!err){
            console.log('Successfully deleted!');
            res.redirect('/')
        }
    })
})

app.listen(process.env.PORT || port,()=>{
    console.log(`App is listening on port ${port}`);
})