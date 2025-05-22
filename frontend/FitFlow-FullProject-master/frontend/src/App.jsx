import { Outlet, RouterProvider } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import router from './Router/Router';

function App() {
    return (
        <>
     <Navbar/>
      <Outlet/>
     
    </>
    );
}

export default App;
