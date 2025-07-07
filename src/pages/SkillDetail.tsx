import { useSkills } from "@/modules/skills/hooks/use-skills";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

import { DifficultyBadge } from "@/modules/skills/components/DifficultyBadge";
import { StatusBadge } from "@/modules/skills/components/StatusBadge";
import { ProgressBar } from "@/modules/skills/components/ProgressBar";
import { ArrowLeft, Edit, Play, Calendar, Clock, Tag } from "lucide-react";
import { formatSkillDuration, formatSkillDate } from "@/shared/utils/helpers";

const SkillDetail = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const { skills } = useSkills();
  const navigate = useNavigate();

  const skill = skills.find((s) => s.id === skillId);

  if (!skill) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold">Skill non trouvé</h1>
          <p className="text-muted-foreground">Le skill que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/dashboard/skills")}>Retour aux skills</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/skills")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Skill Header */}
      <div className="bg-card border rounded-lg p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{skill.title}</h1>
              {skill.description && <p className="text-lg text-muted-foreground">{skill.description}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge difficulty={skill.difficulty} />
              <StatusBadge status={skill.status} />
              {skill.category && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  {skill.category}
                </div>
              )}
            </div>

            {/* Progress Section */}
            {skill.progress !== undefined && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progression globale</span>
                  <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                </div>
                <ProgressBar progress={skill.progress} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate(`/canvas?skillId=${skill.id}`)}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Edit className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Modifier</span>
            </Button>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Play className="h-4 w-4 mr-2" />
              Commencer
            </Button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Duration Card */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Durée estimée</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatSkillDuration(skill.duration)}
              </p>
            </div>
          </div>
        </Card>

        {/* Quests Card */}
        {skill.questsCount && (
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold">Quêtes</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{skill.questsCount}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Created Date Card */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Créé le</h3>
              <p className="text-sm text-muted-foreground">{formatSkillDate(skill.createdAt)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations supplémentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Dernière modification :</span>
            <p className="text-muted-foreground">{formatSkillDate(skill.updatedAt)}</p>
          </div>
          <div>
            <span className="font-medium">ID du skill :</span>
            <p className="text-muted-foreground font-mono">{skill.id}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SkillDetail;
