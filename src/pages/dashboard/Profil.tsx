// src/pages/dashboard/Profil.tsx
import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/clerk-react";

export const Profil = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Profil</h1>

          <SignedIn>
            <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 p-6 shadow-2xl backdrop-blur-md flex items-center justify-center">
              {/* Glow subtil */}
              <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-amber-400/15 to-pink-500/20 blur-lg" />

              {/* Profil centré */}
              <div className="w-full max-w-4xl">
                <UserProfile
                  appearance={{
                    variables: {
                      colorPrimary: "#f59e0b", // amber
                      borderRadius: "1rem",
                      fontFamily: '"Cinzel", ui-serif, Georgia, serif',
                    },
                    elements: {
                      card: "bg-slate-900/80 text-white border border-amber-400/30 rounded-2xl shadow-xl backdrop-blur-md",
                      navbar:
                        "bg-gradient-to-b from-amber-900/40 via-amber-800/30 to-yellow-900/20 border-r border-amber-400/30 rounded-l-2xl backdrop-blur-md",
                      navbarButtons: "gap-2 p-2",
                      navbarButton:
                        "rounded-lg text-slate-200 hover:bg-amber-400/15 hover:text-amber-300 data-[active=true]:bg-amber-400/20 data-[active=true]:text-amber-200 transition",
                      headerTitle: "text-amber-400 font-bold",
                      headerSubtitle: "text-slate-300",
                      formFieldLabel: "text-slate-300",
                      formFieldInput:
                        "bg-slate-800/70 border border-amber-400/20 text-white placeholder-slate-400 rounded-lg focus:border-amber-400 focus:ring-amber-400/30",
                      formButtonPrimary:
                        "bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 hover:from-amber-400 hover:via-pink-400 hover:to-purple-400 text-black font-semibold rounded-lg shadow-lg transition",
                      profileSectionPrimaryButton: "bg-amber-500 hover:bg-amber-400 text-black rounded-lg",
                      divider: "bg-amber-400/20",
                      alert: "bg-slate-800/70 border border-amber-400/30 text-slate-200 rounded-lg",
                      modalContent: "bg-slate-900/80 border border-amber-400/30 rounded-2xl backdrop-blur-md",
                    },
                  }}
                />
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="max-w-md mx-auto">
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "#f59e0b",
                    borderRadius: "12px",
                    fontFamily: '"Cinzel", ui-serif, Georgia, serif',
                  },
                  elements: {
                    card: "bg-transparent border-0 shadow-none",
                    formButtonPrimary: "bg-amber-500 hover:bg-amber-400 text-black rounded-lg",
                    formFieldInput: "bg-slate-900/60 border border-amber-400/20 text-slate-100",
                  },
                }}
              />
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Profil;
