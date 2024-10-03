const shortid = require("shortid") // npm package which short the url..
const URL = require("../models/url");
async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url is required"});
    const shortID = shortid(); // character shows in new url;

    await URL.create({
        shortId:shortID,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    })
    return res.render("home",{ // it is the backend which render home page and send id;
        id:shortID
    });
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId
    const result = await URL.findOne({shortId}); //with the help of shortId query in db;
    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}