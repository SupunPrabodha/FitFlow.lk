import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, Alert, Paper } from "@mui/material";
import { FaRobot } from "react-icons/fa";
import { GoogleGenAI } from "@google/genai";


const ReplyRequest = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [trainerName, setTrainerName] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generatingReply, setGeneratingReply] = useState(false);

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;


    const ai = new GoogleGenAI({ apiKey: apiKey });

    const generateAIReply = async () => {
        if (!request) return;
        
        setGeneratingReply(true);
        try {
            const prompt = `As a professional fitness trainer, generate a personalized workout plan reply for a client with the following details:

            Client Information:
            - Name: ${request.name}
            - Email: ${request.email}
            - Phone: ${request.phone}
            - Fitness Goal: ${request.goal}
            - Preferred Workout Days: ${request.preferredDays}
            ${request.additionalInfo ? `- Additional Information: ${request.additionalInfo}` : ''}

            Please generate a comprehensive workout plan that includes:
            1. A personalized greeting addressing the client by name
            2. A brief acknowledgment of their fitness goal
            3. A structured workout plan for their preferred days, including:
            - Warm-up exercises
            - Main workout exercises with sets, reps, and rest periods
            - Cool-down exercises
            4. Specific form tips and modifications based on their goal
            5. A motivational closing message

            Keep the tone professional but encouraging, and ensure the plan is tailored to their specific goals and preferences. Do not include any other text than the workout plan.
            Do not include any placeholders like [Name] or [Goal]. Write it in the first person perspective.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });

            setReplyMessage(response.text);
        } catch (error) {
            console.error('Error generating AI reply:', error);
            setError('Failed to generate AI reply. Please try again.');
        } finally {
            setGeneratingReply(false);
        }
    };
    
    const fetchRequestDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/requests/${id}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setRequest(data);
        } catch (err) {
            setError("Failed to fetch request details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/reply`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: request.email,
                    trainerName: trainerName, // Use the trainer name from input
                    replyMessage: replyMessage,
                    date: new Date().toISOString(), // Ensure date is in ISO format
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit reply");
            }

            // Update request status
            await fetch(`http://localhost:3000/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'replied' }),
            });

            navigate("/trainer-dashboard");
        } catch (err) {
            setError("Failed to submit reply. Please try again.");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3} maxWidth="800px" mx="auto">
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 600,
                color: "#2d3748",
                mb: 4
            }}>
                Reply to Request
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Request Details
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Name:</strong> {request?.name}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Email:</strong> {request?.email}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Goal:</strong> {request?.goal}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Preferred Days:</strong> {request?.preferredDays}
                </Typography>
                {request?.additionalInfo && (
                    <Typography variant="body1" paragraph>
                        <strong>Additional Info:</strong> {request?.additionalInfo}
                    </Typography>
                )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <form onSubmit={handleReplySubmit}>
                    <TextField
                        fullWidth
                        label="Trainer Name"
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Reply Message"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        required
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <Box display="flex" gap={2} mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                backgroundColor: "#e53e3e",
                                "&:hover": {
                                    backgroundColor: "#c53030",
                                },
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Send Reply
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={generateAIReply}
                            startIcon={<FaRobot />}
                            disabled={generatingReply}
                            sx={{
                                borderColor: "#4299e1",
                                color: "#4299e1",
                                "&:hover": {
                                    backgroundColor: "rgba(66, 153, 225, 0.1)",
                                    borderColor: "#3182ce",
                                },
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {generatingReply ? "Generating..." : "Generate AI Reply"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ReplyRequest;
