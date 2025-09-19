import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/clerk-react";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profil = () => {
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();

  return (
    <div
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col min-h-0`}
    >
      <SignedIn>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Profil</h1>
              <p className="text-slate-400 text-sm mt-1">
                Gérez vos informations personnelles et paramètres de compte.
              </p>
            </div>
          </div>
        </div>

        {/* Contenu principal - UserProfile de Clerk avec style amélioré */}
        <div className="flex-1 flex items-start justify-center pt-4 pb-8">
          <div className="w-full max-w-5xl h-full">
            <UserProfile
              appearance={{
                variables: {
                  colorPrimary: "#3b82f6", // blue-500
                  colorBackground: "transparent",
                  colorText: "#ffffff",
                  colorTextSecondary: "#cbd5e1", // slate-300
                  borderRadius: "1rem",
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                  spacingUnit: "1rem",
                },
                elements: {
                  // Container principal
                  card: "bg-transparent border-0 shadow-none",

                  // Navigation sidebar
                  navbar: "bg-slate-800/60 border-r border-slate-600/40 rounded-l-2xl backdrop-blur-sm",
                  navbarButtons: "gap-2 p-2",
                  navbarButton:
                    "rounded-lg text-slate-200 hover:bg-slate-700/60 hover:text-white data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 transition-all duration-200 py-2 px-3",

                  // Header
                  headerTitle: "text-white font-bold text-xl",
                  headerSubtitle: "text-slate-300",

                  // Formulaires
                  formFieldLabel: "text-slate-200 font-medium",
                  formFieldInput:
                    "bg-slate-700/60 border border-slate-500/50 text-white placeholder-slate-300 rounded-lg focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-200 py-3",
                  formFieldInputShowPasswordButton: "text-slate-300 hover:text-white",

                  // Boutons
                  formButtonPrimary:
                    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 py-3 px-6",
                  formButtonSecondary:
                    "bg-slate-600 hover:bg-slate-500 text-white border border-slate-500 rounded-lg transition-all duration-200 py-3 px-6",
                  profileSectionPrimaryButton:
                    "bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-all duration-200 py-3 px-6",

                  // Sections
                  profileSectionTitle: "text-white font-semibold",
                  profileSectionContent: "text-slate-200",

                  // Diviseurs
                  divider: "bg-slate-600/40",

                  // Alertes et messages
                  alert: "bg-slate-700/60 border border-blue-400/30 text-slate-200 rounded-lg",
                  formFieldSuccessText: "text-emerald-400",
                  formFieldErrorText: "text-red-400",

                  // Modales
                  modalContent: "bg-slate-800/90 border border-slate-600/50 rounded-2xl backdrop-blur-md",
                  modalCloseButton: "text-slate-300 hover:text-white",

                  // Tableaux
                  table: "bg-slate-700/40 rounded-lg overflow-hidden",
                  tableHead: "bg-slate-600/50",
                  tableHeadRow: "border-b border-slate-500/50",
                  tableHeadCell: "text-slate-200 font-medium",
                  tableBody: "bg-transparent",
                  tableRow: "border-b border-slate-600/30 hover:bg-slate-600/20 transition-colors",
                  tableCell: "text-slate-200",

                  // Badges et tags
                  badge:
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-1 text-xs font-medium",

                  // Liens
                  linkButton: "text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition-colors",
                },
              }}
            />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Connexion requise</h1>
              <p className="text-slate-400">Connectez-vous pour accéder à votre profil</p>
            </div>
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: "#f59e0b",
                  borderRadius: "12px",
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                },
                elements: {
                  card: "bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-xl backdrop-blur-md",
                  formButtonPrimary:
                    "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg",
                  formFieldInput:
                    "bg-slate-800/70 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:border-amber-400 focus:ring-amber-400/30",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>
    </div>
  );
};
