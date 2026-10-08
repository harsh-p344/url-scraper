import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import summaryRoutes from './routes/summaryRoutes.js'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(currentDir, '../.env') })

const app = express()
const port = Number(process.env.PORT) || 5000
app.use(express.json({ limit: '16kb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/summaries', summaryRoutes)
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.statusCode || 500).json({ error: error.message || 'Something went wrong while creating your summary.' })
})

app.listen(port, () => console.info(`Briefly API listening at http://localhost:${port}`))
