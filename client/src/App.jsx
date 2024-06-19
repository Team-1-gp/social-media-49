import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { AppProvider } from "./context/AppContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (localStorage.username) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/",
    element: <HomePage />,
    loader: () => {
      if (!localStorage.username) {
        return redirect("/login");
      }
      return null;
    },
  },
]);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router}>
        <h1>Hallo</h1>;
      </RouterProvider>
    </AppProvider>
  );
}

export default App;
