const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    roles: { type: String, enum: ["CREATOR", "VIEWER", "VIEW_ALL"], required: true }
},{
    versionKey:false,
    timestamps:true
})

const UserModel=mongoose.model("User",userSchema);

module.exports=UserModel;