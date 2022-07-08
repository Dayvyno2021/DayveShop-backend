import ProductModel from "../models/productModel.js";
import fs from 'fs';

//@desc Fetch all products
//@route GET /api/products
//@access public

export const allProducts = async(req, res) => {
  try {
    const {filter, pageNumber} = req.query;
    const page = Number(pageNumber) || 1;
    const pageSize = 6;
    const searchInput = filter? {
      name: {$regex: filter, $options: 'i'}
    }
    : 
    {}

    const count = await ProductModel.count({...searchInput})
    const allProducts = await ProductModel.find({...searchInput})
      .select('-img')
      .limit(pageSize)
      .skip(pageSize*(page-1));
    if (allProducts){
      // return res.json(allProducts)
      return res.json({allProducts, pages:Math.ceil(count/pageSize), pageNumber})
    } else {
      res.status(404).json({message: 'Products not found'})
    }

  } catch (error) {
    res.status(400).json({
      message: 'could not find products',
      errorM: process.env.NODE_ENV === 'development'? error : null
    })
  }
}

export const singleProduct = async(req, res) =>{
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product){
      res.json(product)
    } else {
      res.status(400).json({message: 'product not found1'})
    }
    
    
  } catch (error) {
    res.status(404).json({
      message: 'product not found2',
      errorM : process.env.NODE_ENV==='production'? null : error
    })
  }
}

//@desc create new Product
//@route POST /api/products/add/new-product
//@access private protect/admin

export const newproduct = async(req, res) =>{
  try {
    const files = req.files;
    const fields = req.fields;
    if ((files && files.image && files.image.size) > 220000){
      return res.status(400).json({message: 'Max image size=200kb'})
    } else{
      const product = await new ProductModel({
        user: req.user._id,
        name: fields.name || '',
        brand: fields.brand || '',
        category: fields.category || '',
        description: fields.description || '',
        price: fields.price || 0,
        countInStock: fields.stockCount || 0
      })
      if (files && files.image){
        product.img.data = fs.readFileSync(files.image.path);
        product.img.contentType = files.image.type;
        await product.save();
        return res.json(product)
      } else{
        return res.status(400).json({message: 'Add image file'})
      }
    } 
    
  } catch (error) {
    const m = process.env.NODE_ENV==='production'? null: error;
    res.status(404).json({
      message: `Server Error===> ${m}`
    })
  }
}

//@desc get img
//@route POST /api/products/get/:id
//@access public

export const productImage = async(req, res)=>{
  try {
    const product = await ProductModel.findById(req.params.id)
    if ((product && product.img && product.img.data) !== null){
      res.set('Content-Type', product.img.contentType)
      res.send(product.img.data)
    } else{
      res.status(400).json({message: 'Could not find image'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV==='production'? null: error
    res.status(404).json({message: `Server Down===> ${m}`})
  }
}

//@desc edit Product by Admin
//@route POST /api/products/edit/:id
//@access private protect/admin

export const editProduct = async(req, res) =>{
  try {
    const files = req.files;
    const fields= req.fields;
    const product = await ProductModel.findById(req.params.id)

    if (files && files.image && files.image.size >210000){
      res.status(400).json({message: "max file size=200kb"})
    }else{
      if (product){
        product.name = fields.name || '';
        product.brand = fields.brand || '';
        product.category = fields.category || '';
        product.price = fields.price || 0;
        product.description = fields.description || '';
        product.countInStock = fields.stockCount || 0;
        product.image = ''

        if (files && files.image && files.image.size <=210000){
          product.img.data = fs.readFileSync(files.image.path);
          product.img.contentType = files.image.type;
        }

        await product.save((err, result)=>{
          if (err) return res.status(400).json({message: "Could not save product"})
          if (result) return res.json('success')
        });
        
      } else{
        res.status(400).json({message: 'Product not found'})
      }
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV==='production' ? null: error;
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}

export const adminDelProduct = async(req, res) =>{
  try {
    const dele = await ProductModel.findByIdAndDelete(req.params.id);
    if (dele){
      return res.json(dele)
    }
    return res.status(400).json({message: "Product not found"})
    
  } catch (error) {
    const m = process.env.NODE_ENV==='production' ? null: error;
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}

//@desc post reviews by users
//@route POST /api/products/:id/reviews
//@access private protect

export const productReview = async(req, res)=>{
  try {
    const {comment, rating} = req.body;
    let product = await ProductModel.findById(req.params.id);
    let userExists
    if (product){
      userExists = product.reviews.find((review)=>{
        return review.user.toString()===req.user._id.toString();
      })
      if (userExists){
        res.status(400).json({message: 'You already reviewed this product'})
      } else{
        const review = {
          comment,
          rating: Number(rating),
          user: req.user._id,
          name: req.user.name
        }
        product.reviews.push(review);
        product.numReviews =product.reviews.length;
        product.rating =product.reviews.reduce((acc, value)=>acc+value.rating, 0)/product.reviews.length
        const reviewedPro = await product.save();
        if (reviewedPro){
          res.json('Review successfuly added')
        } else{
          res.status(400).json({message: "Could not add review"})
        }
      }
    } else{
      return res.status(400).json({message:'Product not found'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null: error;
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}

//@desc get highly rated products
//@route get /api/products/highly-rated/products
//@access public

export const highlyRatedProducts = async(req, res)=>{
  try {
    const products = await ProductModel.find({}).sort({rating:-1}).limit(4).select('-img');
    if (products){
      res.json(products)
    } else{
      res.status(400).json({message: "Could not getb products"})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV ==='production'? null: error;
    res.status(404).json({message: `Server Error===>${m}`})
  }
}