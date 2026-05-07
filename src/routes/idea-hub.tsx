import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/idea-hub")({
  head: () => ({ meta: [
    { title: "IDEA Hub — Portal de marketing e vendas" },
    { name: "description", content: "Plataforma exclusiva da IDEA: aprovações, calendário, eventos, chamados, arquivos, reuniões e relatórios em um só lugar." },
    { property: "og:title", content: "IDEA Hub" },
    { property: "og:description", content: "Marketing, vendas e operação no mesmo portal." },
  ]}),
  component: Hub,
});

const features = [
  "Aprovação de materiais com versões e comentários",
  "Calendário visual de postagens (mês e semana)",
  "Calendário de eventos, ações e treinamentos",
  "Chamados e suporte com prioridades",
  "Biblioteca de arquivos por cliente e projeto",
  "Reuniões com pauta, ata e próximos passos",
  "Campanhas comerciais com resultados",
  "Relatórios mensais publicados",
  "Notificações em tempo real",
  "Dashboard exclusivo por perfil",
];

function Hub() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">IDEA Hub</p>
          <h1 className="mt-2 max-w-4xl font-display text-5xl font-bold md:text-7xl">
            O portal que <span className="text-brand">organiza, conecta e move</span> sua operação de marketing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Acesse aprovações, calendário, arquivos, chamados, reuniões e relatórios em um login único. Transparência total, ritmo de execução e zero retrabalho.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="brand" size="xl"><Link to="/login">Acessar área restrita</Link></Button>
            <Button asChild variant="outlineBrand" size="xl"><Link to="/diagnostico">Quero conhecer</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-3 rounded-3xl border border-border bg-card p-8 md:grid-cols-2">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-3 rounded-xl px-3 py-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
