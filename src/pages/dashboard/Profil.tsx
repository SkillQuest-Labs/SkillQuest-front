import { UserButton } from "@clerk/clerk-react";
export const Profil = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <h1 className="text-3xl font-bold text-white mb-8">Profil page</h1>
      <div className="flex items-center justify-center rounded-full shadow-lg bg-gray-800 p-4">
        <UserButton
          appearance={{
            elements: {
              rootBox: "hover:opacity-80",
              avatarBox: "w-16 h-16",
              popoverCard: "bg-gray-900 border border-gray-800",
              popoverActionButton: "hover:bg-gray-800",
              popoverActionButtonText: "text-white",
              popoverActionButtonIconBox: "text-gray-400",
            },
          }}
        />
      </div>
    </div>
  );
};
