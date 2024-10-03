// middleware to check the user have uid or not // to check authenticity before send the req to the server.
const {getUser} = require("../service/auth");

function checkForAuthentication(req,res,next){
    //const authorizationHeaderValue = req.headers["authorization"]; // headers use for response
    const tokenCookie = req.cookies?.token;
    req.user=null;
    if
    (
        // !authorizationHeaderValue || 
        // !authorizationHeaderValue.startsWith("Bearer")
        !tokenCookie
    )// as we know authorizationHeaderValue must start with bearer
    return next();
    // if have autherization value so validate it with getUser
    //const token = authorizationHeaderValue.split("Bearer ")[1]; // const value = "Bearer 83689467406"; // value.split("Bearer "); // [',',83689467406] // so find token throught index 1;
    const token = tokenCookie;
    const user = getUser(token);
    req.user=user;
    return next();
}

// check authorization for specific role of user :- Admin User, Normal user (user restriction)
function restrictTo(roles=[]){
    return function(req,res,next){            // A closure in JavaScript is a function that has access to the variables of its parent function, even after the parent function has finished executing. This is because a closure is created when a function is defined within another function, and the inner function retains access to the outer function's variables.          
        if(!req.user) return res.redirect("/login");

        if(!roles.includes(req.user.roles)) return res.end("Unauthorized"); // logged in but not access a perticular role..

        return next();
    }
}
// async function restrictToLoggedinUserOnly(req,res,next) {
//     const userUid = req.cookies?.uid; // here see that user conatin a uid or not in cookies

//     if(!userUid) return res.redirect("/login");// if not having uid
//     const user = getUser(userUid);
//     if(!user) return res.redirect("/login"); // if it is not user
//     req.user = user;
//     next();
// }

// async function checkAuth(req,res,next) { // this is only for to check the user logged or not (not forcefully that to must have logged before working)
//     const userUid = req.cookies?.uid; 

//     const user = getUser(userUid);
//     req.user = user;
//     next();
// }
module.exports={
    // restrictToLoggedinUserOnly,
    // checkAuth,
    checkForAuthentication,
    restrictTo,
}