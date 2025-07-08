import Notes from "@/app/Notes";

function PrivateRoutes() {
  return {
    path: "/",
    children: [
      {
        path: "notes",
        element: <Notes />,
      },
    ],
  };
}

export default PrivateRoutes;
