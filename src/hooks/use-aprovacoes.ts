import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Approval = Database["public"]["Tables"]["approvals"]["Row"] & {
  companies?: { name: string } | null;
  projects?: { name: string } | null;
};
export type ApprovalInsert = Database["public"]["Tables"]["approvals"]["Insert"];
export type ApprovalUpdate = Database["public"]["Tables"]["approvals"]["Update"];

export type ApprovalComment = Database["public"]["Tables"]["approval_comments"]["Row"] & {
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
};
export type ApprovalCommentInsert = Database["public"]["Tables"]["approval_comments"]["Insert"];

export function useAprovacoes() {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approvals")
        .select(`
          *,
          companies(name),
          projects(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching approvals:", error);
        throw new Error(error.message);
      }

      return data as Approval[];
    },
  });
}

export function useAprovacao(id: string) {
  return useQuery({
    queryKey: ["approvals", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approvals")
        .select(`
          *,
          companies(name),
          projects(name)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching approval:", error);
        throw new Error(error.message);
      }

      return data as Approval;
    },
    enabled: !!id,
  });
}

export function useCreateAprovacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newApproval: ApprovalInsert) => {
      const { data, error } = await supabase
        .from("approvals")
        .insert(newApproval)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Material enviado para aprovação!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao enviar material: ${error.message}`);
    },
  });
}

export function useUpdateAprovacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ApprovalUpdate }) => {
      const { data, error } = await supabase
        .from("approvals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Status atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["approvals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });
}

export function useDeleteAprovacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("approvals").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Material removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });
}

export function useAprovacaoComentarios(approvalId: string) {
  return useQuery({
    queryKey: ["approval_comments", approvalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approval_comments")
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq("approval_id", approvalId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching approval comments:", error);
        throw new Error(error.message);
      }

      return data as ApprovalComment[];
    },
    enabled: !!approvalId,
  });
}

export function useAddAprovacaoComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: ApprovalCommentInsert) => {
      // Pega o user atual caso não tenha sido passado author_id (não obrigatório pq o RLS faz verificação as vezes mas eh melhor mandar)
      let author_id = newComment.author_id;
      if (!author_id) {
        const { data: { user } } = await supabase.auth.getUser();
        author_id = user?.id;
      }

      const { data, error } = await supabase
        .from("approval_comments")
        .insert({ ...newComment, author_id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["approval_comments", variables.approval_id] });
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar comentário: ${error.message}`);
    },
  });
}
