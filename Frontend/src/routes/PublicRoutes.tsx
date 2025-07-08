import SignUp from "@/app/auth/SignUp";
import SignIn from "@/app/auth/SignIn";

function PublicRoutes() {
  return {
    path: "/auth",
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "signin",
        element: <SignUp />,
      },
    ],
  };
}

export default PublicRoutes;
