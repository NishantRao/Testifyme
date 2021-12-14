const express = require("express");

const router = express.Router();

const Student = require("../src/Schemas/Studentschema");
const Teacher = require("../src/Schemas/Teacher_schema");

const Tauth = require("../Middleware/auth");
const Sauth = require("../Middleware/Sauth")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../src/Schemas/Studentschema");
const store = require("store");

router.get("/",(req,res) =>{
    res.render("Student_login");
});


router.get("/Sregister",(req,res) =>{
    res.render("Student_Register");
})

router.post("/Sregister",async(req,res) =>{
    try{
        if (req.body.Confirm == req.body.Password){
            const User = new Student({
                Username: req.body.Username,
                Email : req.body.Email,
                Phoneno : req.body.Phoneno,
                Password : req.body.Password,
                Confirm : req.body.Confirm
            })
            const token = await User.generatetoken();

            res.cookie("jwt",token)
            const re = await User.save();
            res.redirect("../")

        }else{
            console.log("Please enter correct details");
        }

    }catch(err){
        res.status(400).send(err)
    }
})

router.get("/Tlogin",(req,res)=>{
    res.render("Teacher_login");
})

router.get("/Tregister",(req,res) =>{
    res.render("Teacher_Register");
})

router.post("/Tregister",async(req,res) =>{
    try{
        if (req.body.Confirm == req.body.Password){
            const Tuser = new Teacher({
                Username: req.body.Username,
                Email : req.body.Email,
                Subject : req.body.Subject,
                Class_Code : req.body.Class_Code,
                Phoneno : req.body.Phoneno,
                Password : req.body.Password,
                Confirm : req.body.Confirm
            })
            const token = await Tuser.generatetoken();

            res.cookie("jwt",token)
            const re = await Tuser.save();
            res.redirect("../Tlogin")

        }else{
            console.log("Please enter correct details");
        }

    }catch(err){
        res.status(400).send(err)
    }
})

router.post("/Slogin",async(req,res) =>{
    try{
        const entry = await Student.findOne({Username:req.body.Username});
        if (entry==null){
            res.send("Please Enter Correct Details")

        }else{
            const matchpass = await bcrypt.compare(req.body.Password,entry.Password);
            // **************jwt token 
            const token = await entry.generatetoken();

            res.cookie("jwt",token)
            if (matchpass){
                res.redirect("/studentdashboard");
            }else{
                res.send("Please enter Correct Details")
            }
        }
    }catch(err){
        console.log(err);
    }
});


router.post("/Tlogin",async(req,res) =>{
    try{
        const entry = await Teacher.findOne({Username:req.body.Username});
        if (entry==null){
            res.send("Please Enter Correct Details")

        }else{
            const matchpass = await bcrypt.compare(req.body.Password,entry.Password);
            // **************jwt token 
            const token = await entry.generatetoken();

            res.cookie("jwt",token)
            if (matchpass){
                res.redirect("/TDashboard");
            }else{
                res.send("Please enter Correct Details")
            }
        }
    }catch(err){
        console.log(err);
    }
})

router.get("/Aboutus",(req,res) =>{
    res.render("AboutUs");
})

router.get("/TDashboard",Tauth ,(req,res) =>{
    res.render("Teacher_dashboard");
})

router.get("/admin/addNotes",Tauth,(req,res) =>{
    res.render("Admin_Add_Test");
})

router.post("/pin",Tauth, async(req,res) =>{
    const curt = await Teacher.findOne({_id:req.id});
    const pin = req.body.Testpin;
    curt.tests = curt.tests.concat({Testpin:pin})
    await curt.save();
    res.redirect(`/CreateQues/${pin}`);
})

router.get('/CreateQues/:pin',Tauth,(req,res) =>{
    const pin = req.params.pin;
    res.render("Create_Ques",{pin :pin});
})

router.post("/CreateQues/:pin",Tauth,async(req,res) =>{
    const pin = req.params.pin;
    const Curuser = await   Teacher.findOne({_id: req.id});
    var curindex =-1;
    // console.log(Object.keys(Curuser.tests));
    for (let i = 0; i < Curuser.tests.length; i++) {
        if (pin === Curuser.tests[i].Testpin){
            curindex = i;
        }
    }

    let Quesobj = {
        Ques : req.body.Ques,
        A : req.body.A,
        B : req.body.B,
        C : req.body.C,
        D : req.body.D,
        Ans : req.body.Ans
    }
    Curuser.tests[curindex].questions = Curuser.tests[curindex].questions.concat(Quesobj);
    await  Curuser.save();
    res.send("Ques accepted")
})

router.get("/studentdashboard",Sauth,(req,res) =>{
    console.log(" S dashboard");
    res.render("Student_dashboard");
})

router.post("/joinclass",Sauth, async(req,res) =>{
    const Curstudent = await Student.findOne({_id : req.id});
    let x =1;
    for (let i =0 ;i<Curstudent.Classes.length;i++){
        if (Curstudent.Classes[i].classpin === req.body.Class_code){
            x=0;
            break
        }
    }
    if (x==1){
        Curstudent.Classes = Curstudent.Classes.concat({classpin : req.body.Class_code});
        await Curstudent.save();
    }
    res.redirect("/myclasses");
})

router.get("/myclasses",Sauth,async(req,res) =>{
    const Curstudent = await Student.findOne({_id : req.id});
    
    let  classes = [];
    for (let i =0 ;i<Curstudent.Classes.length;i++){
        const cur_teacher = await Teacher.findOne({Class_Code : Curstudent.Classes[i].classpin})
        classes.push(cur_teacher);
    }
    res.render("Joined_Classes",{classes : classes})
})

router.get("/:classcode/entertest",Sauth,(req,res) =>{
    const cur_classcode = req.params.classcode;
    res.render("Enter_test",{classcode : cur_classcode})
})

router.post("/:classcode/Test",Sauth,async(req,res) =>{
    const cur_classcode = req.params.classcode;
    const User_pin =  req.body.Testpin;
    const cur_teacher = await Teacher.findOne({Class_Code:cur_classcode});
    for (let i = 0; i < cur_teacher.tests.length; i++) {
        if (User_pin === cur_teacher.tests[i].Testpin){
            res.render("Show_Ques",{ques: cur_teacher.tests[i].questions})
        }
    }
    // res.send()
})




// ********************** Multer 

// const multer = require("../Middleware/multer");
// router.post("/Upload")
// var mongoose = require("mongoose");
// var multer = require('multer');
// var upload = multer({ dest: 'Uploads/' });
// var bodyparser = require("body-parser");
// var app = express();


// // mongoose.connect("connection-string");
// app.use(bodyparser.json());

// router.post('/Upload',multer.array('file') ,function (req, res, next) {
//     console.log(req.files);
//     res.send("File getted")
// });


module.exports = router ;