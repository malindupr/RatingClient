import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Rating from "./Rating"; 
import SelectQuestion from "./SelectQuestion";
import AdminPage from "./AdminPage"; // Import AdminPage component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Rating />} /> 
                <Route path="/select-question" element={<SelectQuestion />} />
                <Route path="/admin" element={<AdminPage />} /> {/* New Admin Page Route */}
            </Routes>
        </Router>
    );
}

export default App;
