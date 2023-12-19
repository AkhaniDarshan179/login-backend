import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  age: { type: String },
  experience: { type: String },
  language: { type: String },
});

const EmployeeModel = mongoose.model("employee", employeeSchema);

export default EmployeeModel;
