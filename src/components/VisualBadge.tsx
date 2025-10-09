import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisualBadgeProps {
  type: "verified" | "credible" | "biased" | "unverified" | "peer-reviewed";
  className?: string;
  showIcon?: boolean;
}

const badgeConfig = {
  verified: {
    icon: CheckCircle,
    label: "Verified",
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400",
  },
  credible: {
    icon: Shield,
    label: "Credible",
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400",
  },
  biased: {
    icon: AlertTriangle,
    label: "Biased",
    className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400",
  },
  unverified: {
    icon: XCircle,
    label: "Unverified",
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400",
  },
  "peer-reviewed": {
    icon: CheckCircle,
    label: "Peer-Reviewed",
    className: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

export const VisualBadge = ({ type, className, showIcon = true }: VisualBadgeProps) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, "gap-1", className)}>
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
};
