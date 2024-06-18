import { Navigate, useRoutes } from "react-router-dom";
import LibraryApp from "./layouts/dashboard";
import AuthorPage from "./sections/@dashboard/author/AuthorPage";
import LoginPage from "./sections/auth/login/LoginPage";
import Page404 from "./pages/Page404";
import BorrowalPage from "./sections/@dashboard/borrowal/BorrowalPage";
import BookPage from "./sections/@dashboard/book/BookPage";
import DashboardAppPage from "./sections/@dashboard/app/DashboardAppPage";
import UsersPage from "./sections/@dashboard/user/UserPage";
import GenrePage from "./sections/@dashboard/genre/GenrePage";
import UserProfile from "./sections/@dashboard/user/UserProfile";
import BorrowalHistory from "./sections/@dashboard/borrowal/BorrowalHistory";
import BookDetails from "./sections/@dashboard/book/BookDetails";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        { path: "books", element: <BookPage /> },
        { path: "books/:id", element: <BookDetails /> },
        { path: "authors", element: <AuthorPage /> },
        { path: "genres", element: <GenrePage /> },
        { path: "borrowals", element: <BorrowalPage /> },
        { path: "userprofile/:id", element: <UserProfile /> },
        { path: "userprofile/history/:id", element: <BorrowalHistory /> },
        { path: "users", element: <UsersPage /> }, // Admin-specific, but accessible to all now
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
