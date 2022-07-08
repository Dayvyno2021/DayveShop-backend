// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'
import users from './data/users.js';
import products from './data/products.js';
import UserModel from './models/userModel.js';
import ProductModel from './models/productModel.js';
import OrderModel from './models/orderModel.js';
import { connectDb } from './config/db.js';

dotenv.config();
connectDb();


const importData = async() => {
  try {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
    await OrderModel.deleteMany();

    const createdUsers = await UserModel.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const adminProducts = products.map((products)=> {
      return {...products, user: adminUser}
    })

    await ProductModel.insertMany(adminProducts);

    console.log('Data successfully imported'.bgGreen)
    process.exit()
    
  } catch (error) {
    console.log(`Could not import Data: ${error}`.bgRed)
    process.exit(1);
  }
}

const destroyData = async() => {
  try {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
    await OrderModel.deleteMany();
    console.log('Data destroyed'.underline.red)
  } catch (error) {
    console.error(`Could not destroy data: ${error}`.bgRed)
  }
}

if (process.argv[2] === '-d'){
  destroyData()
} else {
  importData();
}