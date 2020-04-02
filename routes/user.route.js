var express =  require('express');
var router =  express.Router();
var db = require('../db');
var shortid = require('shortid');

router.get('/',(req,res)=>{
    var users = db.get('users').value();
    res.render('users/index',{
        users: users
    })
})
router.get('/create',(req,res)=>{
    res.render('users/create');
})
router.post('/create',(req,res)=>{
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write();
    res.redirect('/users');
})
router.get('/:id',(req,res)=>{
    var id = req.params.id;
    var user = db.get('users').find({ id: id}).value();
    console.log(user)
    res.render('users/view',{
        user: user
    })
})


router.get('/search',(request,response)=>{
    var q = request.query.q;

    var users = db.get('users').value().filter((user)=>{
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    response.render('users/index',{
        users: users
    })
})





module.exports = router;
