import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, Briefcase, CheckSquare, Calendar, CalendarDays, LifeBuoy, FolderOpen, Video, Megaphone, MapPin, GraduationCap, FileBarChart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/clientes", label: "Clientes / CRM", icon: Users, staff: true },
  { to: "/app/projetos", label: "Projetos", icon: Briefcase },
  { to: "/app/aprovacoes", label: "Aprovações", icon: CheckSquare },
  { to: "/app/postagens", label: "Calendário Postagens", icon: Calendar },
  { to: "/app/eventos", label: "Calendário Eventos", icon: CalendarDays },
  { to: "/app/chamados", label: "Chamados", icon: LifeBuoy },
  { to: "/app/arquivos", label: "Arquivos", icon: FolderOpen },
  { to: "/app/reunioes", label: "Reuniões", icon: Video },
  { to: "/app/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/app/acoes", label: "Ações Externas", icon: MapPin },
  { to: "/app/treinamentos", label: "Treinamentos", icon: GraduationCap },
  { to: "/app/relatorios", label: "Relatórios", icon: FileBarChart },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppSidebar() {
  const { isStaff, signOut, user } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="h-9 w-9 rounded-xl bg-brand shadow-glow" />
        <div>
          <div className="font-display text-lg font-bold leading-none">IDEA<span className="text-brand">.</span></div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Hub</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.filter((i) => !i.staff || isStaff).map((i) => {
          const active = i.exact ? path === i.to : path.startsWith(i.to);
          return (
            <Link key={i.to} to={i.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-brand text-primary-foreground font-semibold shadow-glow" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
              <i.icon className="h-4 w-4" /> {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={async () => { await signOut(); nav({ to: "/login" }); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </aside>
  );
}
