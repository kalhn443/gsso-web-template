import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import {LoginComponent} from "./Components/login/LoginComponent.jsx";
import {ToastContainer} from "react-toastify";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "login",
        element: <LoginComponent/>
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ToastContainer position="bottom-right" hideProgressBar={true} />
      <RouterProvider router={router} />
  </React.StrictMode>,
)
