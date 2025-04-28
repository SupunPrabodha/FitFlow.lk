import { createContext, useState, useEffect } from "react";

export const FeedbackContext = createContext();

const FeedbackContextProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/feedback/list`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setFeedbacks(data.feedback);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [backendUrl]);

  const removeFeedback = async (feedbackId, email) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/feedback/remove/${feedbackId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setFeedbacks(
          feedbacks.filter((feedback) => feedback._id !== feedbackId)
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error removing feedback:", error);
    }
  };

  const updateFeedback = async (feedbackId, updatedData) => {
    const email = updatedData.email; 
    try {
      const response = await fetch(
        `${backendUrl}/api/feedback/update/${feedbackId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email, 
            review: updatedData.review,
            rating: updatedData.rating,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setFeedbacks(
          feedbacks.map((feedback) =>
            feedback._id === feedbackId
              ? { ...feedback, ...updatedData }
              : feedback
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{ feedbacks, setFeedbacks, removeFeedback, updateFeedback }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContextProvider;
