import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import ReactDOM from 'react-dom/client'; // Add this line
import { ShopContextProvider } from './context/ShopContext';


ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
<ShopContextProvider>
<App />
</ShopContextProvider>
  
</BrowserRouter>,

)
