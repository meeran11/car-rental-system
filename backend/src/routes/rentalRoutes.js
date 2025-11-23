import express from 'express';
import { createRental,getRentalHistory, getPreviousRentals,getPendingRequests,getCurrentRentals,getRequestedRentals, approveRentals,rentedCarsByUser, requestedRentalsByUser,endRental, declineRental} from '../controllers/rentalController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

//user routes
router.post('/create', auth, createRental);
router.get('/previousRentals/:id',auth, getPreviousRentals);
router.get('/currentRentals/:id',auth, getCurrentRentals);
router.get('/pendingRequests/:id',auth,getPendingRequests)

//staff routes
router.get('/pendingRequests',auth,authorizeRoles('admin','staff'),getRequestedRentals);
router.post('/approveRental',auth,authorizeRoles('admin','staff'),approveRentals);
router.post('/endRental', auth, authorizeRoles('admin','staff'), endRental);
router.post('/declineRental', auth, authorizeRoles('admin','staff'), declineRental);


export default router;
