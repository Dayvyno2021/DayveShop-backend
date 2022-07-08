import express  from "express";
import cors from 'cors';
import morgan from 'morgan'
import colors from 'colors';
import dotenv from 'dotenv';
import {connectDb} from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import orderRoutes from './routes/orderRoutes.js';
dotenv.config();

connectDb();
const app = express();

if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res)=>{
  res.send('Website is working');
})

app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes)

app.get('/api/config/paypal', (req, res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID)
})

// console.log(process.env.PAYPAL_CLIENT_ID)

app.use(notFound);
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => 
console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.rainbow));