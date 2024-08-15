const mongoose=require("mongoose");

const bookSchema=mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{
    versionKey:false,
    timestamps:true
})


const Bookmodel=mongoose.model("Book",bookSchema);

module.exports=Bookmodel;