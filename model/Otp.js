import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobile: { type: String },
    code: { type: String },
    expireIn: { type: Number },
  });
  
  const OtpModel = mongoose.model("otp", otpSchema);
  
  export default OtpModel;
