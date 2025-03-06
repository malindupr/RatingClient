import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Rating.css";

function Rating() {
    const [rating, setRating] = useState(null);
    const [password, setPassword] = useState("");
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [question, setQuestion] = useState("Loading...");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get("http://localhost:5000/selected-question");
                if (response.data && response.data.questions) {
                    setQuestion(response.data.questions);
                } else {
                    setQuestion("No question found.");
                }
            } catch (error) {
                console.error("Error fetching question:", error);
                setQuestion("Error fetching question.");
            }
        };

        fetchQuestion();
    }, []);

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (rating === null) {
            alert("Please select a rating.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/add", { rating });
            alert(response.data.message);
            setRating(null);
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Something went wrong"));
        }
    };

    const handleAdminClick = () => {
        setShowPasswordPrompt(true);
    };

    const handlePasswordSubmit = () => {
        const correctPassword = "123";
        if (password === correctPassword) {
            navigate("/admin");
        } else {
            alert("Incorrect password!");
            setPassword("");
        }
    };

    return (
        <div className="rating-container">
            <h1>Diamond Cutters Limited</h1>
            <h2>{question}</h2> {/* Shows the selected question */}
            <div className="emoji-rating">
                {["😡", "☹️", "😐", "😊", "😁"].map((emoji, index) => (
                    <span
                        key={index}
                        className={`emoji ${rating === index + 1 ? "selected" : ""}`}
                        onClick={() => handleRating(index + 1)}
                    >
                        {emoji}
                    </span>
                ))}
            </div>
            <p>Your rating: {rating !== null ? rating : "Not selected"}</p>
            <button className="SubmitBtn" onClick={handleSubmit}>
                Submit Rating
            </button>

            {/* Admin Button */}
            <button className="AdminBtn" onClick={handleAdminClick}>
                Admin Page
            </button>

            {/* Password Prompt */}
            {showPasswordPrompt && (
                <div className="password-prompt">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordSubmit}>Submit</button>
                    <button onClick={() => setShowPasswordPrompt(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Rating;
