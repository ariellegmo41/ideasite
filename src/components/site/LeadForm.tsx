import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  whatsapp: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(255),
  segment: z.string().trim().max(120).optional().or(z.literal("")),
  challenge: z.string().trim().max(1000).optional().or(z.literal("")),
});

interface Props { source: string; material?: string; cta?: string; compact?: boolean }

export function LeadForm({ source, material, cta = "Enviar", compact }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", whatsapp: "", email: "", segment: "", challenge: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Verifique os campos obrigatórios.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({ ...parsed.data, source, material: material ?? null });
    setLoading(false);
    if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
    toast.success("Recebemos seu contato! Em breve falamos com você.");
    setForm({ name: "", company: "", whatsapp: "", email: "", segment: "", challenge: "" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <div><Label>Nome*</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
        <div><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} /></div>
        <div><Label>WhatsApp*</Label><Input value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} required /></div>
        <div><Label>E-mail*</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
        <div><Label>Segmento</Label><Input value={form.segment} onChange={(e) => setForm({...form, segment: e.target.value})} /></div>
      </div>
      <div><Label>Principal desafio</Label><Textarea rows={4} value={form.challenge} onChange={(e) => setForm({...form, challenge: e.target.value})} /></div>
      <Button type="submit" variant="brand" size="xl" disabled={loading} className="w-full">
        {loading ? "Enviando..." : cta}
      </Button>
    </form>
  );
}
