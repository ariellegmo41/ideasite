import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [
    { title: "Sobre a IDEA" },
    { name: "description", content: "Conheça a IDEA: estratégia, marketing, vendas e desenvolvimento comercial para empresas em movimento." },
    { property: "og:title", content: "Sobre a IDEA" },
    { property: "og:description", content: "Estratégia, marketing e vendas para empresas que querem crescer." },
  ]}),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Quem somos</p>
        <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">A IDEA é <span className="text-brand">estratégia em movimento</span>.</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <p className="text-lg text-muted-foreground">
            Somos uma empresa de marketing, vendas e desenvolvimento comercial que ajuda empresas a crescerem com método. Unimos estratégia, comunicação, campanhas, ações externas, treinamentos, liderança e acompanhamento de performance.
          </p>
          <p className="text-lg text-muted-foreground">
            Acreditamos que marketing sem vendas é decoração e vendas sem marketing é esforço. Por isso pensamos e executamos junto com você — com transparência total no nosso portal IDEA Hub.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Missão", "Colocar empresas em movimento com estratégia e execução de verdade."],
            ["Visão", "Ser referência em desenvolvimento comercial integrado a marketing."],
            ["Valores", "Estratégia, transparência, ritmo, criatividade e resultado."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-2xl font-bold text-brand">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
