import{
    createStaffService 
} from '../models/staffModel.js';

const handerResponse = (res,status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
}

const creatStaff = async(res, req, next) => {
    const { staffname, staffphone } = req.body; 
    try {
        const newStaff = await createStaffService({ staffname, staffphone });
        handerResponse(res, 201, "Staff created successfully", newStaff);
    } catch (error) {
        next(error);
    }   
}