import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({ meta: [
    { title: "Diagnóstico Comercial — IDEA" },
    { name: "description", content: "Solicite um diagnóstico comercial gratuito e descubra como acelerar o crescimento da sua empresa." },
    { property: "og:title", content: "Diagnóstico Comercial Gratuito" },
    { property: "og:description", content: "Em uma conversa identificamos onde sua empresa pode crescer mais." },
  ]}),
  component: Diag,
});

function Diag() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Diagnóstico</p>
            <h1 className="mt-2 font-display text-5xl font-bold">Descubra onde sua empresa pode <span className="text-brand">crescer mais</span>.</h1>
            <p className="mt-6 text-muted-foreground">
              Em uma conversa estratégica, mapeamos pontos fortes, gargalos e oportunidades de marketing e vendas. Sem custo, sem compromisso.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li>• Análise de marketing e comunicação</li>
              <li>• Avaliação do processo comercial</li>
              <li>• Sugestões práticas e priorização</li>
              <li>• Plano de próximos passos</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <LeadForm source="diagnostico" cta="Solicitar diagnóstico gratuito" compact />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
