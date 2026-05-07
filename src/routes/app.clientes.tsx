import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building2, MoreVertical, Edit, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClientes, useDeleteCliente } from "@/hooks/use-clientes";
import { ClienteFormDialog } from "@/components/clientes/ClienteFormDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const Route = createFileRoute("/app/clientes")({ component: Page });

function Page() {
  const { data: clientes, isLoading } = useClientes();
  const deleteCliente = useDeleteCliente();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.cnpj && c.cnpj.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'ativo': return 'default';
      case 'lead': return 'secondary';
      case 'proposta_enviada': return 'outline';
      case 'pausado': return 'destructive';
      case 'encerrado': return 'destructive';
      case 'inadimplente': return 'destructive';
      case 'implantacao': return 'secondary';
      default: return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este cliente?")) {
      await deleteCliente.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes / CRM" subtitle="Gestão de carteira de clientes" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes por nome, CNPJ ou email..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ClienteFormDialog>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Novo Cliente
          </Button>
        </ClienteFormDialog>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Pacote</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-4 text-right"><Skeleton className="h-5 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredClientes?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredClientes?.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{cliente.name}</div>
                          {cliente.cnpj && <div className="text-xs text-muted-foreground">{cliente.cnpj}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{cliente.main_contact || "-"}</div>
                      <div className="text-xs text-muted-foreground">{cliente.email || cliente.whatsapp || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(cliente.status)}>
                        {formatStatus(cliente.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cliente.package || "-"}
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
                            <Link to={`/app/clientes/${cliente.id}`} className="cursor-pointer flex items-center w-full">
                              <Eye className="h-4 w-4 mr-2" /> Visualizar
                            </Link>
                          </DropdownMenuItem>
                          
                          <ClienteFormDialog cliente={cliente}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                          </ClienteFormDialog>
                          
                          <DropdownMenuItem onClick={() => handleDelete(cliente.id)} className="text-destructive focus:text-destructive cursor-pointer">
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
