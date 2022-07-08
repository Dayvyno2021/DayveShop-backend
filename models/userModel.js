import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name : {type: String, required: true},
  email : {type: String, required:true, unique:true},
  password: {type: String, required:true},
  isAdmin: {type:Boolean, required: true, default: false}
},
  {timestamps : true}
)

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compareSync(enteredPassword, this.password)
}

userSchema.pre('save', async function(next){
  if (!this.isModified('password')){
    next()
  } else{
    let salt =await bcrypt.genSaltSync(10);
    this.password =await bcrypt.hashSync(this.password, salt)
  }

})

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;