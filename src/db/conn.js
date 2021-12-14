const mongoose = require("mongoose")
mongoose.connect(process.env.Database)
.then(console.log("Database Connected"))
.catch((err) =>{
    console.log(err);
})