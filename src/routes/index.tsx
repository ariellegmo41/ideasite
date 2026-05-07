import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Target, Megaphone, Users, TrendingUp, Calendar, MessageSquare, BarChart3, Award } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-idea.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IDEA — Estratégia que movimenta negócios" },
      { name: "description", content: "Marketing, vendas e desenvolvimento comercial para empresas que querem crescer de verdade. Estratégia, campanhas, ações externas, treinamentos e CRM." },
      { property: "og:title", content: "IDEA — Estratégia que movimenta negócios" },
      { property: "og:description", content: "Estratégia, comunicação, campanhas, ações externas e treinamentos para empresas que querem crescer." },
    ],
  }),
  component: Home,
});

const services = [
  { icon: Target, title: "Marketing estratégico", desc: "Posicionamento, planejamento e narrativa que sustentam crescimento." },
  { icon: TrendingUp, title: "Estruturação comercial", desc: "Processo, funil, metas e gestão de performance." },
  { icon: Users, title: "Treinamentos de vendas", desc: "Equipes vendendo com método, confiança e consistência." },
  { icon: Award, title: "Treinamentos de liderança", desc: "Líderes preparados para conduzir times de alta performance." },
  { icon: Megaphone, title: "Campanhas comerciais", desc: "Campanhas que fazem o telefone tocar e o caixa girar." },
  { icon: Sparkles, title: "Ações externas", desc: "Marketing presencial, eventos e ativações que geram leads." },
  { icon: Calendar, title: "Eventos corporativos", desc: "Experiências memoráveis com propósito comercial." },
  { icon: MessageSquare, title: "Assessoria mensal", desc: "Time IDEA acompanhando seu negócio mês a mês." },
  { icon: BarChart3, title: "CRM e acompanhamento", desc: "IDEA Hub: portal, aprovações, calendário e relatórios." },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <img src={heroImg} alt="" width={1600} height={1200}
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-cover opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Estratégia que movimenta negócios
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Marketing, vendas e <span className="text-brand">desenvolvimento comercial</span> para empresas que querem crescer de verdade.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              A IDEA une estratégia, comunicação, campanhas, ações externas, treinamentos e CRM de acompanhamento para colocar empresas em movimento.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="brand" size="xl">
                <Link to="/diagnostico">Solicitar diagnóstico <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outlineBrand" size="xl">
                <Link to="/servicos">Conhecer soluções</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">O que fazemos</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Tudo que sua empresa precisa para crescer com método.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="group relative overflow-hidden border-border/60 bg-card p-6 transition hover:border-primary/40 hover:shadow-glow">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section className="relative border-y border-border bg-sidebar py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Por que a IDEA é diferente</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Não somos só agência. Somos parceiros de crescimento.</h2>
            <p className="mt-6 text-muted-foreground">
              Unimos marketing e vendas no mesmo plano, executamos junto com sua equipe e medimos resultado o mês inteiro. Nosso portal IDEA Hub mantém tudo organizado, transparente e em movimento.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Estratégia + execução", "Pensamos e fazemos junto com você."],
              ["Marketing que vende", "Campanhas conectadas a metas comerciais."],
              ["Time multidisciplinar", "Estrategistas, designers, redatores e mentores."],
              ["IDEA Hub exclusivo", "Aprovações, calendário, arquivos e relatórios em um só lugar."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-5">
                <h4 className="font-display text-lg font-semibold">{t}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEA HUB */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-brand p-1 shadow-glow">
          <div className="rounded-[calc(var(--radius)+10px)] bg-background p-10 md:p-16">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">IDEA Hub</p>
                <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Seu portal de marketing e vendas em um só lugar.</h2>
                <p className="mt-4 text-muted-foreground">
                  Aprovação de materiais, calendário de postagens, eventos, chamados, arquivos, reuniões e relatórios. Tudo organizado, transparente e em movimento.
                </p>
                <div className="mt-6"><Button asChild variant="brand" size="lg"><Link to="/idea-hub">Conhecer o IDEA Hub</Link></Button></div>
              </div>
              <ul className="grid gap-3">
                {["Aprovações ágeis", "Calendário visual", "Chamados e suporte", "Arquivos por cliente", "Relatórios mensais", "Tudo em um login"].map((i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-brand" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-sidebar p-10 text-center md:p-16">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Vamos colocar sua empresa em movimento?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Solicite um diagnóstico gratuito e descubra como a IDEA pode acelerar o seu crescimento.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="brand" size="xl"><Link to="/diagnostico">Solicitar diagnóstico</Link></Button>
            <Button asChild variant="outlineBrand" size="xl"><Link to="/contato">Falar com a equipe</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
