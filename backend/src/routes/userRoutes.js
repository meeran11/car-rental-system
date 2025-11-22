import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateCustomerInfo,
    getCustomerInfo,
    updateStaffInfo,
    getStaffInfo
} from '../controllers/userController.js';
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUser)
router.get('/users',auth,authorizeRoles('staff'), getAllUsers);
router.get('/users/:id',auth,getUserById); 
router.put('/users/:id',auth,updateUser);
router.delete('/users/:id',auth,deleteUser);

// Customer profile routes
router.get('/customer/:id', auth, getCustomerInfo);
router.put('/customer/:id', auth, updateCustomerInfo);

// Staff profile routes
router.get('/staff/:id', auth, authorizeRoles('staff'), getStaffInfo);
router.put('/staff/:id', auth, authorizeRoles('staff'), updateStaffInfo);
    
export default router;