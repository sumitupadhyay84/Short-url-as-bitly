//for session:-
//const  sessionIdToUserMap = new Map() // this is hashmap // statefull
const jwt = require("jsonwebtoken"); // Replace the session making // stateless..
const secret = "sumit!@123"; // this is the secret key of user
function setUser(user){  // this is the token for user
    //sessionIdToUserMap.set(id,user);
    return jwt.sign(
        {                    // this is payload or token which contain data(jwt.io);
            _id:user._id,
            email:user.email,
            role:user.role,
        },
        secret
    ); // generate token for user
};
function getUser(token){ // token coming from user (validate user that having uid)
    if(!token) return null;
    try{
        return jwt.verify(token,secret); // and verify token from secret key.
    }catch(error){
        return null;
    }
}
module.exports={
    setUser,
    getUser,
};