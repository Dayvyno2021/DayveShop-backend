import express from 'express';
import { allOrders, createOrder, markOrderAsPaid, myOrderDelete, myOrders, orderDetails, orderPay } from '../controllers/orderControllers.js';
import {adminProtect, protect} from '../middleware/authMiddleware.js'
const router = express.Router();


router.route('/create').post(protect, createOrder);
router.route('/:id').get(protect, orderDetails);
router.route('/:id/paid').put(protect, orderPay);
router.route('/orders/my-orders').get(protect, myOrders);
router.route('/my-order/delete/:id').delete(protect, myOrderDelete);
router.route('/orderlist/getorders').get(protect, adminProtect, allOrders);
router.route('/:id/delivery').put(protect, adminProtect, markOrderAsPaid);

export default router;

