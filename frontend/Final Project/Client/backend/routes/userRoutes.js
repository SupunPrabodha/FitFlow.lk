import express from "express";
import { loginUser, registerUser, adminLogin, updateUser, deleteUser, listUsers, updatePaymentStatus, sendAcceptanceEmail } from "../controllers/userController.js";
import multer from 'multer';
import path from 'path';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const userRouter = express.Router();

userRouter.post('/register', upload.single('paymentReceipt'), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.put('/update', updateUser);
userRouter.delete('/delete', deleteUser);
userRouter.get('/list', listUsers);
userRouter.post('/payment-status', updatePaymentStatus);
userRouter.post('/send-acceptance-email', sendAcceptanceEmail);

export default userRouter;
