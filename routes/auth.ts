import  path from 'path';
import  express from 'express';
import  {registerUser, resetPassword, forgotPassword, getUserProfile , updateUserProfile,deleteUser} from '../controllers/auth';
import  authenticateUser from '../middlewares/authMiddleware';

const router = express.Router();

// for registering a new User {{ WORKING FINE }}
router.post('/register', registerUser);

// Login user and issue JWT token {{ WORKING FINE }}
router.post('/login', registerUser);

router.post('/resetPassword', resetPassword)

router.post('/forgotPassword', forgotPassword)

// need to place it right to use the below protected routes and set userId in req object
router.use(authenticateUser)

// get user profile (requires authentication) {{ WORKING FINE }}
router.get('/profile', getUserProfile);

// update user profile (requires authentication) {{ WORKING FINE }}
router.put('/profile', updateUserProfile)

// delete user profile (requires authentication) 
router.delete('/profile', deleteUser)



export default router;