import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";

function App() {
  const router = createBrowserRouter(PublicRoutes());
  return <RouterProvider router={router} />;
}

export default App;
