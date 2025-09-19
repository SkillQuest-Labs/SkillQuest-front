import { showToast } from "@/component/notification/show-toast";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { SkillTree } from "@/modules/skill-tree/component/SkillTree";
import { useDeleteSkill, useGetSkill, useUpdateSkill } from "@/shared/services/skill/api-skill";
import type { UpdateSkillInput } from "@/shared/services/skill/api-skill.type";
import type { SkillDifficulty, SkillStatus } from "@/shared/types/skill.type";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { ArrowLeft, Maximize2, PencilLine, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDifficultyColor, getDifficultyLabel, getStatusColor, getStatusLabel } from "../skills.const";
import { useNodesDataLoader } from "../hooks/useNodesDataLoader";
import { SkillQuestStatsCard } from "./SkillQuestStatsCard";
import { isQuestNode } from "@/modules/canvas/canvas.const";

export const SkillDetail = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarStore();
  const { skill, loading: skillLoading, error: skillError } = useGetSkill(skillId || "");
  const { updateSkill, loading: updateLoading } = useUpdateSkill(skillId || "");
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill(skillId || "");

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "EASY" as SkillDifficulty,
    status: "DRAFT" as SkillStatus,
  });

  const { nodesData, edgesData } = useNodesDataLoader();

  useEffect(() => {
    if (skill) {
      setFormData({
        title: skill.title || "",
        description: skill.description || "",
        difficulty: skill.difficulty || "EASY",
        status: skill.status || "DRAFT",
      });
    }
  }, [skill]);

  const handleSave = async () => {
    if (!skillId) return;

    try {
      const updateData: UpdateSkillInput = {
        ...skill,
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        status: formData.status,
      };

      await updateSkill(updateData);

      showToast({
        title: "Succès",
        description: "Le skill a été mis à jour avec succès",
        status: "success",
      });

      setIsEditing(false);
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du skill",
        status: "error",
      });
    }
  };

  const handleCancel = () => {
    if (skill) {
      setFormData({
        title: skill.title || "",
        description: skill.description || "",
        difficulty: skill.difficulty || "EASY",
        status: skill.status || "DRAFT",
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillId) return;

    try {
      await deleteSkill();
      showToast({
        title: "Succès",
        description: "Le skill a été supprimé avec succès",
        status: "success",
      });
      setIsDeleteDialogOpen(false);
      navigate("/dashboard/skills");
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de la suppression du skill",
        status: "error",
      });
    }
  };

  const questStats = useMemo(() => {
    const questNodes = nodesData?.filter((node) => isQuestNode(node)) ?? [];

    return questNodes?.reduce(
      (acc, node) => {
        const status = node.data.status;

        if (status === "COMPLETED") {
          acc.completed += 1;
        } else if (status === "LOCKED") {
          acc.locked += 1;
        } else {
          acc.available += 1;
        }

        return acc;
      },
      {
        total: questNodes.length,
        completed: 0,
        available: 0,
        locked: 0,
      },
    );
  }, [nodesData]);

  if (skillLoading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-all duration-300 ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-200">
          Chargement du skill...
        </div>
      </div>
    );
  }

  if (skillError || !skill) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-all duration-300 ${
          isCollapsed ? "pl-20" : "pl-64"
        }`}
      >
        <div className="rounded-full border border-rose-500/40 bg-rose-500/10 px-5 py-2 text-sm text-rose-200">
          Skill non trouvé
        </div>
      </div>
    );
  }
  const progressValue = skill.progressValue ?? null;

  const createdAtLabel = skill.createdAt
    ? new Date(skill.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "—";
  const updatedAtLabel = skill.updatedAt
    ? new Date(skill.updatedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : null;

  const currentStatus = isEditing ? formData.status : skill.status;
  const currentDifficulty = isEditing ? formData.difficulty : skill.difficulty;

  return (
    <div
      className={
        "relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 overflow-hidden"
      }
    >
      <div className="relative flex w-[97%] mx-auto flex-col gap-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-slate-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/skills")}
              className="rounded-full border border-white/10 bg-white/5 px-3 text-slate-200 backdrop-blur transition-all hover:-translate-y-0.5 cursor-pointer hover:text-white hover:bg-white/10"
            >
              <ArrowLeft size={18} className="mr-2" />
              Retour
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="rounded-full border border-white/10 bg-white/5 px-4 text-slate-200 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <X size={16} className="mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateLoading}
                  className="rounded-full border border-sky-500/40 bg-sky-500/20 px-4 text-sky-100 transition-all hover:-translate-y-0.5 hover:bg-sky-500/30 disabled:opacity-60"
                >
                  <Save size={16} className="mr-2" />
                  {updateLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-white/10 bg-white/5 px-4 text-slate-200 backdrop-blur transition-all hover:-translate-y-0.5 cursor-pointer hover:text-white hover:bg-white/12"
              >
                <PencilLine size={16} className="mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 p-6 md:p-6 shadow-[0_50px_150px_-80px_rgba(14,23,42,0.9)] backdrop-blur-xl">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-2xl border border-white/10 bg-white/10 text-3xl font-semibold text-slate-50 placeholder:text-slate-400 focus-visible:ring-sky-500"
                  placeholder="Titre du skill"
                />
              ) : (
                <h1
                  className="text-3xl font-semibold text-slate-50 md:text-4xl"
                  onDoubleClick={() => setIsEditing(true)}
                  title="Double-cliquez pour modifier"
                >
                  {skill.title}
                </h1>
              )}

              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="text-slate-500">Créé le</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">{createdAtLabel}</span>
                </span>
                {updatedAtLabel && (
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">Mis à jour</span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">{updatedAtLabel}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2 md:text-right">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Statut</span>
                <div className="mt-2">
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value: SkillStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="w-full rounded-xl border-white/10 bg-slate-900/60 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/10 bg-slate-900/95 text-slate-100">
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="NOT_STARTED">Non commencé</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex justify-end">
                      <Badge className={`${getStatusColor(currentStatus)} px-4 py-1 text-white`}>
                        {getStatusLabel(currentStatus)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Difficulté</span>
                <div className="mt-2">
                  {isEditing ? (
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: SkillDifficulty) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger className="w-full rounded-xl border-white/10 bg-slate-900/60 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/10 bg-slate-900/95 text-slate-100">
                        <SelectItem value="EASY">Facile</SelectItem>
                        <SelectItem value="MEDIUM">Moyen</SelectItem>
                        <SelectItem value="HARD">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex justify-end">
                      <Badge className={`${getDifficultyColor(currentDifficulty)} px-4 py-1 text-white`}>
                        {getDifficultyLabel(currentDifficulty)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 w-[75%] space-y-6">
            <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Description</h2>
                {!isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-black cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier
                  </Button>
                )}
              </div>
              <div className="mt-4">
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-26 resize-none rounded-2xl border border-white/10 bg-slate-800/70 text-slate-100 focus-visible:ring-sky-500"
                    maxLength={600}
                    placeholder="Décrivez ce skill..."
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    {skill.description || "Aucune description disponible pour ce skill."}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">Arbre de compétence</h2>
                    <p className="text-sm text-slate-400">Aperçu rapide du parcours associé à ce skill.</p>
                  </div>
                  <Button
                    onClick={() => setIsFullscreenOpen(true)}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer rounded-full border border-slate-600/70 bg-slate-800/60 text-slate-200 transition-all hover:text-white hover:-translate-y-0.5 hover:bg-slate-800"
                    disabled={!nodesData || nodesData.length === 0}
                  >
                    <Maximize2 size={16} className="mr-2" />
                    Agrandir
                  </Button>
                </div>
                <div
                  className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60"
                  style={{ minHeight: "360px" }}
                >
                  {nodesData && nodesData.length > 0 && edgesData && edgesData.length > 0 ? (
                    <div className="flex h-[360px] items-center justify-center">
                      <SkillTree nodes={nodesData} edges={edgesData} minimalistView />
                    </div>
                  ) : (
                    <div className="flex h-[360px] flex-col items-center justify-center gap-2 text-slate-400">
                      <div className="text-4xl">🌱</div>
                      <p>Aucun arbre de compétence disponible pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[25%] flex-col gap-6">
            <SkillQuestStatsCard stats={questStats} />
            {progressValue !== null && (
              <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-5 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.85)] backdrop-blur-xl">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Progression</span>
                  <span className="font-semibold text-slate-100">{progressValue}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-5 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.85)] backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Actions rapides</h3>
              <div className="mt-4 space-y-6">
                <Button
                  onClick={() => navigate(`/canvas?skillId=${skillId}`)}
                  className="w-full cursor-pointer rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-200 transition-all hover:-translate-y-0.5 hover:bg-sky-500/20"
                >
                  Ouvrir dans le Canvas
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  variant="outline"
                  className="w-full cursor-pointer rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 transition-all hover:-translate-y-0.5 hover:text-white hover:bg-rose-500/20 disabled:opacity-60"
                >
                  {deleteLoading ? "Suppression..." : "Supprimer le skill"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-3xl border border-white/10 bg-slate-900/90 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-rose-300">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-slate-400">
              Êtes-vous sûr de vouloir supprimer le skill "{skill.title}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-full border border-white/10 bg-white/5 px-4 text-slate-200 hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="rounded-full border border-rose-500/40 bg-rose-600/80 px-4 text-rose-100 hover:bg-rose-600"
            >
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
          <div className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-[0_50px_150px_-80px_rgba(14,23,42,0.95)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-100">Arbre de compétence · {skill.title}</h2>
              <Button
                onClick={() => setIsFullscreenOpen(false)}
                variant="ghost"
                size="sm"
                className="rounded-full text-slate-300 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="flex flex-1 items-center justify-center bg-slate-950/40">
              {nodesData && nodesData.length > 0 && edgesData && edgesData?.length > 0 ? (
                <SkillTree nodes={nodesData} edges={edgesData} minimalistView={false} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="text-4xl">🌳</div>
                  <p>Aucun arbre de compétence disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
