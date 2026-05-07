import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Card } from "@/components/ui/card";
import { Users, CheckSquare, LifeBuoy, Calendar, FileBarChart, Megaphone, Briefcase, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const { isStaff, user } = useAuth();
  return isStaff ? <StaffDash /> : <ClientDash userId={user!.id} />;
}

function StaffDash() {
  const [stats, setStats] = useState({ companies: 0, pending: 0, openTickets: 0, urgentTickets: 0, weekPosts: 0, weekMeetings: 0, activeCampaigns: 0, latePjt: 0 });
  useEffect(() => { (async () => {
    const today = new Date();
    const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString();
    const todayIso = today.toISOString();
    const [c, ap, t, tu, p, m, ca, pj] = await Promise.all([
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "ativo"),
      supabase.from("approvals").select("id", { count: "exact", head: true }).in("status", ["enviado", "visualizado", "reenviado"]),
      supabase.from("tickets").select("id", { count: "exact", head: true }).in("status", ["aberto", "em_analise", "em_andamento"]),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("priority", "urgente").neq("status", "encerrado"),
      supabase.from("calendar_posts").select("id", { count: "exact", head: true }).gte("publish_date", todayIso).lte("publish_date", weekFromNow),
      supabase.from("meetings").select("id", { count: "exact", head: true }).gte("meeting_date", todayIso).lte("meeting_date", weekFromNow),
      supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "ativa"),
      supabase.from("projects").select("id", { count: "exact", head: true }).lt("due_date", today.toISOString().slice(0, 10)).not("status", "in", "(finalizado,publicado,aprovado)"),
    ]);
    setStats({
      companies: c.count ?? 0, pending: ap.count ?? 0, openTickets: t.count ?? 0, urgentTickets: tu.count ?? 0,
      weekPosts: p.count ?? 0, weekMeetings: m.count ?? 0, activeCampaigns: ca.count ?? 0, latePjt: pj.count ?? 0,
    });
  })(); }, []);

  return (
    <>
      <PageHeader title="Dashboard IDEA" subtitle="Visão geral da operação" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes ativos" value={stats.companies} icon={Users} accent />
        <StatCard label="Aprovações pendentes" value={stats.pending} icon={CheckSquare} />
        <StatCard label="Chamados abertos" value={stats.openTickets} icon={LifeBuoy} />
        <StatCard label="Chamados urgentes" value={stats.urgentTickets} icon={AlertTriangle} />
        <StatCard label="Postagens da semana" value={stats.weekPosts} icon={Calendar} />
        <StatCard label="Reuniões da semana" value={stats.weekMeetings} icon={Calendar} />
        <StatCard label="Campanhas ativas" value={stats.activeCampaigns} icon={Megaphone} />
        <StatCard label="Projetos atrasados" value={stats.latePjt} icon={Briefcase} />
      </div>
    </>
  );
}

function ClientDash({ userId }: { userId: string }) {
  const [data, setData] = useState<any>({ company: null, approvals: [], posts: [], events: [], meetings: [], tickets: [], reports: [] });
  useEffect(() => { (async () => {
    const { data: prof } = await supabase.from("profiles").select("company_id, full_name").eq("id", userId).single();
    if (!prof?.company_id) return;
    const cid = prof.company_id;
    const [co, ap, po, ev, me, ti, re] = await Promise.all([
      supabase.from("companies").select("*").eq("id", cid).single(),
      supabase.from("approvals").select("*").eq("company_id", cid).in("status", ["enviado", "visualizado", "reenviado"]).order("scheduled_date").limit(5),
      supabase.from("calendar_posts").select("*").eq("company_id", cid).gte("publish_date", new Date().toISOString()).order("publish_date").limit(5),
      supabase.from("events").select("*").eq("company_id", cid).gte("event_date", new Date().toISOString()).order("event_date").limit(5),
      supabase.from("meetings").select("*").eq("company_id", cid).gte("meeting_date", new Date().toISOString()).order("meeting_date").limit(5),
      supabase.from("tickets").select("*").eq("company_id", cid).neq("status", "encerrado").order("created_at", { ascending: false }).limit(5),
      supabase.from("reports").select("*").eq("company_id", cid).eq("is_published", true).order("publish_date", { ascending: false }).limit(5),
    ]);
    setData({ company: co.data, approvals: ap.data ?? [], posts: po.data ?? [], events: ev.data ?? [], meetings: me.data ?? [], tickets: ti.data ?? [], reports: re.data ?? [] });
  })(); }, [userId]);

  if (!data.company) return (
    <>
      <PageHeader title="Bem-vindo ao IDEA Hub" />
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Sua conta ainda não está vinculada a uma empresa. A equipe IDEA fará a vinculação em breve.</p>
      </Card>
    </>
  );

  return (
    <>
      <PageHeader title={data.company.name} subtitle={data.company.package ? `Pacote: ${data.company.package}` : "Bem-vindo ao IDEA Hub"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aprovações pendentes" value={data.approvals.length} icon={CheckSquare} accent />
        <StatCard label="Próximas postagens" value={data.posts.length} icon={Calendar} />
        <StatCard label="Próximos eventos" value={data.events.length} icon={Calendar} />
        <StatCard label="Chamados abertos" value={data.tickets.length} icon={LifeBuoy} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ListCard title="Aprovações aguardando você" items={data.approvals} render={(a: any) => <><span>{a.title}</span><StatusBadge value={a.status} /></>} />
        <ListCard title="Próximas reuniões" items={data.meetings} render={(m: any) => <><span>{m.title}</span><span className="text-xs text-muted-foreground">{m.meeting_date && new Date(m.meeting_date).toLocaleDateString("pt-BR")}</span></>} />
        <ListCard title="Próximas postagens" items={data.posts} render={(p: any) => <><span>{p.title}</span><span className="text-xs text-muted-foreground">{p.channel}</span></>} />
        <ListCard title="Relatórios disponíveis" items={data.reports} render={(r: any) => <><span><FileBarChart className="mr-1 inline h-3 w-3" />{r.title}</span><span className="text-xs text-muted-foreground">{r.period}</span></>} />
      </div>
    </>
  );
}

function ListCard({ title, items, render }: { title: string; items: any[]; render: (i: any) => React.ReactNode }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-display text-lg font-semibold">{title}</h3>
      {items.length === 0 ? <p className="text-sm text-muted-foreground">Nada por aqui ainda.</p> : (
        <ul className="divide-y divide-border">
          {items.map((it) => <li key={it.id} className="flex items-center justify-between py-3 text-sm">{render(it)}</li>)}
        </ul>
      )}
    </Card>
  );
}
