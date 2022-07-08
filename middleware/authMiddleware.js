import UserModel from "../models/userModel.js";
import { decodedToken } from "../utils/genToken.js";

export const protect = async (req, res, next) => {
  try {
    let token, id
    let auth = req.headers && req.headers.authorization;
    if (auth && auth.startsWith('Bearer')){
      token = auth? auth.split(' ')[1] : ''
      
      id = decodedToken(token)
    }
    if (id){
      req.user = await UserModel.findById(id).select('-password')
      if (req.user){
        next();
      }else {res.status(400).json({message: 'unathorized user'})}
    } else {res.status(400).json({message: 'unathorized user'})}
  } catch (error) {
    res.status(400).json({meessage: 'Could not authencate user'})
  }
}

export const adminProtect = async(req, res, next) =>{
  try {
    if (req.user.isAdmin) {
      next();
    } else{
      res.status(400).json({message: 'Unauthorized User(only admins)'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}