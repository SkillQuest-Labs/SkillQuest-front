export const authAppearance = {
  elements: {
    rootBox: "w-full max-w-lg mx-auto flex items-center justify-center min-h-screen h-screen",
    card: "bg-transparent shadow-none",
    headerTitle: "text-white text-xl font-medium text-glow text-center",
    headerSubtitle: "text-gray-400",
    socialButtonsBlockButton: "bg-gray-900 border border-gray-700 hover:border-purple-500 text-white button-glow",
    socialButtonsBlockButtonArrow: "hidden",
    socialButtonsBlockButtonText: "flex items-center justify-center gap-2",
    dividerLine: "bg-gray-700",
    dividerText: "text-gray-400",
    formFieldLabel: "text-gray-300",
    formFieldInput:
      "w-full py-3 px-4 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none input-glow",
    formButtonPrimary:
      "w-full py-3 bg-purple-700 text-white rounded-md font-medium button-glow transition-all hover:bg-purple-600",
    footerActionLink: "text-purple-400 hover:text-purple-300",
    footerActionText: "text-white",
    formHeaderTitle: "text-white text-2xl font-bold",
    formHeaderSubtitle: "text-gray-400",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-purple-400 hover:text-purple-300",
    formFieldInputShowPasswordButton: "text-gray-400",
    headerBackIcon: "text-gray-400",
    headerBackLink: "text-gray-400 hover:text-gray-300",
    alternativeMethodsBlockButton: "text-purple-400 hover:text-purple-300",
    formFieldWarningText: "text-red-400",
    formFieldErrorText: "text-red-400",
    alertText: "text-red-400",
    otpCodeFieldInput: "bg-gray-900 border border-gray-700 text-white",
  },
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
  },
} as const;

export const userButtonAppearance = {
  elements: {
    rootBox: "hover:opacity-80",
    avatarBox: "w-10 h-10",
    popoverCard: "bg-gray-900 border border-gray-800",
    popoverActionButton: "hover:bg-gray-800",
    popoverActionButtonText: "text-white",
    popoverActionButtonIconBox: "text-gray-400",
  },
};
