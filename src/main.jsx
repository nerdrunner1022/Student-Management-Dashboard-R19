import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './styles/toast.css'
import App from './App.jsx'
import CustomToastContainer from './components/ToastNotification'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <CustomToastContainer />
  </StrictMode>,
)