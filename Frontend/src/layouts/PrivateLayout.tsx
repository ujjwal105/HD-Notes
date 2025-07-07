import { Link } from "react-router-dom";
import Logo from "/logo.png";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-2 py-4 sm:px-0 mx-6">
      <div className="w-full min-w-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <img src={Logo} className="h-7" alt="HD" />
          <span className="text-xl font-semibold text-[#232323]">
            Dashboard
          </span>
        </div>
        <Link
          to={"/signin"}
          className="text-[#367AFF] text-base font-medium p-0 h-auto hover:underline"
        >
          Sign Out
        </Link>
      </div>
      {children}
    </div>
  );
}

export default PrivateLayout;
