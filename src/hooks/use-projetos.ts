import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  companies?: { name: string } | null;
};
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export function useProjetos() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          companies(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw new Error(error.message);
      }

      return data as Project[];
    },
  });
}

export function useProjeto(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          companies(name)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        throw new Error(error.message);
      }

      return data as Project;
    },
    enabled: !!id,
  });
}

export function useCreateProjeto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: ProjectInsert) => {
      const { data, error } = await supabase
        .from("projects")
        .insert(newProject)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Projeto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao criar projeto: ${error.message}`);
    },
  });
}

export function useUpdateProjeto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProjectUpdate }) => {
      const { data, error } = await supabase
        .from("projects")
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
      toast.success("Projeto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    },
  });
}

export function useDeleteProjeto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Projeto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["cliente-timeline"] });
    },
    onError: (error) => {
      toast.error(`Erro ao remover projeto: ${error.message}`);
    },
  });
}
