import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "/logo.png";
import { apiClient } from "@/lib/api";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await apiClient.logout();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:bg-white lg:shadow-sm lg:border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={Logo || "/placeholder.svg"} className="h-8" alt="HD" />
              <span className="text-xl font-normal text-[#232323]">
                Dashboard
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[#367AFF] text-base font-medium hover:text-[#367AFF]/80 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default PrivateLayout;
