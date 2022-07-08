import UserModel from '../models/userModel.js';
import { genToken } from '../utils/genToken.js';

//desc: register new user;
//route: post /api/register;
//access: public;

export const register = async(req, res) => {
  try {

    const {name, email, password} = req.body;

    if (!name || !email || !password) return res.status(400).json({message: 'All Fields are required'})
    
    const user = await UserModel.findOne({email}).exec()

    if (user) return res.status(400).json({message: 'User Already exists'})

    const newUser = await UserModel.create({
      name,
      email,
      password
    })
    if (newUser){
      return res.json({
        id : newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: genToken (newUser._id),
        isAdmin: newUser.isAdmin
      })
    } else {
      res.status(400).json({message: 'Could not register user'})
    }
      
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? '' : error
    res.status(404).json({
      message: `Server Error ===> ${m}`
    })
  }
}

//Desc: User Login
//route: /api/user/login
//access: public

export const login = async(req, res) => {
  try {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email}).exec();
    if (user){
      const auth = await user.matchPassword(password);
        if (auth){
          return res.json({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: genToken(user._id),
            id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          })
        }  else {res.status(400).json({message: 'password does not match'})}

    } else{res.status(400).json({message: 'Could not find user'})}

    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? '' : error
    res.status(404).json({
      message: `Server Error==> ${m}`
    })
  }
}

//desc: get profile;
//route: /api/user/profile
//access //protected

export const userProfile = async (req, res) =>{
  try {
    if (req.user){
      res.json(req.user)
    } else{
      res.status(400).json({message: 'Unauthorized user'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? '' : error
    res.status(404).json({
      message: `Server Error ===> ${m}`
    })
  }
}

//desc: post: Update user details;
//route: /api/user/:id;
//access: protected

export const updateUser = async(req, res) =>{
  try {
    const id  = req.params.id;
    const {name, password} = req.body;
    const user = await UserModel.findById(id)
    if (user) {
      user.name = name || user.name;
      user.password = password || user.password
      const update = await user.save();
      if (update){
        return res.json({
          name: update.name,
          email: update.email,
          id: update._id,
          isAdmin: update.isAdmin,
          token: genToken(update._id),
          createdAt: update.createdAt,
            updatedAt: update.updatedAt
        })
      }
      res.status(400).json({message: 'Could not retrieve new update'})
    } else{
      res.status(400).json({message: 'Could not find user'})
    }

  } catch (error) {
    const m = process.env.NODE_ENV === 'production' ? null : error;
    res.status(404).json({message: `Server Error ===> ${m}`})
  }
}

//desc: get: Get List of registered Users;
//route: /api/user/userlist;
//access: protected

export const userList = async(req, res)=>{
  try {
    const users = await UserModel.find({}).select('-password');
    if (users){
      res.json(users)
    } else{
      res.status(404).json({message: 'Couldn\'t find list of users'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===>${m}`})
  }
}

//desc: get: Get a single User;
//route: /api/user/userlist/:id;
//access: protected, adminProtected

export const adminEditUser= async(req, res)=>{
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (user){
      res.json(user)
    } else{
      res.status(400).json({message: 'Could not find user'})
    }

  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===>${m}`})
  }
}

//desc: put: put a single User;
//route: /api/user/userlist/:id;
//access: protected, adminProtected
export const makeUserAnAdmin = async(req, res) =>{
  try {
    const {admin} = req.body;

    const user = await UserModel.findById(req.params.id).select('-password');
    if (user){
      user.isAdmin = admin;
      const updatedUser = await user.save();
      if (updatedUser){
        return res.json('successful')
      } 
      return res.status(400).json({message: 'Could not update user'})
    } else {
      return res.status(400).json({message: 'Could not find user'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===>${m}`})
  }
}

//desc: delete: delete a single User;
//route: /api/user/userlist/:id;
//access: protected, adminProtected
export const deleteUser = async(req, res)=>{
  try {
    const delUser = await UserModel.findByIdAndDelete(req.params.id);
    if (delUser){
      res.json('success');
    } else{
      res.status(400).json({message: 'Could not find user'})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===>${m}`})
  }
}