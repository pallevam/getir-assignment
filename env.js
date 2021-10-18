import path from 'path'
import dotenv from 'dotenv'
const __dirname = path.resolve();
const endFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`
const pathToEnvFile = path.resolve(__dirname, endFileName)
dotenv.config({ path: pathToEnvFile })