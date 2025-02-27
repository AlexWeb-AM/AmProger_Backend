import mongoose from "mongoose"

const postScheme = new mongoose.Schema({
    name:{type:String,required:true},
    text:{type:String,required:true},
    img:{type:String,required:true},
    likesNumber:{type:Number,default:0},
    comments:{type:Array,default:[]},
    isSaved:{type:Boolean,default:false},
})

 const postModel = new mongoose.model('post',postScheme)

export default postModel;