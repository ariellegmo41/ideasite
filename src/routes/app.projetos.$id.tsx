import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjeto } from "@/hooks/use-projetos";
import { PageHeader } from "@/components/app/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar as CalendarIcon, Flag, FolderKanban, AlignLeft, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/projetos/$id")({
  component: ProjetoDetailsPage,
});

function ProjetoDetailsPage() {
  const { id } = Route.useParams();
  const { data: projeto, isLoading, error } = useProjeto(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64 md:col-span-1" />
        </div>
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
        <p className="text-muted-foreground mb-6">O projeto que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/app/projetos">Voltar para Projetos</Link>
        </Button>
      </div>
    );
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'aprovado': 
      case 'publicado': 
      case 'finalizado': return 'default';
      case 'planejado': return 'outline';
      case 'em_producao': 
      case 'em_revisao': return 'secondary';
      case 'aguardando_aprovacao': return 'secondary';
      case 'ajustes_solicitados': 
      case 'pausado': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgente': return 'text-red-500';
      case 'alta': return 'text-orange-500';
      case 'media': return 'text-yellow-500';
      case 'baixa': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/projetos"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PageHeader title={projeto.name} subtitle={projeto.type || "Projeto"} className="mb-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Descrição (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlignLeft className="h-5 w-5 text-primary" />
                Descrição do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projeto.description ? (
                <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                  {projeto.description}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Nenhuma descrição fornecida para este projeto.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Detalhes e Status (1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                Status e Prazos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">Status Atual</span>
                <div>
                  <Badge variant={getStatusBadgeVariant(projeto.status)} className="text-sm">
                    {formatStatus(projeto.status)}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">Prioridade</span>
                <div className="flex items-center font-medium">
                  <Flag className={`h-4 w-4 mr-2 ${getPriorityColor(projeto.priority)}`} />
                  <span className="capitalize">{projeto.priority}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Data de Início
                </span>
                <span className="font-medium">
                  {projeto.start_date ? format(new Date(projeto.start_date), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Não definida"}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Prazo (Entrega)
                </span>
                <span className={`font-medium ${projeto.due_date && new Date(projeto.due_date) < new Date() && projeto.status !== 'finalizado' ? 'text-destructive' : ''}`}>
                  {projeto.due_date ? format(new Date(projeto.due_date), "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Não definido"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Cliente Vinculado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projeto.companies ? (
                <div className="flex flex-col gap-3">
                  <span className="font-medium text-lg">{projeto.companies.name}</span>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/app/clientes/${projeto.company_id}`}>
                      Ver Perfil do Cliente
                    </Link>
                  </Button>
                </div>
              ) : (
                <span className="text-muted-foreground">Nenhum cliente vinculado</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
