import express from 'express'
import { FormatDocument } from '../controllers/print.js'
let printRoutes = express.Router()

printRoutes.post('/format' , FormatDocument)

export {printRoutes}
