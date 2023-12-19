import { check } from "express-validator";

export const validatePassword = [
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long")
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/)
    .withMessage("Password must contain at least one special character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];
