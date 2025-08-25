export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div className="w-full max-w-md mx-auto">{children}</div>
  </div>
);
