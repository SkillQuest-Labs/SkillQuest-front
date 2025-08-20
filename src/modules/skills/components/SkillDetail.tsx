import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { useGetSkill, useUpdateSkill, useDeleteSkill } from "@/shared/services/skill/api-skill";
import type { UpdateSkillInput } from "@/shared/services/skill/api-skill.type";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Save, X } from "lucide-react";
import type { SkillDifficulty, SkillStatus } from "../skills.types";
import { getDifficultyColor, getStatusColor, getStatusLabel, getDifficultyLabel } from "../skills.const";
import { showToast } from "@/component/notification/show-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export const SkillDetail = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarStore();
  const {
    skill,
    loading: skillLoading,
    error: skillError,
  } = useGetSkill(skillId || "");
  const { updateSkill, loading: updateLoading } = useUpdateSkill(skillId || "");
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill(skillId || "");

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "EASY" as SkillDifficulty,
    status: "DRAFT" as SkillStatus,
  });

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
        title: formData.title,
        description: formData.description,
      };

      if (formData.difficulty !== "ALL") {
        updateData.difficulty = formData.difficulty;
      }
      if (formData.status !== "ALL") {
        updateData.status = formData.status;
      }

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
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
                className="bg-transparent border-none text-white text-2xl font-bold h-12 text-center focus:ring-0 focus:border-none focus:outline-none px-2 py-1 border-b-2 border-blue-800"
                placeholder="Titre du skill"
              />
            ) : (
              <h1
                className="text-2xl font-bold text-white cursor-pointer hover:bg-slate-700/50 px-2 py-1 rounded transition-colors"
                onClick={() => setIsEditing(true)}
                title="Cliquez pour modifier"
              >
                {skill.title}
              </h1>
            )}
            <p className="text-slate-400 text-sm mt-1">
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
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                    placeholder="Description du skill"
                  />
                ) : (
                  <div
                    className="text-white cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors min-h-[120px]"
                    onClick={() => setIsEditing(true)}
                    title="Cliquez pour modifier"
                  >
                    {skill.description || "Aucune description"}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Arbre de compétence */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Arbre de compétence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg p-8 min-h-[200px]">
                  <div className="text-center text-slate-400">
                    <div className="text-4xl mb-2">🌳</div>
                    <p className="text-sm font-medium">Aperçu de l'arbre de compétence</p>
                    <p className="text-xs text-slate-500 mt-1">L'image sera générée ici</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Difficulty */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statut & Difficulté</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Statut</label>
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
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulté</label>
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
                <CardHeader>
                  <CardTitle className="text-white">Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
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
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => navigate(`/canvas?skillId=${skillId}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Ouvrir dans le Canvas
                </Button>
                <Button
                  onClick={() => navigate(`/live-view?skillId=${skillId}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white relative"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-white rounded-full animate-[pulse_5s_ease-in-out_infinite]"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                    </div>
                    Live View
                  </div>
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  variant="destructive"
                  className="w-full bg-red-500/80 hover:bg-red-600/80 text-white"
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
    </div>
  );
};
