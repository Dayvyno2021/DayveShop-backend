import express from "express";
import { 
  adminEditUser, 
  deleteUser, 
  login, 
  makeUserAnAdmin, 
  register, 
  updateUser, 
  userList, 
  userProfile 
} from "../controllers/usercontroller.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
const router = express.Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').get(protect, userProfile);
router.route('/update/:id').post(protect, updateUser);
router.route('/userslist').get(protect, adminProtect, userList);
router
  .route('/userslist/:id')
  .get(protect, adminProtect, adminEditUser)
  .put(protect, adminProtect, makeUserAnAdmin)
  .delete(protect, adminProtect, deleteUser);

export default router;