import { createFileRoute, Link } from "@tanstack/react-router";
import { useCliente } from "@/hooks/use-clientes";
import { PageHeader } from "@/components/app/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, MapPin, Phone, User, CalendarDays, DollarSign, Package, ArrowLeft } from "lucide-react";
import { ClienteTimeline } from "@/components/clientes/ClienteTimeline";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/clientes/$id")({
  component: ClienteDetailsPage,
});

function ClienteDetailsPage() {
  const { id } = Route.useParams();
  const { data: cliente, isLoading, error } = useCliente(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
        <p className="text-muted-foreground mb-6">O cliente que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/app/clientes">Voltar para Clientes</Link>
        </Button>
      </div>
    );
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/clientes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PageHeader title={cliente.name} subtitle={cliente.segment || "Sem segmento definido"} className="mb-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Informações Principais */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Detalhes da Empresa
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(cliente.status)}>
                  {formatStatus(cliente.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">CNPJ</span>
                <span className="font-medium">{cliente.cnpj || "Não informado"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/> Cidade</span>
                <span className="font-medium">{cliente.city || "Não informada"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Responsável</span>
                <span className="font-medium">{cliente.main_contact || "Não informado"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="h-3.5 w-3.5"/> E-mail</span>
                <span className="font-medium">{cliente.email || "Não informado"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-3.5 w-3.5"/> WhatsApp</span>
                <span className="font-medium">{cliente.whatsapp || "Não informado"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Pacote Contratado</span>
                <span className="font-medium">{cliente.package || "Nenhum"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-3.5 w-3.5"/> Valor Mensal</span>
                <span className="font-medium">
                  {cliente.monthly_value ? `R$ ${Number(cliente.monthly_value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "Não informado"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5"/> Início</span>
                <span className="font-medium">
                  {cliente.start_date ? new Date(cliente.start_date).toLocaleDateString('pt-BR') : "Não informado"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Timeline e Atividades */}
        <div className="lg:col-span-2 space-y-6">
          <ClienteTimeline companyId={id} />
          
          {cliente.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{cliente.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
