const {v4: uuidv4} = require("uuid"); // send to user uid or cookies or made session
const User = require("../models/user");
const {setUser} = require("../service/auth");

async function handleUserSignUp(req,res) {
    const{name,email,password} = req.body;
    await User.create({
        name,
        email,
        password,
    })
    return res.redirect("/");
}
async function handleUserLogin(req,res) {
    const{email,password} = req.body;
    const user = await User.findOne({email,password});
    if(!user)
    return res.render("login", {
    error:"Invalid userName or Password",
    });

    //const sessionId = uuidv4(); // create a session for user if login is okay
    const token = setUser(user); //setUser help to set the uid of users
   // res.cookie("uid",token); // name of cookies:-uid / it generate or create a cookies value for user
    res.cookie("token",token); // name of cookie: token
    return res.redirect("/"); 
}

module.exports={
    handleUserSignUp,
    handleUserLogin,
}