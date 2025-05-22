import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import CreatePlans from "../Pages/CreatePlans";
import MyPlans from "../Pages/MyPlans";
import UpdatePlan from "../Pages/UpdatePlan";
import PlanDetails from "../Pages/PlanDetails";
import RequestPlan from "../Pages/RequestPlan";
import ReplyRequest from "../Pages/ReplyRequest";
import ReceivedPlans from "../Pages/ReceivedPlans";
import CreateMealPlan from "../Pages/CreateMealPlan";
import DeleteMealPlan from "../Pages/DeleteMealPlan";
import EditMealPlan from "../Pages/EditMealPlan";
import ShowMealPlan from "../Pages/ShowMealPlan";
import MealPlans from "../Pages/MealPlans";
import ProgressAnalysis from "../Pages/ProgressAnalysis";
import SubmitProgress from "../Pages/SubmitProgress";
//import Login from "../"
// ✅ Correct

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/trainer-dashboard/postplans", element: <CreatePlans /> },
            { path: "/trainer-dashboard", element: <MyPlans /> }, // ✅ Ensure correct route
            {
                path: "/trainer-dashboard/edit-plans/:id",
                element: <UpdatePlan />,
                loader: ({ params }) => fetch(`http://localhost:3000/plans/${params.id}`),
            },
            { path: "/plan/:id", element: <PlanDetails /> }, // ✅ Fixed route
            {
                path: "/request-plan",
                element: <RequestPlan />,
            },
            {
                path: "/request-plan/:id",
                element: <ReplyRequest />,
            },
            {
                path: "/myplans",
                element: <ReceivedPlans />,
            },
            {
                path: "/progress-analysis",
                element: <ProgressAnalysis />,
                loader: async ({ request }) => {
                    const url = new URL(request.url);
                    const planId = url.searchParams.get("planId");
                    
                    if (!planId) {
                        throw new Error("Plan ID is required");
                    }

                    try {
                        // Fetch plan details
                        const planResponse = await fetch(`http://localhost:3000/plans/${planId}`);
                        const planData = await planResponse.json();

                        // Fetch progress data
                        const progressResponse = await fetch(`http://localhost:3000/progress/${planId}`);
                        const progressData = await progressResponse.json();

                        // Fetch workout distribution
                        const distributionResponse = await fetch(`http://localhost:3000/workout-distribution/${planId}`);
                        const distributionData = await distributionResponse.json();

                        // Fetch recommendations
                        const recommendationsResponse = await fetch(`http://localhost:3000/recommendations/${planId}`);
                        const recommendationsData = await recommendationsResponse.json();

                        return {
                            plan: planData,
                            progress: progressData,
                            distribution: distributionData,
                            recommendations: recommendationsData
                        };
                    } catch (error) {
                        console.error("Error loading progress data:", error);
                        throw new Error("Failed to load progress data");
                    }
                }
            },
            {
                path: "mealplans/create",
                element: <CreateMealPlan />,
            },
            {
                path: "mealplans/details/:id",
                element: <ShowMealPlan />,
            },
            {
                path: "mealplans/edit/:id",
                element: <EditMealPlan />,
            },
            {
                path: "mealplans/delete/:id",
                element: <DeleteMealPlan />,
            },
            {
                path: "/trainer-dashboard/mealplans",
                element: <MealPlans />,
            },
            {
                path: "/submit-progress",
                element: <SubmitProgress />,
            },
            {
                path: "/submit-progress/email/:email",
                element: <SubmitProgress />,
            },
          

        ],
    },
]);

export default router;
