import EmployeeModel from "../model/Employee.js";

const createEmployee = async (req, res) => {
  const { name, email, age, experience, language } = req.body;

  const existingEmployee = await EmployeeModel.findOne({ email });

  if (existingEmployee) {
    return res.status(409).json({
      message: "Employee already register.",
    });
  }

  const newEmployee = new EmployeeModel({
    name,
    email,
    age,
    experience,
    language,
  });
  await newEmployee.save();
  res.status(201).json({
    message: "Employee added successfully!",
  });
};

const getAllEmployee = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      // Handle unauthenticated user
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const employees = await EmployeeModel.find();
    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server error",
    });
  }
};

export default {
  createEmployee,
  getAllEmployee,
};
