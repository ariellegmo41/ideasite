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
import { useCreateProjeto, useUpdateProjeto, Project } from "@/hooks/use-projetos";
import { useClientes } from "@/hooks/use-clientes";

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  company_id: z.string().uuid("Selecione um cliente"),
  type: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  status: z.enum([
    "planejado", "em_producao", "em_revisao", "aguardando_aprovacao", 
    "ajustes_solicitados", "aprovado", "publicado", "finalizado", "pausado"
  ]),
  priority: z.enum(["baixa", "media", "alta", "urgente"]),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjetoFormDialogProps {
  children?: React.ReactNode;
  projeto?: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preselectedCompanyId?: string;
}

export function ProjetoFormDialog({ children, projeto, open: controlledOpen, onOpenChange, preselectedCompanyId }: ProjetoFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const createProjeto = useCreateProjeto();
  const updateProjeto = useUpdateProjeto();
  const { data: clientes } = useClientes();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company_id: preselectedCompanyId || "",
      type: "",
      description: "",
      start_date: "",
      due_date: "",
      status: "planejado",
      priority: "media",
    },
  });

  useEffect(() => {
    if (projeto && open) {
      form.reset({
        name: projeto.name || "",
        company_id: projeto.company_id || "",
        type: projeto.type || "",
        description: projeto.description || "",
        start_date: projeto.start_date || "",
        due_date: projeto.due_date || "",
        status: projeto.status,
        priority: projeto.priority,
      });
    } else if (!projeto && open) {
      form.reset({
        name: "",
        company_id: preselectedCompanyId || "",
        type: "",
        description: "",
        start_date: "",
        due_date: "",
        status: "planejado",
        priority: "media",
      });
    }
  }, [projeto, open, form, preselectedCompanyId]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (projeto?.id) {
        await updateProjeto.mutateAsync({ id: projeto.id, updates: values });
      } else {
        await createProjeto.mutateAsync(values as any);
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
          <DialogTitle>{projeto ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="company_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!!preselectedCompanyId && !projeto}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome do Projeto *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Projeto</FormLabel>
                  <FormControl><Input placeholder="Ex: Lançamento, Branding..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="start_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="due_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo (Entrega)</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
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
                      <SelectItem value="planejado">Planejado</SelectItem>
                      <SelectItem value="em_producao">Em Produção</SelectItem>
                      <SelectItem value="em_revisao">Em Revisão Interna</SelectItem>
                      <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                      <SelectItem value="ajustes_solicitados">Ajustes Solicitados</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="publicado">Publicado</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição e Detalhes</FormLabel>
                <FormControl><Textarea {...field} className="resize-none" rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createProjeto.isPending || updateProjeto.isPending}>
                {createProjeto.isPending || updateProjeto.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
