import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VISTA from "./componets/VISTA";
import About from "./componets/About";
import Gallery from "./componets/Gallery";
import Contact from "./componets/Contact";
import Fidbek from "./componets/Fidbek";
import ModelTest from "./componets/ModelTest"; 
import RootLayout from "./componets/Root";
import GoogleLoginButton from "./componets/GoogleLoginButton";
import SignUp from "./componets/SignUp";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { path: '/', element: <VISTA /> },
                { path: '/home', element: <VISTA /> },
                {path: '/signUp', element: <SignUp />},
                { path: '/About', element: <About /> },
                { path: '/Gallery', element: <Gallery /> },
                { path: '/Model_Test', element: <ModelTest /> },
                { path: '/Contact', element: <Contact /> },
                { path: '/Fidbek', element: <Fidbek /> },
                {path: '/GoogleLogin', element: <GoogleLoginButton />}
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
        