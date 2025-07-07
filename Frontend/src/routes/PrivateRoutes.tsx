import Notes from "@/app/Notes";

function PrivateRoutes() {
  return [
    {
      path: "/notes",
      element: <Notes />,
    },
  ];
}

export default PrivateRoutes;
