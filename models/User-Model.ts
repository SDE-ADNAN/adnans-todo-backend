import mongoose, { CallbackError } from 'mongoose';
import bcrypt from "bcrypt";
import TodoItem from '../Types/TodoTypesInterfaces';

// Define the interface representing the user document
export interface IUser extends mongoose.Document {
  userName: string;
  password: string;
  email: string;
  picUrl: string;
  bio: string;
  location: string;
  website: string;
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  todos: mongoose.Types.ObjectId[] | TodoItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the user
const userSchema = new mongoose.Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picUrl: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    social: {
      twitter: String,
      facebook: String,
      instagram: String,
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (error ) {
    const errorF = error as CallbackError
    next(errorF);
  }
});

// Define the User model based on the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
