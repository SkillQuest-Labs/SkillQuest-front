import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/shared/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import { useLoadingStore } from "@/stores/loading-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Loader2,
  Settings,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "../../../styles/ai-quest-generation-modal.css";
import { isSkillNode, questAmbianceStylesData, resourceTypesData, SKILL_DOMAINS, userLevel } from "../canvas.const";
import { getResourceTypesInFrench } from "@/shared/utils/resource-types";

// Schéma Zod pour la validation du formulaire

const baseSchema = z.object({
  aiProvider: z.enum(["openai", "gemini"]).optional(),
  manualContext: z.boolean().optional(),
  contextText: z.string().optional(),
  goal: z.string().optional(),
  selfLevel: z.enum(["Novice", "Initié", "Intermédiaire", "Avancé", "Expert"]).optional(),
  relatedSkill: z.string().optional(),
  autoEstimate: z.boolean().optional(),
  numberOfQuests: z.number().optional(),
  styleApprentissage: z.enum(["Théorique", "Equilibré", "Pratique"]).optional(),
  ambianceQueteStyle: z.enum(questAmbianceStylesData).optional(),
  ressourceType: z.array(z.string()).optional(),
  skillDomain: z.string().optional(),
  customDomain: z.string().optional(),
});

const questContextSchema = baseSchema.superRefine((data, ctx) => {
  if (data.manualContext) {
    if (!data.contextText?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["contextText"],
        message: "Le contexte est requis si tu écris manuellement",
      });
    }
  } else {
    if (!data.goal?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["goal"],
        message: "L’objectif est requis",
      });
    }
    if (!data.selfLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["selfLevel"],
        message: "Le niveau est requis",
      });
    }
  }
});

type QuestContextForm = z.infer<typeof questContextSchema>;

