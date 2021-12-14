const jwt = require("jsonwebtoken");
const Student = require("../src/Schemas/Studentschema")

const Sauth = async(req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Student.findOne({_id:verifyUser._id})
        res.locals.User = user;
        req.id = user._id;
        next();
    }catch(err){
        res.render("Login_Page")
    }
}
module.exports = Sauth ;