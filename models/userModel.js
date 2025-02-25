import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    isAccountVerifed: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    routeId:{type:String,required:true}
});

const userModel = mongoose.model('user', userScheme);

export default userModel;
