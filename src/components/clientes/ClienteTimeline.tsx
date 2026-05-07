import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle2, FileText, MessageSquare, Plus, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineEvent {
  id: string;
  type: "project" | "ticket" | "file" | "meeting" | "approval";
  title: string;
  description?: string;
  date: string;
  status?: string;
}

export function ClienteTimeline({ companyId }: { companyId: string }) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["cliente-timeline", companyId],
    queryFn: async () => {
      // Busca paralela em diversas tabelas para compor a timeline
      const [
        { data: projects },
        { data: tickets },
        { data: files },
        { data: meetings },
        { data: approvals }
      ] = await Promise.all([
        supabase.from("projects").select("id, name, created_at, status").eq("company_id", companyId),
        supabase.from("tickets").select("id, title, created_at, status").eq("company_id", companyId),
        supabase.from("files").select("id, name, created_at").eq("company_id", companyId),
        supabase.from("meetings").select("id, title, created_at, status").eq("company_id", companyId),
        supabase.from("approvals").select("id, title, created_at, status").eq("company_id", companyId),
      ]);

      const timeline: TimelineEvent[] = [];

      projects?.forEach(p => timeline.push({
        id: `p-${p.id}`, type: "project", title: `Projeto criado: ${p.name}`, date: p.created_at, status: p.status
      }));
      tickets?.forEach(t => timeline.push({
        id: `t-${t.id}`, type: "ticket", title: `Chamado aberto: ${t.title}`, date: t.created_at, status: t.status
      }));
      files?.forEach(f => timeline.push({
        id: `f-${f.id}`, type: "file", title: `Arquivo adicionado: ${f.name}`, date: f.created_at
      }));
      meetings?.forEach(m => timeline.push({
        id: `m-${m.id}`, type: "meeting", title: `Reunião agendada: ${m.title}`, date: m.created_at, status: m.status
      }));
      approvals?.forEach(a => timeline.push({
        id: `a-${a.id}`, type: "approval", title: `Material para aprovação: ${a.title}`, date: a.created_at, status: a.status
      }));

      // Ordenar do mais recente para o mais antigo
      return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: !!companyId
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "project": return <Plus className="h-4 w-4 text-blue-500" />;
      case "ticket": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case "file": return <FileText className="h-4 w-4 text-slate-500" />;
      case "meeting": return <Video className="h-4 w-4 text-purple-500" />;
      case "approval": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline de Interações</CardTitle>
        <CardDescription>Histórico recente de atividades deste cliente</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : events?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhuma interação registrada ainda.</p>
        ) : (
          <div className="relative border-l border-border/50 ml-3 space-y-6">
            {events?.map((event) => (
              <div key={event.id} className="mb-6 ml-6 relative">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-10 ring-4 ring-background bg-muted">
                  {getEventIcon(event.type)}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-medium text-foreground">{event.title}</h3>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </time>
                </div>
                {event.status && (
                  <p className="text-xs text-muted-foreground">Status: <span className="font-medium">{event.status.replace(/_/g, ' ')}</span></p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
