import { createBrowserRouter, RouterProvider } from "react-router-dom";
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


// It's good practice to have placeholder pages for login, unauthorized, etc.


function App() {
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
                            // This nested route has specific role-based protection
                            element: <ProtectedRoute allowedRoles={['admin']} />,
                            children: [
                                {
                                    path: "create_destination",
                                    element: <CreateDestination />,
                                },
                                {
                                    path: "add_user",
                                    element: <AddUser/>,
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