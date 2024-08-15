const express = require("express");
const Bookmodel = require("../model/book.model");
const authorizeRoles = require("../middleware/authorizeRoles.middleware");

const bookRouter = express.Router();

bookRouter.post("/",authorizeRoles("CREATOR"),async (req, res) => {
  const { title, author } = req.body;
  try {
    const book = await Bookmodel.findOne({ title });
    if (book) {
      return res
        .status(200)
        .json({ Message: "This book already exists in our database" });
    }
    const newBook = new Bookmodel({
      title,
      author,
      createdBy:req.user.user._id
    });
    await newBook.save();
    res
      .status(200)
      .json({ Message: "Your book is added to the database", Book: newBook });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

bookRouter.get("/",authorizeRoles(["CREATOR","VIEW_ALL","VIEWER"]),async(req,res)=>{
 const {old,new:isNew}=req.query;
 try {
  let query={};
  const now=new Date();
  if(old){
    query.createdAt={$lte: new Date(now.getTime()-10*60000)};
  }else if(isNew){
    query.createdAt = { $gt: new Date(now.getTime() - 10 * 60000)};
  }
  if(req.user.user.roles.includes(['VIEW_ALL','CREATOR'])){
    const books=await Bookmodel.find(query).populate('VIEWER');
    if(!books){
      return res.status(404).json("Book not found...")
    }
    res.status(200).json({"Book":books});
  }else if(req.user.user.roles.includes('VIEWER','CREATOR')){
    query.createdBy=req.user.user._id;
    const books=await Bookmodel.find(query).populate('createdBy');
    if(!books){
      return res.status(404).json({"Message":"Book not found..."});
    }
    res.status(200).json({"Book":books});
  }else if(req.user.user.roles.includes('CREATOR')){
    query.createdBy=req.user.user._id;
    const books=await Bookmodel.find(query).populate('createdBy');
    if(!books){
      return res.status(404).json({"Message":"Book not found..."});
    }
    res.status(200).json({"Book":books});
  }
 } catch (error) {
  res.status(400).json({"Message":error.message})
 }
})


bookRouter.delete('/:id',authorizeRoles('CREATOR'),async(req,res)=>{
  try {
    const book=await Bookmodel.findOneAndDelete({_id:req.params.id,createdBy:req.user.user._id});
    if (!book) return res.status(404).json({ message: 'Book not found or not authorized to delete' });
    res.status(200).json({ "Message": 'Book deleted',"Deleted Book":book });
  } catch (error) {
    res.status(400).json({"Message":error.message})
  }
})
module.exports = bookRouter;
