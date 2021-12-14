const jwt = require("jsonwebtoken");
const Teacher = require("../src/Schemas/Teacher_schema")

const Tauth = async(req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Teacher.findOne({_id:verifyUser._id})
        res.locals.User = user;
        req.id = user._id;
        next();
    }catch(err){
        res.render("Login_Page")
    }
}
module.exports = Tauth ;