var express = require('express');
var app = express();

//setup lowdb 
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
db = low(adapter);
db.defaults({users: []}).write();
var shortid = require('shortid');

var bird = require('./routes/user.route');
var port = 3000;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// setup view engine
app.set('view engine','pug');
app.set('views','./views')

app.get('/',function(request,response){
    response.render('index',{
        // truyen bien qua index.pug de su dung
        name: 'My friend'
    })
})

app.get('/users',(req,res)=>{
    res.render('users/index',{
        users: db.get('users').value()
    })
})

app.get('/users/search',(request,response)=>{
    var q = request.query.q;

    var users = db.get('users').value().filter((user)=>{
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    response.render('users/index',{
        users: users
    })
})

app.get('/user/:id',(req,res)=>{
    var id = req.params.id;
    var user = db.get('users').find({ id: id}).value();
    res.render('users/view',{
        user: user
    })
})


app.get('/users/create',(req,res)=>{
    res.render('users/create');
})

app.post('/users/create',(req,res)=>{
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write();
    res.redirect('/users');
})

app.use('/bird',bird);

app.listen(port,function(){
    console.log("App listen on port " + port);
})