type AIQuestGenerationModalProps = {
  onGenerate: () => void;
  setOpenAiModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AIQuestGenerationModal = ({ onGenerate, setOpenAiModal }: AIQuestGenerationModalProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const [openDomainCombobox, setOpenDomainCombobox] = useState(false);

  const form = useForm<QuestContextForm>({
    resolver: zodResolver(questContextSchema),
    mode: "onTouched",
    defaultValues: { autoEstimate: true, manualContext: false, ressourceType: [], aiProvider: "gemini" },
  });

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setForm = useQuestGenerationFormStore((s) => s.setForm);
  const skill = useCanvasStore((s) => s.nodes.find(isSkillNode));

  // Fonction pour auto-remplir tous les champs du formulaire
  const handleAutoFill = () => {
    form.setValue("manualContext", false);
    form.setValue("aiProvider", "gemini");
    form.setValue("skillDomain", SKILL_DOMAINS[0]);
    form.setValue("customDomain", "");
    form.setValue("goal", "Maîtriser Git et GitHub pour la collaboration");
    form.setValue("selfLevel", "Novice");
    form.setValue("relatedSkill", "");
    form.setValue("autoEstimate", false);
    form.setValue("numberOfQuests", 10);
    form.setValue("styleApprentissage", "Equilibré");
    form.setValue("ambianceQueteStyle", questAmbianceStylesData[0]);
    form.setValue("ressourceType", getResourceTypesInFrench());
  };

  const submit = async (data: QuestContextForm) => {
    // Auto-fill fields if autoEstimate is true
    if (data.autoEstimate) {
      data.numberOfQuests = 4;
      data.styleApprentissage = "Equilibré";
      data.ambianceQueteStyle = "High-tech";
      data.ressourceType = getResourceTypesInFrench();
    }

    setForm(data);
    await onGenerate();
    setOpenAiModal(isLoading);
    form.reset();
  };

  const handleError = (errors: any) => {
    return errors;
  };

  const handleClose = () => {
    setOpenAiModal(false);
    form.reset();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent
        style={{ maxWidth: "650px" }}
        className=" w-[900px] max-h-[95vh] overflow-y-auto scrollbar-hide bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
      >
        {/* Small auto-fill button at the top right */}
        <Button
          variant="ghost"
          onClick={handleAutoFill}
          title="Auto-remplir tous les champs"
          className="absolute cursor-pointer top-3 right-3 z-20 bg-gray-800/80 hover:bg-blue-700/80 text-blue-200 hover:text-white rounded-full p-2 shadow transition-all border border-gray-700"
          style={{ fontSize: 16, lineHeight: 1 }}
        >
          <span className="sr-only">Auto-remplir</span>
          <Sparkles className="h-5 w-5" />
        </Button>

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

        <div className="my-2 relative flex items-center py-2 justify-center w-fit mx-auto shadow-md border border-[#2d2d44] hover:shadow-lg transition-all bg-transparent rounded-xl px-4 py-1 w-auto min-w-[120px] max-w-full">
          <span
            className="absolute -top-3 -right-3 z-10 px-3  bg-gradient-to-r from-purple-500 to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg"
            style={{
              transform: "rotate(18deg)",
              boxShadow: "0 2px 8px 0 rgba(60,60,120,0.18)",
              letterSpacing: "0.15em",
              border: "2px solid #2d2d44",
            }}
          >
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">Skill</span>
          </span>
          <span className="text-center font-semibold text-lg text-blue-300 tracking-wide px-2 py-0.5">
            {skill?.data.config.title}
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit, handleError)} className="space-y-6">
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
                {/* Choix du modèle IA */}
                <div className="form-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-900/50 rounded-lg">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">Modèle IA</h3>
                      <p className="text-sm text-gray-400">Choisis le moteur de génération</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="aiProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-200">Fournisseur</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <SelectTrigger className="cursor-pointer h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionne un modèle" />
                              </SelectTrigger>
                              <SelectContent className="border-gray-600 bg-[#182131]">
                                <SelectItem value="openai" className="cursor-pointer text-gray-100 hover:bg-gray-700">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex h-2 w-2 rounded-full bg-purple-500" />
                                    OpenAI (GPT)
                                  </div>
                                </SelectItem>
                                <SelectItem value="gemini" className="cursor-pointer text-gray-100 hover:bg-gray-700">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                                    Gemini (Google)
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section Domaine du Skill */}
                <div className="form-section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-900/50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">Domaine d'apprentissage</h3>
                      <p className="text-sm text-gray-400">
                        Utilise la recherche pour trouver rapidement le bon domaine
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Domaine principal avec option Autre */}
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name="skillDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-200">Domaine</FormLabel>
                              <Popover open={openDomainCombobox} onOpenChange={setOpenDomainCombobox}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openDomainCombobox}
                                      disabled={showCustomDomain}
                                      className={`h-12 w-full justify-between border-gray-600 bg-transparent text-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 hover:bg-gray-800/60 ${
                                        showCustomDomain ? "opacity-60 cursor-not-allowed" : ""
                                      }`}
                                    >
                                      {field.value
                                        ? SKILL_DOMAINS.find((domain) => domain === field.value)
                                        : "Choisis le domaine..."}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[420px] p-0 border-gray-700 bg-[#182131] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                                  <Command className="bg-[#182131]">
                                    <div className="sticky top-0 z-10 bg-[#182131]/95 backdrop-blur border-b border-gray-700">
                                      <div className="flex items-center px-3 py-2">
                                        <BookOpen className="mr-2 h-4 w-4 text-gray-400" />
                                        <CommandInput
                                          placeholder="Rechercher un domaine..."
                                          className="h-8 bg-transparent border-0 text-gray-100 placeholder-gray-400 hover:placeholder-gray-400 focus:ring-0 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                    <CommandEmpty className="text-gray-400 text-center py-6">
                                      Aucun domaine trouvé.
                                    </CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-y-auto">
                                      {SKILL_DOMAINS.map((domain) => (
                                        <CommandItem
                                          key={domain}
                                          value={domain}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue === field.value ? "" : currentValue);
                                            setShowCustomDomain(false);
                                            setOpenDomainCombobox(false);
                                          }}
                                          className="text-gray-100 hover:bg-gray-700/60 cursor-pointer"
                                        >
                                          <Check
                                            className={`mr-2 h-4 w-4 ${
                                              field.value === domain ? "text-blue-400 opacity-100" : "opacity-0"
                                            }`}
                                          />
                                          {domain}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Checkbox "Autre" */}
                      <div className="flex items-center space-x-2 pb-4">
                        <Checkbox
                          id="custom-domain-toggle"
                          checked={showCustomDomain}
                          onCheckedChange={(checked) => {
                            setShowCustomDomain(!!checked);
                            if (checked) {
                              form.setValue("skillDomain", "");
                            } else {
                              form.setValue("customDomain", "");
                            }
                          }}
                          className="h-5 w-5 border-2 border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <label
                          htmlFor="custom-domain-toggle"
                          className="text-sm font-medium text-gray-200 cursor-pointer select-none hover:text-gray-100 transition-colors"
                        >
                          Autre domaine
                        </label>
                      </div>
                    </div>

                    {/* Champ domaine personnalisé */}
                    {showCustomDomain && (
                      <FormField
                        control={form.control}
                        name="customDomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">Domaine personnalisé</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ex: Architecture, Photoshop, Piano..."
                                className="h-12 text-base border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

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
                          <Textarea
                            {...field}
                            placeholder="Ex. Maîtriser Git et GitHub pour la collaboration"
                            className="h-18 text-base border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                      <h3 className="font-semibold text-lg text-gray-100">Ton Profil </h3>
                      <p className="text-sm text-gray-400">Aide l'IA à personnaliser ton parcours</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="selfLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Niveau actuel <span className="text-red-400">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="cursor-pointer h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Sélectionne ton niveau" />
                                </SelectTrigger>
                                <SelectContent className="border-gray-600 bg-[#182131]">
                                  {userLevel.map((lvl) => (
                                    <SelectItem
                                      key={lvl.label}
                                      value={lvl.label}
                                      className="cursor-pointer text-gray-100 hover:bg-gray-700 flex items-center gap-2"
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
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="relatedSkill"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">Compétences connexes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Ex. Je maîtrise le JS, le CSS, le HTML, etc..."
                                className="h-18 text-base border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                                      min={1}
                                      step={1}
                                      value={field.value ?? ""}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === "" ? undefined : Number(value));
                                      }}
                                      className=" w-full text-base  border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="styleApprentissage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">
                                    Style d'apprentissage
                                  </FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="cursor-pointer h-12 w-full border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Choisis un style" />
                                      </SelectTrigger>
                                      <SelectContent className="border-gray-600 bg-[#182131]">
                                        {["Théorique", "Equilibré", "Pratique"].map((opt) => (
                                          <SelectItem
                                            key={opt}
                                            value={opt}
                                            className="cursor-pointer text-gray-100 hover:bg-gray-700"
                                          >
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
                              name="ambianceQueteStyle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">Ambiance</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="h-12 w-full border-gray-600 cursor-pointer text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Ex. Médiéval" />
                                      </SelectTrigger>
                                      <SelectContent className=" border-gray-600 bg-[#182131]">
                                        {questAmbianceStylesData.map((opt) => (
                                          <SelectItem
                                            key={opt}
                                            value={opt}
                                            className="cursor-pointer text-gray-100 hover:bg-gray-700"
                                          >
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
                              name="ressourceType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-200">
                                    Type de ressources
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left cursor-pointer border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 bg-transparent hover:bg-transparent hover:text-gray-100"
                                      >
                                        {field.value && field.value.length > 0
                                          ? field.value.join(", ")
                                          : "Sélectionner les types"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] bg-[#182131] border-gray-600 text-gray-100">
                                      <div className="flex flex-col gap-2">
                                        {resourceTypesData.map((item) => (
                                          <FormField
                                            key={item}
                                            control={form.control}
                                            name="ressourceType"
                                            render={() => (
                                              <FormItem className="flex items-center space-x-2 space-y-0">
                                                <Checkbox
                                                  id={item}
                                                  checked={field.value?.includes(item)}
                                                  onCheckedChange={(checked) => {
                                                    const newValue = checked
                                                      ? [...(field.value || []), item]
                                                      : (field.value || []).filter((v) => v !== item);
                                                    field.onChange(newValue);
                                                  }}
                                                />
                                                <FormLabel htmlFor={item} className="text-sm font-normal">
                                                  {item}
                                                </FormLabel>
                                              </FormItem>
                                            )}
                                          />
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
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
              </>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-600">
              <Button
                type="button"
                variant="default"
                onClick={handleClose}
                className="w-full sm:w-auto bg-gradient-to-br from-red-700 via-red-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-red-800 hover:text-gray-100"
              >
                Annuler
              </Button>
              {!isLoading ? (
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer mes quêtes
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg flex items-center justify-center"
                >
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Génération en cours...
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
