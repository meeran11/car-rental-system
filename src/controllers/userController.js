import { 
    createUserService, 
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
} from '../models/userModel.js';

import {
    createStaffService 
} from '../models/staffModel.js';

import {
    createCustomerService
} from '../models/customerModel.js';

const handerResponse = (res,status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
}

export const createUser = async (req, res, next) => {
  const { username, password, role, secretKey, name, phone, driverLicense} = req.body;

  try {
    if (!["customer", "staff"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'customer' or 'staff'" });
    }
    
    if (role === "staff" && secretKey !== process.env.STAFF_SECRET_KEY) {
      return res.status(403).json({ error: "Invalid staff secret key" });
    }
    if(role === "staff" && secretKey === process.env.STAFF_SECRET_KEY){
        const newStaff = await createStaffService({ name,phone });
        handerResponse(res, 201, "Staff created successfully", newStaff);
    }
    if(role === "customer"){
        const newCustomer = await createCustomerService({ name, phone, driverLicense });
        handerResponse(res, 201, "Customer created successfully", newCustomer);
    }
    const newUser = await createUserService({ username, password, role });

    handerResponse(res, 201, "User created successfully", newUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async(req, res, next) => {
    try {
        const users = await getAllUsersService();
        handerResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        next(error);
    }           
}

export const getUserById = async(req, res, next) => {  
    const { id } = req.params;
    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return handerResponse(res, 404, 'User not found');
        }
        handerResponse(res, 200, 'User retrieved successfully', user);
    }
    catch (error) {
        next(error);
    }       
}
export const updateUser = async(req, res, next) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const updatedUser = await updateUserService(id, name, email);
        if (!updatedUser) {
            return handerResponse(res, 404, 'User not found');
        }
        handerResponse(res, 200, 'User updated successfully', updatedUser);
    } catch (error) {
        next(error);
    }   
}
export const deleteUser = async(req, res, next) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUserService(id);        
        if (!deletedUser) {
            return handerResponse(res, 404, 'User not found');
        }
        handerResponse(res, 200, 'User deleted successfully', deletedUser);
    } catch (error) {
        next(error);
    }
}