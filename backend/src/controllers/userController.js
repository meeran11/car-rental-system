import { 
    createUserAndProfileService, 
    getUserByNameService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,    
    deleteUserService
} from '../models/userModel.js';
import { updateCustomerInfoService, getCustomerByUserIdService } from '../models/customerModel.js';
import { updateStaffInfoService, getStaffByUserIdService } from '../models/staffModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handerResponse from '../utils/handerResponse.js';


export const createUser = async (req, res, next) => {
  const { username, password, role, secretKey, name, phone, driverLicense } = req.body;

  try {
    // Basic validation
    if (!username || !password || !role || !name || !phone) {
      return handerResponse(res, 400, "username, password, role, name and phone are required");
    }

    if (!["customer", "staff"].includes(role)) {
      return handerResponse(res, 400, "Role must be 'customer' or 'staff'");
    }

    if (role === "staff" && secretKey !== process.env.STAFF_SECRET_KEY) {
      return handerResponse(res, 403, "Invalid staff secret key");
    }

    // Validate phone shape (11 digits)
    if (!/^[0-9]{11}$/.test(phone)) {
      return handerResponse(res, 400, "phone must be exactly 11 digits");
    }

    // driverLicense required for customer
    if (role === "customer" && (!driverLicense || driverLicense.length > 20)) {
      return handerResponse(res, 400, "driverLicense is required for customers and max 20 chars");
    }

    const result = await createUserAndProfileService({
      username,
      password,
      role,
      name,
      phone,
      driverLicense: driverLicense ?? null,
    });
    return handerResponse(res, 201, "User and profile created successfully", result);
  } catch (err) {
    if (err.code === "23505") {
      return handerResponse(res, 409, "Duplicate value. Possibly username, phone or driver license already exists.");
    }
    // Unexpected
    next(err);
  }
};

export const loginUser = async (req,res,next) => {
    const { username, password, role } = req.body;

  try {
    const user = await getUserByNameService(username,role);

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

 
    const token = jwt.sign(
      {
        id: user.userid,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userid: user.userid,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
}
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
export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, password} = req.body;

    try {

        // Build fields object
        const fields = { username, password};

        // Remove undefined values
        Object.keys(fields).forEach(key => {
            if (fields[key] === undefined || fields[key] === "") {
                delete fields[key];
            }
        });

        const updatedUser = await updateUserService(id, fields);

        if (!updatedUser) {
            return handerResponse(res, 404, "User not found");
        }

        return handerResponse(res, 200, "User updated successfully", updatedUser);

    } catch (error) {
        next(error);
    }
};

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

export const updateCustomerInfo = async (req, res, next) => {
    const { id } = req.params;
    const { customerName, customerPhone, driverLicense } = req.body;

    try {
        // Validate phone if provided
        if (customerPhone && !/^[0-9]{11}$/.test(customerPhone)) {
            return handerResponse(res, 400, "Phone must be exactly 11 digits");
        }

        // Validate driverLicense if provided
        if (driverLicense && driverLicense.length > 20) {
            return handerResponse(res, 400, "Driver license must be max 20 characters");
        }

        // Build fields object with only provided values
        const fields = { customerName, customerPhone, driverLicense };
        Object.keys(fields).forEach(key => {
            if (fields[key] === undefined || fields[key] === "") {
                delete fields[key];
            }
        });

        const updatedCustomer = await updateCustomerInfoService(id, fields);

        if (!updatedCustomer) {
            return handerResponse(res, 404, "Customer not found");
        }

        return handerResponse(res, 200, "Customer information updated successfully", updatedCustomer);

    } catch (error) {
        if (error.code === "23505") {
            return handerResponse(res, 409, "Phone or driver license already exists");
        }
        next(error);
    }
};

export const getCustomerInfo = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id || isNaN(id)) {
            return handerResponse(res, 400, "Invalid user ID");
        }
        const customer = await getCustomerByUserIdService(id);
        if (!customer) {
            return handerResponse(res, 404, "Customer not found");
        }
        handerResponse(res, 200, "Customer information retrieved successfully", customer);
    } catch (error) {
        next(error);
    }
};

export const updateStaffInfo = async (req, res, next) => {
    const { id } = req.params;
    const { staffName, staffPhone } = req.body;

    try {
        // Validate phone if provided
        if (staffPhone && !/^[0-9]{11}$/.test(staffPhone)) {
            return handerResponse(res, 400, "Phone must be exactly 11 digits");
        }

        // Build fields object with only provided values
        const fields = { staffName, staffPhone };
        Object.keys(fields).forEach(key => {
            if (fields[key] === undefined || fields[key] === "") {
                delete fields[key];
            }
        });

        const updatedStaff = await updateStaffInfoService(id, fields);

        if (!updatedStaff) {
            return handerResponse(res, 404, "Staff not found");
        }

        return handerResponse(res, 200, "Staff information updated successfully", updatedStaff);

    } catch (error) {
        if (error.code === "23505") {
            return handerResponse(res, 409, "Phone already exists");
        }
        next(error);
    }
};

export const getStaffInfo = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id || isNaN(id)) {
            return handerResponse(res, 400, "Invalid user ID");
        }
        const staff = await getStaffByUserIdService(id);
        if (!staff) {
            return handerResponse(res, 404, "Staff not found");
        }
        handerResponse(res, 200, "Staff information retrieved successfully", staff);
    } catch (error) {
        next(error);
    }
};
