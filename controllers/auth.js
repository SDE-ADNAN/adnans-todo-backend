const logger = require('../logger/index')
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


// registering user
exports.registerUser = (req, res, next) => {
    const { userName, password, email, picUrl } = req.body;
  
    // checking if the user exists
    User.findOne({ $or: [{ userName }, { email }] })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(409).json({ message: 'Username or email already exists. ' });
        }
  
        const newUser = new User({
          userName: userName,
          password: password,
          email: email,
          picUrl: picUrl,
          todos: [] // Initialized an empty array for todos
        });
  
        return newUser.save();
      })
      .then((newlyCreatedUser) => {
        if (newlyCreatedUser) {
          return res.status(201).json({ message: 'User registered successfully. ' });
        }
      })
      .catch((err) => {
        console.error('Error registering user: ', err);
        return res.status(500).json({ message: 'Failed to register user. ' });
      });
  };

// Logging in the user and issuing jwt token
exports.loginUser =(req,res,next)=>{
    const {userName, password} = req.body;

    User.findOne(
        {userName}
    )
    .then((user)=>{
        if(!user){
            res.status(404).json({message:'User Not Found. '})
        }

        bcrypt.compare(password,user.password)
        .then((err,result)=>{
            if(err){
                return res.status(401).json({message:'Invalid Credentials. '})
            }
        }).catch(err=>console.error(err))

        const token = jwt.sign({userId:user._id},process.env.SECRET,)
        return res.status(200).json({message:'Login successful. ', token})
    })
    .catch(err=>{
        console.error('Error logging in user: ',err);
        return res.status(500).json({message:'Failed to Login user'})
    })
}

// Get user Profile (requires authentication)
exports.getUserProfile = (req, res) => {
    const { userId } = req;
  
    User.findById(userId)
    .populate({
        path: 'todos',
        model:'Todo', // Populate the todos field with actual Todo objects
        populate: {
          path: 'todo', // Populate the todo field inside each Todo object (subTodos)
          model: 'SubTodo' // Use the SubTodo model to populate the todo field
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not Found' });
        }
        return res.status(200).json({ user });
      })
      .catch((err) => {
        console.error('Error fetching user profile: ', err);
        return res.status(500).json({ message: 'Failed to fetch user Profile' });
      });
  };

// Update user profile (requires authentication)
exports.updateUserProfile=(req,res)=>{
    // The userId is obtained from the authentication middleware (decoded JWT)

    const {userId} = req;
    const { userName,email,picUrl} = req.body
    User.findByIdAndUpdate(
        userId,
        {userName,email,picUrl},
        {new:true}
    )
    .then((updatedUser)=>{
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found. '})
        }

        return res.status(200).json({message:'User profile updated successfully',user:updatedUser});
    })
    .catch(err=>{
        console.error('Error updating user profile: ',err);
        return res.status(500).json({message:'Failed to update user profile. '})
    })
}


// Delete user (requires authentication)
exports.deleteUser=(req,res)=>{
    // the userId is obtained from the authentication middleware (decoded JWT)
    const {userId} = req;

    User.findOneAndDelete(userId)
    .then(deletedUser=>{
        if(!deletedUser){
            return res.status(404).json({message:'User not found.'});
        }

        return res.status(200).json({message:'User deleted successfully. '});
    })
    .catch(err=>{
        console.error('Error deleting User: ',err);
        return res.status(500).json({message:'Failed to delete User.'})
    })
}