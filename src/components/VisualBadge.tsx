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
    className: "bg-[#1AC676]/10 text-[#1AC676] border-[#1AC676]/30",
  },
  credible: {
    icon: Shield,
    label: "Credible",
    className: "bg-[#4A8EFF]/10 text-[#4A8EFF] border-[#4A8EFF]/30",
  },
  biased: {
    icon: AlertTriangle,
    label: "Biased",
    className: "bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30",
  },
  unverified: {
    icon: XCircle,
    label: "Unverified",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  "peer-reviewed": {
    icon: CheckCircle,
    label: "Peer-Reviewed",
    className: "bg-[#8C5CF6]/10 text-[#8C5CF6] border-[#8C5CF6]/30",
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
