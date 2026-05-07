import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  // generic
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  brand: "bg-primary/15 text-primary border-primary/30",
  pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
};

const map: Record<string, keyof typeof colors> = {
  // company status
  lead: "info", proposta_enviada: "info", ativo: "success", implantacao: "brand",
  pausado: "warning", encerrado: "default", inadimplente: "danger",
  // project / approval / event / etc
  planejado: "info", em_producao: "brand", em_revisao: "warning", aguardando_aprovacao: "warning",
  ajustes_solicitados: "warning", aprovado: "success", publicado: "success",
  finalizado: "success", rascunho: "default", enviado: "info", visualizado: "info",
  reenviado: "warning",
  aberto: "info", em_analise: "info", em_andamento: "brand", aguardando_cliente: "warning",
  resolvido: "success", encerrado_t: "default",
  ideia: "default", em_criacao: "info", agendado: "brand", cancelado: "default",
  confirmado: "success", em_preparacao: "brand", realizado: "success",
  agendada: "info", confirmada: "success", realizada: "success", remarcada: "warning", cancelada: "default",
  planejada: "info", em_aprovacao: "warning", ativa: "success",
  baixa: "default", media: "info", alta: "warning", urgente: "danger",
};

const labels: Record<string, string> = {
  proposta_enviada: "Proposta enviada", em_producao: "Em produção", em_revisao: "Em revisão",
  aguardando_aprovacao: "Aguardando aprovação", ajustes_solicitados: "Ajustes solicitados",
  em_analise: "Em análise", em_andamento: "Em andamento", aguardando_cliente: "Aguardando cliente",
  em_criacao: "Em criação", em_preparacao: "Em preparação", em_aprovacao: "Em aprovação",
  implantacao: "Em implantação",
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  const tone = colors[map[value] ?? "default"];
  const label = labels[value] ?? value.replace(/_/g, " ");
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", tone)}>
      {label}
    </span>
  );
}
