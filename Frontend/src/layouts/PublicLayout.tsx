import AuthBanner from "/AuthBanner.png";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full lg:w-7/4 flex flex-col">
        <div className="max-w-sm mx-auto w-full">{children}</div>
      </div>
      <div className="hidden lg:block w-7/3 h-full m-2 py-2">
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
