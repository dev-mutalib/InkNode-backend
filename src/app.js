import express, { urlencoded } from "express";
import 'dotenv/config'
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";


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

export default app