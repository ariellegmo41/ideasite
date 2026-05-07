import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — IDEA Hub" }, { name: "description", content: "Acesse o IDEA Hub." }] }),
  component: LoginPage,
});

const emailSchema = z.string().trim().email().max(255);
const passSchema = z.string().min(6).max(72);

function LoginPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  useEffect(() => {
    if (!loading && user) nav({ to: "/app" });
  }, [user, loading, nav]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!emailSchema.safeParse(form.email).success || !passSchema.safeParse(form.password).success) {
      toast.error("E-mail ou senha inválidos."); return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else nav({ to: "/app" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (!emailSchema.safeParse(form.email).success || !passSchema.safeParse(form.password).success) {
      toast.error("Verifique e-mail e senha (mín. 6 caracteres)."); return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { emailRedirectTo: window.location.origin + "/app", data: { full_name: form.name } },
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else { toast.success("Conta criada! Você já pode entrar."); }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <div className="absolute inset-0 bg-brand opacity-90" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-background/20" />
            <span className="font-display text-xl font-bold">IDEA.</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">Estratégia que movimenta negócios.</h2>
            <p className="mt-4 max-w-md opacity-90">O IDEA Hub é o portal exclusivo dos clientes IDEA. Aprovações, calendário, arquivos, chamados e relatórios em um só lugar.</p>
          </div>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} IDEA</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">← Voltar ao site</Link>
          <h1 className="font-display text-3xl font-bold">Bem-vindo</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesse sua área no IDEA Hub.</p>
          <Tabs defaultValue="signin" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4">
                <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
                <div><Label>Senha</Label><Input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required /></div>
                <Button type="submit" variant="brand" className="w-full" disabled={submitting}>{submitting ? "Entrando..." : "Entrar"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4">
                <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
                <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
                <div><Label>Senha</Label><Input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required /></div>
                <Button type="submit" variant="brand" className="w-full" disabled={submitting}>{submitting ? "Criando..." : "Criar conta"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
