const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{        // provide id to the users
        type:String,
        required:true,
        unique:true,
    },
    redirectURL:{
        type:String,
        required:true,
    },
    visitHistory:[{timestamp:{type:Number}}], // number of click count
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    }
  },
  {timestamps:true}
);

const URL = mongoose.model("url",urlSchema); // name of model :- url

module.exports = URL;