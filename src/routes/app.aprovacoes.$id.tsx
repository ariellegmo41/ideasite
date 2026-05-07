import { createFileRoute, Link } from "@tanstack/react-router";
import { useAprovacao, useUpdateAprovacao } from "@/hooks/use-aprovacoes";
import { PageHeader } from "@/components/app/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CheckCircle2, FileImage, ExternalLink, MessageSquare, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import { AprovacaoComentarios } from "@/components/aprovacoes/AprovacaoComentarios";

export const Route = createFileRoute("/app/aprovacoes/$id")({
  component: AprovacaoDetailsPage,
});

function AprovacaoDetailsPage() {
  const { id } = Route.useParams();
  const { data: aprovacao, isLoading, error } = useAprovacao(id);
  const updateAprovacao = useUpdateAprovacao();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] lg:col-span-2" />
          <Skeleton className="h-[500px] lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (error || !aprovacao) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Material não encontrado</h2>
        <p className="text-muted-foreground mb-6">O material que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/app/aprovacoes">Voltar para Aprovações</Link>
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
      case 'finalizado':
      case 'publicado': return 'default';
      case 'rascunho': return 'outline';
      case 'enviado': 
      case 'reenviado':
      case 'visualizado': return 'secondary';
      case 'ajustes_solicitados': return 'destructive';
      default: return 'outline';
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    await updateAprovacao.mutateAsync({
      id: aprovacao.id,
      updates: { status: newStatus as any }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/aprovacoes"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <PageHeader title={aprovacao.title} subtitle={`V${aprovacao.version} • ${aprovacao.piece_type}`} className="mb-0" />
        </div>

        <div className="flex items-center gap-3">
          {aprovacao.status !== 'aprovado' && aprovacao.status !== 'finalizado' && aprovacao.status !== 'publicado' && (
            <>
              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive"
                onClick={() => handleUpdateStatus("ajustes_solicitados")}
                disabled={updateAprovacao.isPending}
              >
                Solicitar Ajuste
              </Button>
              <Button 
                onClick={() => handleUpdateStatus("aprovado")}
                disabled={updateAprovacao.isPending}
              >
                Aprovar Material
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Material (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Visualização do Material
              </CardTitle>
              <Badge variant={getStatusBadgeVariant(aprovacao.status)} className="text-sm">
                {formatStatus(aprovacao.status)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {aprovacao.file_url ? (
                <div className="flex flex-col gap-4">
                  <div className="aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center p-8 text-center overflow-hidden relative group">
                    {/* Exibição simplificada - em prod idealmente teria um iframe ou image preview baseado na URL */}
                    <div className="z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                      <FileImage className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">Arquivo disponível via Link</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full sm:w-auto self-start">
                    <a href={aprovacao.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Acessar Arquivo Externo
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="aspect-video bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground p-8 text-center">
                  <p>Nenhum link de arquivo foi fornecido para este material.</p>
                </div>
              )}

              <div className="pt-4 border-t border-border/50">
                <h3 className="font-medium mb-3">Legenda / Descrição</h3>
                {aprovacao.caption ? (
                  <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                    {aprovacao.caption}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">Nenhuma legenda fornecida.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Informações e Feed de Comentários (1/3) */}
        <div className="space-y-6 flex flex-col h-full">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Contexto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="font-medium">{aprovacao.companies?.name || "Não informado"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Projeto Vinculado</span>
                <span className="font-medium">{aprovacao.projects?.name || "Nenhum projeto"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5"/> Data Prevista
                </span>
                <span className="font-medium">
                  {aprovacao.scheduled_date 
                    ? format(new Date(aprovacao.scheduled_date), "dd 'de' MMMM, yyyy", { locale: ptBR }) 
                    : "Não definida"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comentários e Ajustes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-6">
              <AprovacaoComentarios approvalId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
