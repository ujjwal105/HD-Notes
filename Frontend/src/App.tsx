import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import PublicRoutes from "@/routes/PublicRoutes";
import PrivateRoutes from "@/routes/PrivateRoutes";

function App() {
  const router = createBrowserRouter([PublicRoutes(), PrivateRoutes()]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            color: "#232323",
            border: "1px solid #e5e7eb",
          },
        }}
      />
    </>
  );
}

export default App;
