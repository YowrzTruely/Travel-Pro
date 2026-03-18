import { useQuery } from "convex/react";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appConfig } from "../../../appConfig";
import { useAuth } from "../AuthContext";

const STAGE_LEVELS: Record<string, number> = {
  stage1: 1,
  stage2: 2,
  stage3: 3,
};

interface FeatureGateProps {
  children: ReactNode;
  featureName: string;
  requiredStage: "stage1" | "stage2" | "stage3";
}

export function FeatureGate({
  children,
  featureName,
  requiredStage,
}: FeatureGateProps) {
  const { profile } = useAuth();
  const supplierId = profile?.supplierId;

  const supplier = useQuery(
    api.suppliers.get,
    supplierId ? { id: supplierId as Id<"suppliers"> } : "skip"
  );

  const currentStage = supplier?.profileCompletionStage ?? "stage1";
  const currentLevel = STAGE_LEVELS[currentStage] ?? 1;
  const requiredLevel = STAGE_LEVELS[requiredStage] ?? 1;

  if (appConfig.disableFeatureGates || currentLevel >= requiredLevel) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background px-8 py-6 shadow-lg">
          <Lock className="text-foreground" size={32} />
          <p
            className="text-center text-[15px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            השלם את הפרופיל שלך כדי לפתוח תכונה זו
          </p>
          <span className="text-[13px] text-muted-foreground">
            {featureName}
          </span>
          <Link
            className="mt-1 rounded-xl bg-primary px-5 py-2 text-[14px] text-white transition-colors hover:bg-[#e07b00]"
            style={{ fontWeight: 600 }}
            to="/profile"
          >
            לעדכון פרופיל
          </Link>
        </div>
      </div>
    </div>
  );
}
