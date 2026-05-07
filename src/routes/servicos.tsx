import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/servicos")({
  head: () => ({ meta: [
    { title: "Serviços — IDEA" },
    { name: "description", content: "Marketing estratégico, estruturação comercial, treinamentos, campanhas, ações externas, eventos e assessoria mensal." },
    { property: "og:title", content: "Serviços IDEA" },
    { property: "og:description", content: "Soluções completas em marketing e vendas." },
  ]}),
  component: Servicos,
});

const list = [
  { t: "Marketing estratégico", d: "Posicionamento, planejamento, comunicação e narrativa que sustentam o crescimento." },
  { t: "Estruturação comercial", d: "Processo de vendas, funil, metas, indicadores e gestão de performance." },
  { t: "Treinamentos de vendas", d: "Vendas consultivas, follow-up, contorno de objeções, atendimento e WhatsApp comercial." },
  { t: "Treinamentos de liderança", d: "Líderes preparados para conduzir times de alta performance." },
  { t: "Campanhas comerciais", d: "Lançamentos, datas comemorativas, captação de leads, B2B e mais." },
  { t: "Ações externas de marketing", d: "Ativações, panfletagem qualificada, abordagem e ações de rua que geram leads." },
  { t: "Eventos corporativos", d: "Workshops, palestras e experiências com propósito comercial." },
  { t: "Assessoria mensal", d: "Time IDEA acompanhando seu negócio mês a mês com ritmo e indicadores." },
  { t: "CRM e acompanhamento", d: "IDEA Hub: portal completo com aprovações, calendário, chamados e relatórios." },
];

function Servicos() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Soluções</p>
        <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">Tudo o que sua empresa precisa <span className="text-brand">para crescer</span>.</h1>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <div key={s.t} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
              <div className="text-5xl font-display font-bold text-brand opacity-30">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild variant="brand" size="xl"><Link to="/diagnostico">Solicitar diagnóstico</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
