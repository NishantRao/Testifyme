const express = require('express');
const app = express()
const path = require('path')
var hbs = require('hbs');
const port = process.env.PORT || 2000;
const adminRoutes = require('./routes/adminRoute.js')


app.use(express.json())

hbs.registerPartials(__dirname + '/templates/partials');

app.set('view engine' , 'hbs');
app.set('views' , path.join(__dirname ,'/templates/views'))
app.use(express.static('public'))

app.get('/' , (req,res)=>{
    res.render('teacherRegister.hbs')
})

app.get('/adminHome' , (req,res)=>{
    res.render('dashboard.hbs')
})


app.use('/admin' , adminRoutes)

app.listen(port ,() =>{console.log(`App running from ${port} port`)})
