import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VISTA from "./componets/VISTA";
import About from "./componets/About";
import Gallery from "./componets/Gallery";
import Contact from "./componets/Contact";
import Fidbek from "./componets/Fidbek";
import ModelTest from "./componets/ModelTest"; 
import RootLayout from "./componets/Root";
import SignUp from "./componets/SignUp";
import LogIn from "./componets/LogIn";
import Admin from "./componets/Admin";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { path: '/', element: <VISTA /> },
                { path: '/home', element: <VISTA /> },
                { path: '/signUp', element: <SignUp /> },
                {path: '/LogIn', element: <LogIn />},
                { path: '/About', element: <About /> },
                { path: '/Gallery', element: <Gallery /> },
                { path: '/Model_Test', element: <ModelTest /> },
                { path: '/Contact', element: <Contact /> },
                { path: '/Fidbek', element: <Fidbek /> },
                {path: '/admin-dashboard', element: <Admin />}
            ],
        },
    ]);
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
        