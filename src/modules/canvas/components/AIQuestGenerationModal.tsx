import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";
import { useQuestGenerationFormStore } from "@/stores/quest-generation-form-store";
import { ChevronDown, ChevronUp, Sparkles, Target, Settings, Trophy, BookOpen } from "lucide-react";
import "../../../styles/ai-quest-generation-modal.css";

// Schéma Zod pour la validation du formulaire
const questContextSchema = z
  .object({
    manualContext: z.boolean().optional(),
    contextText: z.string().optional(),
    goal: z.string().optional(),
    description: z.string().optional(),
    selfLevel: z.enum(["1", "2", "3", "4", "5"]).optional(),
    weeklyTime: z.string().optional(),
    autoEstimate: z.boolean().optional(),
    // Champs avancés
    numberOfQuests: z.number().min(1).optional(),
    avgQuestDuration: z.string().optional(),
    modality: z.enum(["Théorique", "Equilibré", "Pratique"]).optional(),
    themeStyle: z.enum(["Médiéval", "High-tech", "Space Opera", "Détective"]).optional(),
    toolsConstraint: z.string().optional(),
    rewardPreference: z.string().optional(),
  })
  .refine((data) => data.manualContext || !!data.goal, {
    message: "Requis",
    path: ["goal"],
  });

type QuestContextForm = z.infer<typeof questContextSchema>;

const userLevel = [
  {
    value: "1",
    label: "1 - Novice",
    description: "Je n'y connais absolument rien",
  },
  {
    value: "2",
    label: "2 - Initié",
    description: "J'ai quelques notions de base",
  },
  {
    value: "3",
    label: "3 - Intermédiaire",
    description: "Je sais déjà faire pas mal de choses",
  },
  {
    value: "4",
    label: "4 - Avancé",
    description: "Je maîtrise bien le sujet",
  },
  {
    value: "5",
    label: "5 - Expert",
    description: "Je pourrais enseigner ce sujet",
  },
];

type AIQuestGenerationModalProps = {
  onGenerate: () => void;
  onClose: () => void;
};

export const AIQuestGenerationModal = ({ onGenerate, onClose }: AIQuestGenerationModalProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const form = useForm<QuestContextForm>({
    resolver: zodResolver(questContextSchema),
    defaultValues: { autoEstimate: true, manualContext: false },
  });

  const setForm = useQuestGenerationFormStore((s) => s.setForm);

  const submit = (data: QuestContextForm) => {
    setForm(data);
    onGenerate();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        style={{ maxWidth: "650px" }}
        className=" w-[900px] max-h-[95vh] overflow-y-auto scrollbar-hide bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
      >
        <DialogHeader className="text-center pb-1">
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
            Générateur de Quêtes IA
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base mt-2 text-center">
            Décris ton objectif et laisse l'IA créer ton parcours d'apprentissage personnalisé
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            {/* Choix du mode de remplissage */}
            <div className="form-section">
              <FormField
                control={form.control}
                name="manualContext"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium text-gray-100">Écrire mon contexte manuellement</FormLabel>
                      <p className="text-sm text-gray-400">Rédige toi-même l'ensemble du contexte</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("manualContext") ? (
              <div className="form-section">
                <FormField
                  control={form.control}
                  name="contextText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-200">Contexte</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Décris ici tout ton contexte, objectifs et contraintes"
                          className="h-40 text-base border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <>
                {/* Section Objectif Principal */}
                <div className="form-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-900/50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">Objectif final ou le projet concret visé</h3>
                      <p className="text-sm text-gray-400">Indique le but que tu veux atteindre</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-200">
                          Objectif <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex. Maîtriser Git et GitHub pour la collaboration"
                            className="h-12 text-base  border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-3 text-sm font-medium text-gray-200">
                          Description (recommandé)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Une phrase décrivant plus en détail ton but final"
                            className="h-12 text-base border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Profil */}
                <div className="form-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-900/50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">Ton Profil</h3>
                      <p className="text-sm text-gray-400">Aide l'IA à personnaliser ton parcours</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="selfLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-200">Niveau actuel</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionne ton niveau" />
                              </SelectTrigger>
                              <SelectContent className="border-gray-600 bg-[#182131]">
                                {userLevel.map((lvl) => (
                                  <SelectItem
                                    key={lvl.value}
                                    value={lvl.value}
                                    className="text-gray-100 hover:bg-gray-700 flex items-center gap-2"
                                  >
                                    <span>{lvl.label}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                  control={form.control}
                  name="weeklyTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-200">Temps disponible</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex. 3h/semaine ou 30min/jour"
                          className="h-12 text-base  border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                    <FormField
                      control={form.control}
                      name="weeklyTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-200">Compétence connexe</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex. Je maitrise le JS, le CSS, le HTML etc..."
                              className="h-12 text-base  border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section Configuration */}
                <div className="form-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-900/50 rounded-lg">
                      <Settings className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">Configuration</h3>
                      <p className="text-sm text-gray-400">Personnalise la génération</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="autoEstimate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 /50 rounded-lg border border-gray-600">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium text-gray-100">Estimation automatique</FormLabel>
                          <p className="text-sm text-gray-400">Laisse l'IA estimer la durée et le nombre de quêtes</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Section Avancée */}
                  {!form.watch("autoEstimate") && (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 mt-4 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-900/50 rounded-lg">
                            <Trophy className="h-4 w-4 text-orange-400" />
                          </div>
                          <span className="font-medium text-gray-100">Options avancées</span>
                        </div>
                        {isAdvancedOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>

                      {isAdvancedOpen && (
                        <div className="mt-2 p-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="numberOfQuests"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">Nombre de quêtes</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      placeholder="Ex. 5"
                                      className="h-12 w-full text-base  border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </FormControl>
                                  {/* <FormMessage /> */}
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="modality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">
                                    Style d'apprentissage
                                  </FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Choisis un style" />
                                      </SelectTrigger>
                                      <SelectContent className=" border-gray-600 bg-[#182131]">
                                        {["Théorique", "Equilibré", "Pratique"].map((opt) => (
                                          <SelectItem key={opt} value={opt} className="text-gray-100 hover:bg-gray-700">
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="themeStyle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">Ambiance</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Ex. Médiéval" />
                                      </SelectTrigger>
                                      <SelectContent className=" border-gray-600 bg-[#182131]">
                                        {["Médiéval", "High-tech", "Space Opera", "Détective"].map((opt) => (
                                          <SelectItem key={opt} value={opt} className="text-gray-100 hover:bg-gray-700">
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="toolsConstraint"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">
                                    Type de ressources
                                  </FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="ressource" />
                                      </SelectTrigger>
                                      <SelectContent className=" border-gray-600 bg-[#182131]">
                                        {[
                                          "Vidés",
                                          "Article de bloc",
                                          "Documentation",
                                          "Exercices intéractifs, Livres",
                                        ].map((opt) => (
                                          <SelectItem key={opt} value={opt} className="text-gray-100 hover:bg-gray-700">
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-600">
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleClose}
                    className="w-full sm:w-auto bg-gradient-to-br from-red-700 via-red-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-red-800 hover:text-gray-100"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer mes quêtes
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
