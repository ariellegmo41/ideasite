import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/materiais")({
  head: () => ({ meta: [
    { title: "Materiais Gratuitos — IDEA" },
    { name: "description", content: "E-books, guias e checklists gratuitos sobre marketing, vendas e gestão comercial." },
    { property: "og:title", content: "Materiais Gratuitos IDEA" },
    { property: "og:description", content: "Conteúdos práticos para acelerar seu negócio." },
  ]}),
  component: Materiais,
});

const materiais = [
  { t: "Guia: Estruturando o Comercial", d: "Passo a passo para montar uma operação de vendas que escala." },
  { t: "Checklist de Campanhas que Vendem", d: "Tudo que sua próxima campanha precisa ter para gerar resultado." },
  { t: "E-book: Marketing que vira venda", d: "Como conectar marketing e vendas no mesmo plano." },
  { t: "Playbook de WhatsApp Comercial", d: "Scripts e cadências para vender mais pelo WhatsApp." },
];

function Materiais() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Materiais gratuitos</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Conteúdos práticos para <span className="text-brand">acelerar seu negócio</span>.</h1>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {materiais.map((m) => <MaterialCard key={m.t} {...m} />)}
        </div>
      </section>
    </SiteLayout>
  );
}

function MaterialCard({ t, d }: { t: string; d: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground"><FileText /></div>
      <div className="flex-1">
        <h3 className="font-display text-xl font-semibold">{t}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{d}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" size="sm" className="mt-4"><Download className="mr-1 h-4 w-4" /> Baixar grátis</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Receber: {t}</DialogTitle></DialogHeader>
            <LeadForm source="material" material={t} cta="Receber material" compact />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
