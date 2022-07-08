import bcrypt from 'bcryptjs';

let salt = bcrypt.genSaltSync(10);

const users = [
  {
    name: 'Admin1',
    email: 'admin1@gmail.com',
    password: bcrypt.hashSync('123456', salt) ,
    isAdmin : true
  },
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: bcrypt.hashSync('123456', salt),
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@gmail.com',
    password: bcrypt.hashSync('123456', salt)
  },
]

export default users;