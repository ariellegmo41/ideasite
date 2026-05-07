import { useState } from "react";
import { useAprovacaoComentarios, useAddAprovacaoComentario } from "@/hooks/use-aprovacoes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AprovacaoComentarios({ approvalId }: { approvalId: string }) {
  const { data: comments, isLoading } = useAprovacaoComentarios(approvalId);
  const addComment = useAddAprovacaoComentario();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment.mutateAsync({
        approval_id: approvalId,
        comment: newComment.trim()
      });
      setNewComment("");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2">
        {comments?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum comentário ainda. Inicie a conversa abaixo.
          </p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.profiles?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.profiles?.full_name ? comment.profiles.full_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {comment.profiles?.full_name || "Usuário"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "dd MMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-lg rounded-tl-none whitespace-pre-wrap">
                  {comment.comment}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-auto border-t border-border/50 pt-4 relative">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário ou solicite um ajuste..."
          className="min-h-[80px] resize-none pr-12 pb-10"
        />
        <div className="absolute right-2 bottom-2">
          <Button 
            size="sm" 
            type="submit" 
            disabled={!newComment.trim() || addComment.isPending}
            className="h-8 rounded-md px-3"
          >
            {addComment.isPending ? "..." : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
