import express from 'express'
import cors from 'cors'
import todoRoutes from './routes/todoRoutes.js'

export const app = express()
const PORT = process.env.PORT || 8000

function errorMiddleware(err, req, res, next) {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
}

app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRoutes)

app.use(errorMiddleware)

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