import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Alert, CircularProgress, TextField, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaWeight, FaRuler, FaDumbbell, FaStickyNote, FaCalendarAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: theme.spacing(4),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const validationSchema = yup.object().shape({
    date: yup
        .date()
        .required("Date is required")
        .max(new Date(), "Date cannot be in the future"),
    weight: yup
        .number()
        .required("Weight is required")
        .positive("Weight cannot be negative")
        .typeError("Weight must be a number"),
    measurements: yup
        .string()
        .required("Measurements are required")
        .min(10, "Measurements must be at least 10 characters")
        .max(500, "Measurements must be less than 500 characters"),
    completedWorkouts: yup
        .string()
        .required("Completed workouts are required")
        .min(10, "Please provide more details about your workouts")
        .max(1000, "Workout details must be less than 1000 characters"),
    notes: yup
        .string()
        .max(1000, "Notes must be less than 1000 characters")
});

const SubmitProgress = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userEmail = searchParams.get('email');
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            weight: "",
            measurements: "",
            completedWorkouts: "",
            notes: ""
        }
    });

    const onSubmit = async (data) => {
        if (!userEmail) {
            setError("User email is missing");
            return;
        }

        setSubmitting(true);
        
        try {
            const response = await fetch("http://localhost:3000/progress/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    userEmail,
                    date: new Date(data.date)
                }),
            });

            const responseData = await response.json();
            
            if (!response.ok || !responseData.success) {
                throw new Error(responseData.message || "Failed to submit progress");
            }

            navigate('/trainer-dashboard');
            
        } catch (error) {
            console.error("Error submitting progress:", error);
            setError(error.message || "Failed to submit progress. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!userEmail) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error">User email is missing. Please go back and try again.</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "url('/images/sven-mieke-Lx_GDv7VA9M-unsplash.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    py: 8,
                    px: { xs: 2, md: 4 }
                }}
            >
                <Box
                    sx={{
                        maxWidth: "800px",
                        mx: "auto"
                    }}
                >
                    <StyledPaper>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                color: "#2d3748",
                                position: "relative",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -8,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "60px",
                                    height: "4px",
                                    backgroundColor: "#e53e3e",
                                    borderRadius: "2px"
                                }
                            }}
                        >
                            Submit Weekly Progress
                        </Typography>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3,
                                    borderRadius: 2
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                {...register("date")}
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: <FaCalendarAlt style={{ marginRight: 8, color: "#4a5568" }} />
                                }}
                                error={!!errors.date}
                                helperText={errors.date?.message}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                type="number"
                                {...register("weight")}
                                label="Current Weight (kg)"
                                InputProps={{
                                    startAdornment: <FaWeight style={{ marginRight: 8, color: "#4a5568" }} />
                                }}
                                error={!!errors.weight}
                                helperText={errors.weight?.message}
                                sx={{ mb: 3 }}
                                step="0.1"
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                {...register("measurements")}
                                label="Body Measurements (cm)"
                                placeholder="Enter your measurements (e.g., chest: 100cm, waist: 80cm, hips: 90cm)"
                                InputProps={{
                                    startAdornment: <FaRuler style={{ marginRight: 8, color: "#4a5568" }} />
                                }}
                                error={!!errors.measurements}
                                helperText={errors.measurements?.message}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                {...register("completedWorkouts")}
                                label="Completed Workouts"
                                placeholder="List the workouts you completed this week"
                                InputProps={{
                                    startAdornment: <FaDumbbell style={{ marginRight: 8, color: "#4a5568" }} />
                                }}
                                error={!!errors.completedWorkouts}
                                helperText={errors.completedWorkouts?.message}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                {...register("notes")}
                                label="Additional Notes"
                                placeholder="Any additional notes about your progress"
                                InputProps={{
                                    startAdornment: <FaStickyNote style={{ marginRight: 8, color: "#4a5568" }} />
                                }}
                                error={!!errors.notes}
                                helperText={errors.notes?.message}
                                sx={{ mb: 4 }}
                            />

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        color: "#4a5568",
                                        borderColor: "#4a5568",
                                        "&:hover": {
                                            borderColor: "#2d3748",
                                            backgroundColor: "rgba(45, 55, 72, 0.04)"
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                    sx={{
                                        backgroundColor: "#e53e3e",
                                        "&:hover": {
                                            backgroundColor: "#c53030"
                                        },
                                        px: 3
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Progress"
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </StyledPaper>
                </Box>
            </Box>
        </Box>
    );
};

export default SubmitProgress; 