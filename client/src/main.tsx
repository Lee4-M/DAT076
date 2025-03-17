import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './routes/LoginScreen.tsx'
import Register from './routes/RegisterScreen.tsx'
import App from './routes/App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
                <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/budget" element={<App />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
