import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  name : {type: String, required: true},
  rating: {type: Number, required: true, default:0},
  comment: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
},
{
  timestamps: true
})

const productSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel'},
  name: {type: String, required: true},
  image: {type:String},
  img: {data: Buffer, contentType: String},
  brand: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String, required: true},
  rating: {type: Number, default:0, required:true,},
  numReviews: {type: Number, required: true , default:0},
  price: {type: Number, required: true, default: 0 },
  countInStock: {type: Number, required: true, default:0},
  reviews: [reviewSchema]

},{
  timestamps: true
})

const ProductModel = mongoose.model('ProductModel', productSchema );

export default ProductModel;