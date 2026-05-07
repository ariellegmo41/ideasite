import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Edit, Eye, Trash2, CheckCircle2, FileImage, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAprovacoes, useDeleteAprovacao } from "@/hooks/use-aprovacoes";
import { AprovacaoFormDialog } from "@/components/aprovacoes/AprovacaoFormDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/app/aprovacoes")({ component: Page });

function Page() {
  const { data: aprovacoes, isLoading } = useAprovacoes();
  const deleteAprovacao = useDeleteAprovacao();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAprovacoes = aprovacoes?.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.companies?.name && a.companies.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este material?")) {
      await deleteAprovacao.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Aprovações" subtitle="Central de materiais e peças para validação do cliente" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por título ou cliente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <AprovacaoFormDialog>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Novo Material
          </Button>
        </AprovacaoFormDialog>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Cliente / Projeto</th>
                <th className="px-4 py-3 font-medium">Data Prevista</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-48" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-4 text-right"><Skeleton className="h-5 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAprovacoes?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum material encontrado.
                  </td>
                </tr>
              ) : (
                filteredAprovacoes?.map((aprovacao) => (
                  <tr key={aprovacao.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {aprovacao.status === 'aprovado' || aprovacao.status === 'finalizado' || aprovacao.status === 'publicado' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : aprovacao.status === 'ajustes_solicitados' ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <FileImage className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{aprovacao.title}</div>
                          <div className="text-xs text-muted-foreground">V{aprovacao.version} • {aprovacao.piece_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">{aprovacao.companies?.name || "-"}</div>
                      <div className="text-xs text-muted-foreground">{aprovacao.projects?.name || "Sem projeto"}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {aprovacao.scheduled_date ? format(new Date(aprovacao.scheduled_date), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(aprovacao.status)}>
                        {formatStatus(aprovacao.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/app/aprovacoes/${aprovacao.id}`} className="cursor-pointer flex items-center w-full">
                              <Eye className="h-4 w-4 mr-2" /> Revisar Material
                            </Link>
                          </DropdownMenuItem>
                          
                          <AprovacaoFormDialog aprovacao={aprovacao}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" /> Editar Detalhes
                            </DropdownMenuItem>
                          </AprovacaoFormDialog>
                          
                          <DropdownMenuItem onClick={() => handleDelete(aprovacao.id)} className="text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="h-4 w-4 mr-2" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
