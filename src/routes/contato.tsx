import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [
    { title: "Contato — IDEA" },
    { name: "description", content: "Fale com a IDEA. Estamos prontos para colocar sua empresa em movimento." },
    { property: "og:title", content: "Contato IDEA" },
    { property: "og:description", content: "Vamos conversar sobre sua próxima fase de crescimento." },
  ]}),
  component: Contato,
});

function Contato() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contato</p>
            <h1 className="mt-2 font-display text-5xl font-bold">Vamos <span className="text-brand">conversar</span>.</h1>
            <p className="mt-6 text-muted-foreground">Conta o que está rolando na sua empresa. A gente responde rápido.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> contato@idea.com.br</div>
              <div className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-primary" /> WhatsApp em breve</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Brasil</div>
            </div>
          </div>
          <div className="md:col-span-3 rounded-2xl border border-border bg-card p-6">
            <LeadForm source="contato" cta="Enviar mensagem" compact />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
