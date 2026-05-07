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
import { useCreateCliente, useUpdateCliente, Company } from "@/hooks/use-clientes";

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  cnpj: z.string().optional(),
  segment: z.string().optional(),
  city: z.string().optional(),
  main_contact: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  package: z.string().optional(),
  monthly_value: z.coerce.number().optional(),
  status: z.enum(["lead", "proposta_enviada", "ativo", "implantacao", "pausado", "encerrado", "inadimplente"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClienteFormDialogProps {
  children?: React.ReactNode;
  cliente?: Company;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClienteFormDialog({ children, cliente, open: controlledOpen, onOpenChange }: ClienteFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      segment: "",
      city: "",
      main_contact: "",
      email: "",
      whatsapp: "",
      package: "",
      monthly_value: 0,
      status: "lead",
      notes: "",
    },
  });

  useEffect(() => {
    if (cliente && open) {
      form.reset({
        name: cliente.name || "",
        cnpj: cliente.cnpj || "",
        segment: cliente.segment || "",
        city: cliente.city || "",
        main_contact: cliente.main_contact || "",
        email: cliente.email || "",
        whatsapp: cliente.whatsapp || "",
        package: cliente.package || "",
        monthly_value: Number(cliente.monthly_value) || 0,
        status: cliente.status,
        notes: cliente.notes || "",
      });
    } else if (!cliente && open) {
      form.reset({
        name: "",
        cnpj: "",
        segment: "",
        city: "",
        main_contact: "",
        email: "",
        whatsapp: "",
        package: "",
        monthly_value: 0,
        status: "lead",
        notes: "",
      });
    }
  }, [cliente, open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (cliente?.id) {
        await updateCliente.mutateAsync({ id: cliente.id, updates: values });
      } else {
        await createCliente.mutateAsync(values as any);
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
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome da Empresa *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="cnpj" render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="segment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmento</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="implantacao">Em Implantação</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                      <SelectItem value="inadimplente">Inadimplente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="main_contact" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato Principal</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl><Input {...field} type="email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="package" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacote Contratado</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="monthly_value" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Mensal (R$)</FormLabel>
                  <FormControl><Input {...field} type="number" step="0.01" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl><Textarea {...field} className="resize-none" rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createCliente.isPending || updateCliente.isPending}>
                {createCliente.isPending || updateCliente.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
