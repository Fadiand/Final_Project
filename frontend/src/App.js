import React from "react";
import InstaButton from "./componets/InstagramLoginButton"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componets/NavBar";
import VISTA from "./componets/VISTA";
import About from "./componets/About";
import Gallery from "./componets/Gallery";
import Contact from "./componets/Contact";
import Fidbek from "./componets/Fidbek";
import TryMeOnGallery from "./componets/TryMeOnGallery"; 


function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<VISTA />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Gallery" element={<Gallery />} />
                    <Route path="/TryMeOnGallery" element={<TryMeOnGallery />} /> 
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/Fidbek" element={<Fidbek />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
        