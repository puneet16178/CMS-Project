const router=require('express').Router()
const regc=require('../controllers/regcontroller')
const reg = require('../models/reg')

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}

router.get('/dashboard',handlelogin,regc.admindashboard)

router.get('/usersmanagement',handlelogin,regc.adminusers)

router.get('/userstatusupdate/:id',handlelogin,regc.userstatusupdate)

router.get('/userdelete/:id',regc.userdelete)

router.get('/roleupdate/:id',regc.roleupdate)
module.exports=router