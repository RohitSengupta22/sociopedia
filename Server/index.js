import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middlewares/auth.js";
import {createPost} from "./controllers/posts.js";
//configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"));
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));




//file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


//Routes
app.post('/auth/register', upload.single("picture"), register)
app.post('/posts',verifyToken, upload.single("picture"), createPost)
app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use('/posts',postRoutes)

//Mongoose setup

const PORT = process.env.PORT || 3006;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    app.listen(PORT, () => console.log(`Server is listen at ${PORT}`))
}).catch((error) => console.log(error))
