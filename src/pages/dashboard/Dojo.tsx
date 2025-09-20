import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const Dojo = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dojo</h1>
          <p className="text-gray-400 mt-2">Espace d'entraînement et de perfectionnement</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Bienvenue au Dojo</CardTitle>
            <CardDescription className="text-gray-400">
              Votre espace d'entraînement personnel pour développer vos compétences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                🥋 Le Dojo sera bientôt disponible
              </div>
              <p className="text-gray-400 mt-4">
                Préparez-vous à des défis d'entraînement personnalisés et des exercices pratiques
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
