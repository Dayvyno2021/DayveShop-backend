import express from 'express';
import { adminDelProduct, 
  allProducts, 
  editProduct, 
  highlyRatedProducts, 
  newproduct, 
  productImage, 
  productReview, 
  singleProduct 
} from '../controllers/productController.js';

import formidableMiddleware from 'express-formidable';
import { protect, adminProtect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(allProducts);
router.route('/:id').get(singleProduct);
router.route('/add/new-product').post(protect, adminProtect, formidableMiddleware(), newproduct);
router.route('/edit/:id').put(protect, adminProtect, formidableMiddleware(), editProduct);
router.route('/get/:id').get(productImage);
router.route('/delete/:id').delete(protect, adminProtect, adminDelProduct);
router.route('/review/:id').post(protect, productReview);
router.route('/highly-rated/products').get(highlyRatedProducts);

export default router