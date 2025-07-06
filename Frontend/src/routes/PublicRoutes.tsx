import SignUp from "@/app/auth/SignUp";

function PublicRoutes() {
  return [
    {
      path: "/",
      element: <SignUp />,
    },
  ];
}

export default PublicRoutes;
