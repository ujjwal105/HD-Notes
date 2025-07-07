import { Toaster } from "sonner";
import AuthBanner from "/AuthBanner.png";
import Logo from "/logo.png";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-7/4 flex flex-col h-full">
        <div className="flex items-center gap-3 mt-6 mb-0 mx-auto lg:mx-10 lg:my-8 lg:justify-start justify-center">
          <img src={Logo} className="h-7" alt="HD" />
          <p className="text-2xl font-semibold">HD</p>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center w-full -mt-24">
          <div className="w-full max-w-sm">{children}</div>
          <Toaster />
        </div>
      </div>
      <div className="hidden lg:block w-7/3 h-full mx-2 py-2">
        <img
          src={AuthBanner}
          alt="AuthBanner"
          className="object-cover w-full h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

export default PublicLayout;
