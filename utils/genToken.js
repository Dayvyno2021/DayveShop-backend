import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const jwt = jsonwebtoken;

//CREATE TOKEN
export const genToken = (id) => {
  const token = jwt.sign({
    data: id
  }, process.env.JWT_SECRET, { expiresIn: '30 days' });

  return token
}


//DECODE TOKEN
export const decodedToken = (token) => {
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.data
}
