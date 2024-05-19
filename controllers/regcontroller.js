const Reg=require('../models/reg')
const nodemailer=require('nodemailer')

exports.loginpage=(req,res)=>{
    res.render('login.ejs',{message:''})
}

exports.login=async(req,res)=>{
    const {email,pass}=req.body
    const emailcheck=await Reg.findOne({email:email})
    if(emailcheck){
        if(emailcheck.password===pass){
            if(emailcheck.status=='suspended' & emailcheck.email!=='admin@gmail.com'){
                res.render('login.ejs',{message:'Your account is suspended'})
            }else{
                req.session.isAuth=true
                req.session.username=email
                req.session.role=emailcheck.role
                if(emailcheck.email=='admin@gmail.com'){
                    res.redirect('/admin/dashboard')
                }else{
                    res.redirect('/userprofile')
                }
            }
            
        }else{
            res.render('login.ejs',{message:'Wrong Password'})
        }
        
    }else{
        res.render('login.ejs',{message:'Email Id does not exists'})
    }
}

exports.regpage=(req,res)=>{
    res.render('reg.ejs',{message:'',css:''})
}

exports.register=async(req,res)=>{
    const {us,pass}=req.body
    const emailcheck=await Reg.findOne({email:us})
    
    
    try{
        if(emailcheck==null){
            const record=new Reg({email:us,password:pass})
            record.save()
            res.render('reg.ejs',{message:'successfully created',css:'alert alert-success'})
        }else{
            res.render('reg.ejs',{message:'email already exists',css:'alert alert-danger'})
        }
        
    }catch(error){
        res.render('reg.ejs',{message:error.message})

    }
}

exports.userprofile=async(req,res)=>{
    const loginname=req.session.username
    const record=await Reg.find({img:{$nin:['defaultimg.jpg']}})

    res.render('usersprofile.ejs',{loginname,record})
}

exports.logout=(req,res)=>{
    req.session.destroy()
    res.redirect('/')
}

exports.forgotpage=(req,res)=>{
    res.render('forgotform.ejs',{message:''})
    
}

exports.forgotlinksend=async(req,res)=>{
    const {email}=req.body
    let testAccount=await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "puneetyadav1290@gmail.com",
    pass: "gyyy pngf dfzb zgzp",
  },
});
console.log('Connected to SMPT server')
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "puneetyadav1290@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Password reset link : Content Management System ", // Subject line
    text: "To reset your password click on the given link below", // plain text body
    html: `<a href=http://localhost:5000/changepassword/${email}>Click here to change password</a>`, // html body
    //attachment:[{path:filepath}]
  });

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  
}

main().catch(console.error);
res.render('forgotform.ejs',{message:'Password resent link has been sent to your mail'})
}


exports.passwordresetform=(req,res)=>{
    res.render('resetform.ejs',{message:''})
}

exports.resetpasswordchange=async(req,res)=>{
    const {pass}=req.body
    //console.log(pass)
    const email= req.params.email
    const record=await Reg.findOne({email:email})
    //console.log(record)
    const id=record.id
    await Reg.findByIdAndUpdate(id,{password:pass})
    console.log(record.password)
    res.render('passwordchangemessage.ejs',{message:'password updated, Please login again'})
}


exports.admindashboard=(req,res)=>{
    //console.log(req.session)
    const username=req.session.username
    res.render('admin/dashboard.ejs',{username})
}

exports.adminusers=async(req,res)=>{
    const username=req.session.username
    const record=await Reg.find() 
    res.render('admin/users.ejs',{username,record,message:''})
}

exports.userstatusupdate=async(req,res)=>{
    const id=req.params.id
    const record1=await Reg.findById(id)
    let currentStatus=null
    if(record1.status=='suspended'){
        currentStatus='active'
    }else{
        currentStatus='suspended'
    }
    await Reg.findByIdAndUpdate(id,{status:currentStatus})
    const username=req.session.username
    const record=await Reg.find() 
    res.render('admin/users.ejs',{username,record,message:'Successfully updated'})
}


exports.profileupdatepage=async(req,res)=>{
    const loginname=req.session.username
    const record=await Reg.findOne({email:loginname})
    res.render('profileupdateform.ejs',{loginname,record,message:''})
}

exports.profileupdate=async(req,res)=>{
    const loginname=req.session.username
    const {fname,lname,mobile,about}=req.body
    const user=await Reg.findOne({email:loginname})
    const id=user.id
    if(req.file){
        const filename=req.file.filename
        await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,desc:about,img:filename})
    }else{
        await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,mobile:mobile,desc:about})
    }
    const record=await Reg.findOne({email:loginname})
    res.render('profileupdateform.ejs',{loginname,record,message:'Successfully Profile Updates'})
}


exports.userdelete=async(req,res)=>{
    const id=req.params.id
    await Reg.findByIdAndDelete(id)
    const username=req.session.username
    const record=await Reg.find() 
    res.render('admin/users.ejs',{username,record,message:'Successfully deleted'})
}

exports.usersingledata=async(req,res)=>{
    const id=req.params.id
    const record=await Reg.findById(id)
    const loginname=req.session.username
    res.render('singleprofile.ejs',{loginname,record})
}

exports.roleupdate=async(req,res)=>{
    const id=req.params.id
    const record1=await Reg.findById(id)
    let newrole=null
    if(record1.role=='free'){
        newrole='subscribed'
    }else{
        newrole='free'
    }
    await Reg.findByIdAndUpdate(id,{role:newrole})
    const username=req.session.username
    const record=await Reg.find() 
    res.render('admin/users.ejs',{username,record,message:'Role Successfully updated'})
}