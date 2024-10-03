const express = require("express");
const path = require("path"); // built in module which tell the path of view file for SSR.
const {connectToMongoDB} = require("./connect");
const cookieParser = require("cookie-parser");

const URL = require("./models/url")

const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");
//const {restrictToLoggedinUserOnly,checkAuth} = require("./middleware/auth");
const {checkForAuthentication,restrictTo} = require("./middleware/auth")

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>console.log("MongoDB connected"));

app.set("view engine","ejs"); // view engine (ejs) help to do easily SSR;
app.set("views",path.resolve("./views")); // it tell about where my view file

app.use(express.json()); // middleware which parse the incoming request of body.
app.use(express.urlencoded({extended:false})); // middleware for form data which in home.ejs
app.use(cookieParser());// without add here we dont use cookies;
app.use(checkForAuthentication);

// app.get("/test",async(req,res)=>{
//   const allUrls = await URL.findOne({});
//   return res.render("home");
//   //return res.end("<h1>Hey From Server</h1>"); // SSR:-html page rendering from server without ejs(Embedded javaScript templating);
// })

//app.use("/url",restrictToLoggedinUserOnly, urlRoute); // inline middleware // restrictToLoggedinUserOnly:- here it is show if you will do any work on url then it must to logged in..if req. come to /url then this (restrictToLoggedinUserOnly) middlework only work.// also responsible for without login you cant generate the link.. 
app.use("/url",restrictTo(["NORMAL","ADMIN"]), urlRoute);  // first check authentication always then // here use authorization // here we restrict one user whose role of NORMAL in model;
app.use("/user",userRoute);
app.use("/",staticRouter);

//After generating shortId for user then user do get request for url to get web visit. 
app.get("/url/:shortId",async(req,res)=>{
    const shortId = req.params.shortId; // take userId from the user;
    const entry = await URL.findOneAndUpdate({ shortId },// query in db;
    {$push:{
        visitHistory:{
            timestamp:Date.now(),
        },
      },
    }
 );
 res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>console.log(`server started at port:${PORT}`)); //`` called literal string.

//Authentication:-
//there are two type of Authentication :- 1.Statefull :-state or data on server side
//2.Stateless :- there is no state
//client send request to the server then server transfer uid(uniqueid) session so that user authenticate with there username and password and uid so it easily access the data.
// transfer forms:- 
//1.cookies:-when interact with browser
//2.response 3.headers:-Mostly RESTAPI response with header like mobile application.
// mainly auth used with middleware when users cookies or uid valid then forward to next() otherwise reject the req. in browser. 
//Drawback of statefull:-(statefull auth use mainly for create the session time for web example banking which having small session for security purpoes)
//if server lost or state may be lost then user logged out..
//it use the server memory. hence use the stateless as JWT(json web token)(ex:serverless architecture website all made with jwt token only);
// so in stateless there is no state then which id made for user putting data store inside it(JWT tokens) then locked it so everyone read it but no authenticate to change;
//so according to the user requirement both authentication ...

// More about the cookies:-
//jo server jis domain(fb,any website) ke liye cookies bnata hai then usi ke pass vo vapas jati hai..
// cookies are domain(by default generate while sending cookies to the user) specific by default and are more secured;
// another good property which is expires(given time frame so after that user automatically logged out);(for more visit res.cookies)
//cookies accessable through browser only 
// google set domain : ".google.com" so it can accessable for each domain like www.google.com,blog.google.com..

// Send tokens through Response:-
// generate token by server and send through like res.json({token}) to user in string format.
// cookies automatically render with the token of browser to user but response json(token) not so it stored in a specific file by user.
// how user req. to the server through authorization headers:-
//here use the standard way to take as route:{headers:{Authorization:"Bearer <token>"}}; bearer is nothing but token authentication then server read the headers and remove bearer and read token; // here frontend responsible to send the token to the server