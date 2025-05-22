import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert, Grid, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaDumbbell, FaCalendarAlt, FaUser, FaFileAlt, FaArrowRight, FaTrash } from "react-icons/fa";

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    transition: "transform 0.2s, box-shadow 0.2s",
    background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 600,
}));

const PlanCard = ({ plan, onProgressSubmit, onDelete }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(plan._id);
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <StyledCard>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" component="h2" sx={{ 
                            fontWeight: 600,
                            color: "#2d3748",
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}>
                            <FaDumbbell style={{ color: "#e53e3e" }} />
                            {plan.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <StatusChip 
                                label="Active" 
                                color="success" 
                                size="small"
                            />
                            <IconButton 
                                onClick={handleDeleteClick}
                                sx={{ 
                                    color: "#e53e3e",
                                    "&:hover": {
                                        backgroundColor: "rgba(229, 62, 62, 0.1)"
                                    }
                                }}
                            >
                                <FaTrash />
                            </IconButton>
                        </Box>
                    </Box>

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                        {plan.description}
                    </Typography>

                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <FaUser style={{ color: "#4a5568" }} />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Trainer:</strong> {plan.trainerName}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <FaCalendarAlt style={{ color: "#4a5568" }} />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Date:</strong> {plan.date}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ 
                        backgroundColor: "#f8fafc",
                        borderRadius: 1,
                        p: 2,
                        mb: 3
                    }}>
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: "#2d3748",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1
                        }}>
                            <FaFileAlt style={{ color: "#4a5568" }} />
                            Plan Details
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {plan.replyMessage}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onProgressSubmit(plan.email)}
                            endIcon={<FaArrowRight />}
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
                            Submit Progress
                        </Button>
                    </Box>
                </CardContent>
            </StyledCard>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: "400px",
                        width: "90%"
                    }
                }}
            >
                <DialogTitle sx={{ 
                    color: "#2d3748",
                    fontWeight: 600,
                    borderBottom: "1px solid #e2e8f0",
                    pb: 2
                }}>
                    Delete Plan
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography>
                        Are you sure you want to delete this plan? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: "#4a5568",
                            "&:hover": {
                                backgroundColor: "rgba(74, 85, 104, 0.1)"
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            backgroundColor: "#e53e3e",
                            "&:hover": {
                                backgroundColor: "#c53030"
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ReceivedPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userEmail = "snru@gm.com"; // Replace with dynamic email when available

    useEffect(() => {
        fetchPlans();
    }, [userEmail]);

    const fetchPlans = async () => {
        try {
            const response = await fetch(`http://localhost:3000/reply/${userEmail}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setPlans(data);
        } catch (err) {
            setError("Failed to fetch plans. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (planId) => {
        try {
            const response = await fetch(`http://localhost:3000/reply/${planId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete plan');
            }

            setPlans(plans.filter(plan => plan._id !== planId));
            setError(null);
        } catch (error) {
            console.error('Error deleting plan:', error);
            setError(error.message || 'Failed to delete plan. Please try again.');
        }
    };

    const handleProgressSubmit = async (planId) => {
        try {
            navigate(`/submit-progress?email=${userEmail}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to proceed. Please try again.');
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
        <Box p={3}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 600,
                color: "#2d3748",
                mb: 4
            }}>
                Received Plans
            </Typography>

            {plans.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No plans received yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {plans.map((plan) => (
                        <Grid item xs={12} key={plan._id}>
                            <PlanCard
                                plan={plan}
                                onProgressSubmit={handleProgressSubmit}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ReceivedPlans;
