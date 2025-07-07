import SignUp from "@/app/auth/SignUp";
import SignIn from "@/app/auth/SignIn";

function PublicRoutes() {
  return [
    {
      path: "/",
      element: <SignUp />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
  ];
}

export default PublicRoutes;
