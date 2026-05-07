import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/eventos")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Calendário de Eventos" subtitle="Módulo em construção" />
      <Card className="p-10 text-center">
        <p className="text-muted-foreground">Este módulo será habilitado na próxima iteração do IDEA Hub. A estrutura de banco já está pronta.</p>
      </Card>
    </>
  );
}
