import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: LucideIcon; accent?: boolean }) {
  return (
    <Card className={`relative overflow-hidden p-5 ${accent ? "bg-brand text-primary-foreground" : "bg-card"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium opacity-80">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold">{value}</div>
        </div>
        <Icon className="h-5 w-5 opacity-60" />
      </div>
    </Card>
  );
}
