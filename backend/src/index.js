import express from 'express'
import cors from 'cors'
import todoRoutes from './routes/todoRoutes.js'

export const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRoutes)

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Error starting server:', error)
    }
}

startServer()