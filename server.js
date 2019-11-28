const express = require('express')
const app = express();
const path = require('path');
const db = require('./db')
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var session = require('express-session');
app.set('view-engine','hbs')
app.set('views','views')


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhamakp@gmail.com',
      pass: 'shikha12'
    }
})
 
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','visitors_register.html'))
})

app.post('/',(req,res) =>{
    var today = new Date()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    console.log(time)
    var dbmail = req.session.email
    console.log(dbmail)
    db.checkout(time,req.session.name)
    .then(() =>{
        db.getVisitor(dbmail)
        .then((result)=>{
            console.log("res")
            console.log(result)
            var mailOptions= {
                from: 'shubhamakp@gmail.com',
                to: result[0].email,
                subject: ' your Visit details',
                text: 'Name : '+ result[0].name + '\n'+
                        'Contact No : ' + result[0].contact +'\n'+
                        'Checkin time : '+ result[0].checkin+'\n'+
                        'Checkout time : '+ result[0].checkout+'\n'+
                        'Host name : Shubham Pandey' + '\n'+
                        'Address : Abc Company, New Delhi'
              };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              })
        })
        .catch((err)=>{
            console.log(err)
            //res.send(err)
        })
        
          res.redirect('/')
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname,'views','/login.html'));
})

app.post('/add',(req,res) => {

    db.createTable()
   
    db.addNewVisitor(req.body.name, req.body.email, req.body.phone, req.body.checkin)
    .then(()=>{
        var mailOptions= {
            from: 'shubhamakp@gmail.com',
            to: 'pandeysonisp@gmail.com',
            subject: 'Visitors details',
            text: 'Name : '+ req.body.name + '\n'+
                   'Email Id : '+ req.body.email +'\n'+
                    'Contact No : ' + req.body.phone +'\n'+
                    'Checkin time : '+ req.body.checkin
          };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.redirect('/login')
    })
    .catch((err)=>{
        res.send(err)
    })
})


app.get('/home', function(request, response) {
    let details = [{name : request.session.name}]
	if (request.session.loggedin) {
        response.render('checkout.hbs',{details})
	} else {
		response.send('Please login to view this page!');
	}
})

app.post('/auth', (request, response) => {	
    var name = request.body.name;
    var email = request.body.email;
    console.log(request.body)
    
	if (name && email) {
        db.userlogin(name,email)
        .then(()=>{
            console.log("inside if")
            request.session.loggedin = true;
            request.session.name = name;
            request.session.email = email;
            response.redirect('/home');

        })
        .catch((err)=>{
            console.log("inside else eror")
            response.redirect('/login')
        })
	} else {
        console.log("inside last else err")
        response.send('error')
		
	}
})



app.listen(4000)