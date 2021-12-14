const mongoose = require("mongoose");

//  for validator 
const validator = require("validator");

// ******************* For bcrypt password
const bcrypt = require("bcryptjs")

// ***************** to generate token 
const jwt = require("jsonwebtoken");

const Register = new mongoose.Schema({
    Username : {
        type : String,
        unique : true ,
        required : true
    },
    Email :{
        type : String,
        unique : true ,
        required : true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    Phoneno : {
        type : Number,
        unique : true ,
        required : true,
        maxlength:10
    },
    Password : {
        type : String,
        required : true
    },
    Confirm : {
        type : String,
        required : true
    },
    tokens: [{
        token :{
            type : String,
            required : true
        }
    }],
    Classes :[{
        classpin : String
    }
    ]
})

Register.methods.generatetoken = async function() {
    try{
        const token = jwt.sign({_id : this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token});
        await this.save()
        return token ;
    }catch(err){
        console.log(err);
    }

}

Register.pre("save", async function(next){
    if (this.isModified("Password")){
        this.Password = await bcrypt.hash(this.Password,10);
        this.Confirm = this.Password
    }
    next()
})

const User = new mongoose.model("Studentuser",Register);

module.exports = User;