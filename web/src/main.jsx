import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import {LoginComponent} from "./Components/login/LoginComponent.jsx";
import {ToastContainer} from "react-toastify";
import {NotfoundComponent} from "./Components/404/NotfoundComponent.jsx";
import {RegisterComponent} from "./Components/register/RegisterComponent.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "login",
        element: <LoginComponent/>
    },
    {
        path: "register",
        element: <RegisterComponent/>
    },
    {
        path: "*",
        element: <NotfoundComponent/>
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ToastContainer position="bottom-right" hideProgressBar={true} />
      <RouterProvider router={router} />
  </React.StrictMode>,
)
