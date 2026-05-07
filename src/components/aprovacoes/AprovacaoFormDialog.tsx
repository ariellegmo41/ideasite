import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAprovacao, useUpdateAprovacao, Approval } from "@/hooks/use-aprovacoes";
import { useClientes } from "@/hooks/use-clientes";
import { useProjetos } from "@/hooks/use-projetos";

const formSchema = z.object({
  title: z.string().min(2, "Título é obrigatório"),
  company_id: z.string().uuid("Selecione um cliente"),
  project_id: z.string().optional().or(z.literal("")),
  piece_type: z.string().min(2, "Tipo da peça é obrigatório"),
  scheduled_date: z.string().optional(),
  caption: z.string().optional(),
  file_url: z.string().url("URL do arquivo inválida").optional().or(z.literal("")),
  status: z.enum([
    "rascunho", "enviado", "visualizado", "aprovado", 
    "ajustes_solicitados", "reenviado", "finalizado", "publicado"
  ]),
});

type FormValues = z.infer<typeof formSchema>;

interface AprovacaoFormDialogProps {
  children?: React.ReactNode;
  aprovacao?: Approval;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preselectedCompanyId?: string;
  preselectedProjectId?: string;
}

export function AprovacaoFormDialog({ 
  children, 
  aprovacao, 
  open: controlledOpen, 
  onOpenChange,
  preselectedCompanyId,
  preselectedProjectId
}: AprovacaoFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const createAprovacao = useCreateAprovacao();
  const updateAprovacao = useUpdateAprovacao();
  const { data: clientes } = useClientes();
  const { data: projetos } = useProjetos();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company_id: preselectedCompanyId || "",
      project_id: preselectedProjectId || "",
      piece_type: "",
      scheduled_date: "",
      caption: "",
      file_url: "",
      status: "rascunho",
    },
  });

  // Filtrar projetos baseados no cliente selecionado
  const selectedCompanyId = form.watch("company_id");
  const filteredProjetos = projetos?.filter(p => p.company_id === selectedCompanyId) || [];

  useEffect(() => {
    if (aprovacao && open) {
      form.reset({
        title: aprovacao.title || "",
        company_id: aprovacao.company_id || "",
        project_id: aprovacao.project_id || "",
        piece_type: aprovacao.piece_type || "",
        scheduled_date: aprovacao.scheduled_date || "",
        caption: aprovacao.caption || "",
        file_url: aprovacao.file_url || "",
        status: aprovacao.status,
      });
    } else if (!aprovacao && open) {
      form.reset({
        title: "",
        company_id: preselectedCompanyId || "",
        project_id: preselectedProjectId || "",
        piece_type: "",
        scheduled_date: "",
        caption: "",
        file_url: "",
        status: "rascunho",
      });
    }
  }, [aprovacao, open, form, preselectedCompanyId, preselectedProjectId]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (aprovacao?.id) {
        await updateAprovacao.mutateAsync({ 
          id: aprovacao.id, 
          updates: {
            ...values,
            project_id: values.project_id === "" ? null : values.project_id
          } 
        });
      } else {
        await createAprovacao.mutateAsync({
          ...values,
          project_id: values.project_id === "" ? null : values.project_id
        } as any);
      }
      setOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>{aprovacao ? "Editar Material" : "Enviar Material para Aprovação"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="company_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!!preselectedCompanyId && !aprovacao}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes?.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="project_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Projeto (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedCompanyId || (!!preselectedProjectId && !aprovacao)}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Vincular projeto..." /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Sem projeto</SelectItem>
                      {filteredProjetos.map((projeto) => (
                        <SelectItem key={projeto.id} value={projeto.id}>
                          {projeto.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Título do Material *</FormLabel>
                  <FormControl><Input placeholder="Ex: Post Carrossel Instagram" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="piece_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Peça *</FormLabel>
                  <FormControl><Input placeholder="Ex: Arte, Reel, Legenda..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="scheduled_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Prevista</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="file_url" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Link do Arquivo (URL da Arte, Drive, Figma, etc)</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} type="url" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="enviado">Enviado para Aprovação</SelectItem>
                      <SelectItem value="visualizado">Visualizado pelo Cliente</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="ajustes_solicitados">Ajustes Solicitados</SelectItem>
                      <SelectItem value="reenviado">Ajustado e Reenviado</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                      <SelectItem value="publicado">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="caption" render={({ field }) => (
              <FormItem>
                <FormLabel>Legenda / Descrição</FormLabel>
                <FormControl><Textarea {...field} className="resize-none" rows={4} placeholder="Digite a legenda que acompanhará a peça..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createAprovacao.isPending || updateAprovacao.isPending}>
                {createAprovacao.isPending || updateAprovacao.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
