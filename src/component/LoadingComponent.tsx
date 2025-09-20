export const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-[#23283a] rounded-full animate-spin border-t-[#131928] border-r-[#3b4252] shadow-lg shadow-[#131928]/40"></div>
          <div className="absolute inset-0 flex items-center justify-center w-full h-full">
            <div className="w-16 h-16 border-2 border-[#23283a] rounded-full animate-spin animate-reverse border-t-[#4f5b93] border-l-[#81a1c1] flex items-center justify-center shadow-md shadow-[#131928]/60">
              <div className="w-8 h-8 bg-gradient-to-r from-[#131928] via-[#23283a] to-[#81a1c1] rounded-full animate-pulse shadow shadow-[#23283a]/80"></div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg flex items-center justify-center">
            Authentification en cours
            <span className="flex items-center ml-4 space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></span>
              <span
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
            </span>
          </h2>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-60"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
