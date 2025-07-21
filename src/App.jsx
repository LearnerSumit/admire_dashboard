import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import CreateItineriesPage from "./routes/create/page";
import ItineriesListPage from "./routes/Itinerarys/page";
import ImageGallery from "./routes/image_gallery/page";
import CreateDestination from "./routes/createDestination/page";
import LoginPage from "./loginPage/page";
import UnauthorizedPage from "./unauthorizedPage/page";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./routes/addUser/page";
import useAuthStore from "./stores/authStore";
import CustomerGallery from "./routes/customer_gallery/page";
import TermsAndCondition from "./routes/termsandcondition/page";
import PaymentMode from "./routes/paymentmode/page";
import CencellationMode from "./routes/cancellationpolicy/page";
import HeroVideoUpload from "./routes/heroVideo/page";
import UploadVideoTestimonial from "./routes/uploadVideoTestiminal/page"


// It's good practice to have placeholder pages for login, unauthorized, etc.


function App() {

    const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);

    useEffect(() => {
        checkAuthOnLoad();
    }, [checkAuthOnLoad]);
    const router = createBrowserRouter([
        {
            // Public routes that do not require authentication
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/unauthorized",
            element: <UnauthorizedPage />,
        },
        {
            // All routes nested under this element will be protected
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />,
                        },
                        {
                            path: "create_itinerary",
                            element: <CreateItineriesPage />,
                        },
                        {
                            path: "itinerary_list",
                            element: <ItineriesListPage />,
                        },
                        {
                            path: "image_gallery",
                            element: <ImageGallery />,
                        },
                        {
                            path: "customer_gallery",
                            element: <CustomerGallery />,
                        },
                        {
                            path: "terms_and_conditions",
                            element: <TermsAndCondition />,
                        },
                        {
                            path: "payment_mode",
                            element: <PaymentMode />,
                        },
                        {
                            path: "cancellation_policy",
                            element: <CencellationMode />,
                        },
                        {
                            path: "hero_video",
                            element: <HeroVideoUpload />,
                        },
                        {
                            path: "video_testimonials_upload",
                            element: <UploadVideoTestimonial />,
                        },
                        {
                            // This nested route has specific role-based protection
                            element: <ProtectedRoute allowedRoles={['admin']} />,
                            children: [
                                {
                                    path: "create_destination",
                                    element: <CreateDestination />,
                                },
                                {
                                    path: "add_user",
                                    element: <AddUser />,
                                },
                            ]
                        }
                    ],
                },
            ]
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;