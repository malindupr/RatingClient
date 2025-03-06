import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SelectQuestion.css"; // Import the CSS file

function SelectQuestion() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/questions");
                if (response.data) {
                    setQuestions(response.data);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    const handleSelect = (event) => {
        setSelectedQuestionId(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedQuestionId) {
            alert("Please select a question.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/select-question", {
                id: selectedQuestionId,
            });

            alert(response.data.message);
            navigate("/"); // Navigate back to Rating page
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Something went wrong"));
        }
    };

    return (
        <div className="select-question-container">
            <h1>Questions</h1>
            <div>
                <label htmlFor="question">Choose a question:</label>
                <select id="question" value={selectedQuestionId} onChange={handleSelect}>
                    <option value="">Select a question...</option>
                    {questions.map((question) => (
                        <option key={question.id} value={question.id}>
                            {question.questions}
                        </option>
                    ))}
                </select>
            </div>
            <button className="select-question-btn" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}

export default SelectQuestion;
