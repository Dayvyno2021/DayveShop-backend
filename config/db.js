import mongoose from 'mongoose';

export const connectDb = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    })
    
    console.log(`MongoDB is Connected to ${conn.connection.host}`.underline.cyan)
      
    } catch (error) {
      console.error(`MongoDb Error: ${error.message}`.underline.red.bold)
      process.exit(1)
  }
}