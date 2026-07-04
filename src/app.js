import express, { urlencoded } from "express";
import 'dotenv/config'
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';


const app = express()

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))


app.get('/', (req, res)=>{
     res.send('API is running🚀')
})

// Routes
app.use('/api/auth', authRoutes)

export default app