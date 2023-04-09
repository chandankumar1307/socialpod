import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoues from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/post.js';
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/Users.js';
import Post from './models/Posts.js';
import { users, posts } from './data/index.js';

/* Configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy());
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* File Storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

/* Routes with File Upload */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('file'), createPost);

/* Routes */
app.use('/auth', authRoues);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


/* Mongoose Connection */
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    // Adding data manually to mongodb but only once time else fill have redundant data
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(error.message));


