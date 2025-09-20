import { showToast } from "@/component/notification/show-toast";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
import { useDeleteSkill, useGetSkill, useUpdateSkill } from "@/shared/services/skill/api-skill";
import type { UpdateSkillInput } from "@/shared/services/skill/api-skill.type";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { ArrowLeft, Maximize2, Save, TreePine, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDifficultyColor, getDifficultyLabel, getStatusColor, getStatusLabel } from "../skills.const";
import { SkillTree } from "@/modules/skill-tree/component/SkillTree";
import { useNodesDataLoader } from "../hooks/useNodesDataLoader";
import type { SkillDifficulty, SkillStatus } from "@/shared/types/skill.type";

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

  if (skillLoading) {
    return (
      <div
        className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
          isCollapsed ? "pl-20" : "pl-64"
        } flex items-center justify-center`}
      >
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (skillError || !skill) {
    return (
      <div
        className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
          isCollapsed ? "pl-20" : "pl-64"
        } flex items-center justify-center`}
      >
        <div className="text-white text-lg">Skill non trouvé</div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/skills")}
            className="text-white hover:bg-slate-700"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-transparent border-none text-white text-lg sm:text-xl font-bold h-8 sm:h-10 text-center focus:ring-0 focus:border-none focus:outline-none px-2 py-1 border-b-2 border-blue-800"
                placeholder="Titre du skill"
              />
            ) : (
              <h1
                className="text-lg sm:text-xl font-bold text-white cursor-pointer hover:bg-slate-700/50 px-2 py-1 rounded transition-colors"
                onClick={() => setIsEditing(true)}
                title="Cliquez pour modifier"
              >
                {skill.title}
              </h1>
            )}
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {skill.createdAt && new Date(skill.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
              >
                <X size={16} className="mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save size={16} className="mr-2" />
                {updateLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 h-full">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Description */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm sm:text-base">Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[80px] sm:min-h-[100px] text-sm"
                    placeholder="Description du skill"
                  />
                ) : (
                  <div
                    className="text-white cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors min-h-[80px] sm:min-h-[100px] text-sm"
                    onClick={() => setIsEditing(true)}
                    title="Cliquez pour modifier"
                  >
                    {skill.description || "Aucune description"}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-white text-sm sm:text-base">Arbre de compétence</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsFullscreenOpen(true)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 cursor-pointer text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50 text-xs"
                    disabled={!nodesData || nodesData.length === 0}
                  >
                    <Maximize2 size={14} className="mr-1" />
                    Voir complet
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {nodesData && nodesData.length > 0 && edgesData && edgesData?.length > 0 ? (
                  <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px] bg-slate-900 rounded-lg overflow-hidden border border-slate-600 flex items-center justify-center">
                    <SkillTree nodes={nodesData} edges={edgesData} minimalistView={true} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg p-4 sm:p-6 min-h-[150px] sm:min-h-[180px]">
                    <div className="text-center text-slate-400">
                      <div className="text-2xl sm:text-3xl mb-2">🌳</div>
                      <p className="text-xs sm:text-sm font-medium mb-2">Aucun arbre de compétence sauvegardé</p>
                      <p className="text-xs text-slate-500 mb-3">Créez et sauvegardez votre arbre depuis le canvas</p>
                      <Button
                        onClick={() => navigate(`/canvas?skillId=${skillId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        size="sm"
                      >
                        <TreePine size={14} className="mr-1" />
                        Créer l'arbre
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm sm:text-base">Statut & Difficulté</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">Statut</label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value: SkillStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="NOT_STARTED">Non commencé</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getStatusColor(skill.status)} text-white`}>
                      {getStatusLabel(skill.status)}
                    </Badge>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">Difficulté</label>
                  {isEditing ? (
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: SkillDifficulty) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="EASY">Facile</SelectItem>
                        <SelectItem value="MEDIUM">Moyen</SelectItem>
                        <SelectItem value="HARD">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getDifficultyColor(skill.difficulty)} text-white`}>
                      {getDifficultyLabel(skill.difficulty)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            {skill.progressValue !== undefined && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm sm:text-base">Progression</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm text-slate-300">
                      <span>Progression</span>
                      <span>{skill.progressValue}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.progressValue}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm sm:text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  onClick={() => navigate(`/canvas?skillId=${skillId}`)}
                  className="w-full cursor-pointer bg-slate-700 hover:bg-[#1D283D] text-white border border-slate-600 text-xs sm:text-sm"
                >
                  Ouvrir dans le Canvas
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  variant="destructive"
                  className="w-full cursor-pointer bg-slate-700 hover:bg-red-700 text-white border border-slate-600 text-xs sm:text-sm"
                >
                  {deleteLoading ? "Suppression..." : "Supprimer le skill"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-slate-300">
              Êtes-vous sûr de vouloir supprimer le skill "{skill.title}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-screen bg-slate-900 rounded-lg border border-slate-700 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white truncate">Arbre de compétence - {skill.title}</h2>
              <Button
                onClick={() => setIsFullscreenOpen(false)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700 flex-shrink-0"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {nodesData && nodesData.length > 0 && edgesData && edgesData?.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <SkillTree nodes={nodesData} edges={edgesData} minimalistView={false} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌳</div>
                    <p>Aucun arbre de compétence disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
