import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Edit, Eye, Trash2, FolderKanban, Calendar as CalendarIcon, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProjetos, useDeleteProjeto } from "@/hooks/use-projetos";
import { ProjetoFormDialog } from "@/components/projetos/ProjetoFormDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/app/projetos")({ component: Page });

function Page() {
  const { data: projetos, isLoading } = useProjetos();
  const deleteProjeto = useDeleteProjeto();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjetos = projetos?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.companies?.name && p.companies.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este projeto?")) {
      await deleteProjeto.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Projetos" subtitle="Gestão de entregas e status de projetos" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome do projeto ou cliente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ProjetoFormDialog>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Novo Projeto
          </Button>
        </ProjetoFormDialog>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Projeto</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Status / Prioridade</th>
                <th className="px-4 py-3 font-medium">Prazos</th>
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
              ) : filteredProjetos?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              ) : (
                filteredProjetos?.map((projeto) => (
                  <tr key={projeto.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FolderKanban className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{projeto.name}</div>
                          <div className="text-xs text-muted-foreground">{projeto.type || "Sem tipo definido"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {projeto.companies?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant={getStatusBadgeVariant(projeto.status)}>
                          {formatStatus(projeto.status)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(projeto.priority)}`} />
                          <span className="capitalize">{projeto.priority}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col text-xs text-muted-foreground gap-1">
                        <span className="flex items-center">
                          <span className="w-12 inline-block">Início:</span> 
                          <span className="text-foreground">{projeto.start_date ? format(new Date(projeto.start_date), "dd/MM/yyyy") : "-"}</span>
                        </span>
                        <span className="flex items-center">
                          <span className="w-12 inline-block">Prazo:</span> 
                          <span className={projeto.due_date && new Date(projeto.due_date) < new Date() && projeto.status !== 'finalizado' ? 'text-destructive font-medium' : 'text-foreground'}>
                            {projeto.due_date ? format(new Date(projeto.due_date), "dd/MM/yyyy") : "-"}
                          </span>
                        </span>
                      </div>
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
                            <Link to={`/app/projetos/${projeto.id}`} className="cursor-pointer flex items-center w-full">
                              <Eye className="h-4 w-4 mr-2" /> Visualizar
                            </Link>
                          </DropdownMenuItem>
                          
                          <ProjetoFormDialog projeto={projeto}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                          </ProjetoFormDialog>
                          
                          <DropdownMenuItem onClick={() => handleDelete(projeto.id)} className="text-destructive focus:text-destructive cursor-pointer">
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
