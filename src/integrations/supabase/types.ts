export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      approval_comments: {
        Row: {
          approval_id: string
          author_id: string | null
          comment: string
          created_at: string
          id: string
        }
        Insert: {
          approval_id: string
          author_id?: string | null
          comment: string
          created_at?: string
          id?: string
        }
        Update: {
          approval_id?: string
          author_id?: string | null
          comment?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_comments_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          caption: string | null
          company_id: string
          created_at: string
          created_by: string | null
          file_url: string | null
          id: string
          piece_type: string | null
          project_id: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          caption?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          piece_type?: string | null
          project_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          caption?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          file_url?: string | null
          id?: string
          piece_type?: string | null
          project_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "approvals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_posts: {
        Row: {
          caption: string | null
          channel: string | null
          company_id: string
          created_at: string
          file_url: string | null
          format: string | null
          id: string
          publish_date: string | null
          published_link: string | null
          responsible_id: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          channel?: string | null
          company_id: string
          created_at?: string
          file_url?: string | null
          format?: string | null
          id?: string
          publish_date?: string | null
          published_link?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          channel?: string | null
          company_id?: string
          created_at?: string
          file_url?: string | null
          format?: string | null
          id?: string
          publish_date?: string | null
          published_link?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience: string | null
          channels: string | null
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          message: string | null
          name: string
          objective: string | null
          offer: string | null
          responsible_id: string | null
          results: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          type: string | null
          updated_at: string
        }
        Insert: {
          audience?: string | null
          channels?: string | null
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          message?: string | null
          name: string
          objective?: string | null
          offer?: string | null
          responsible_id?: string | null
          results?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          type?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string | null
          channels?: string | null
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          message?: string | null
          name?: string
          objective?: string | null
          offer?: string | null
          responsible_id?: string | null
          results?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          city: string | null
          cnpj: string | null
          consultant_id: string | null
          created_at: string
          email: string | null
          id: string
          main_contact: string | null
          monthly_value: number | null
          name: string
          notes: string | null
          package: string | null
          renewal_date: string | null
          segment: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["company_status"]
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          city?: string | null
          cnpj?: string | null
          consultant_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          main_contact?: string | null
          monthly_value?: number | null
          name: string
          notes?: string | null
          package?: string | null
          renewal_date?: string | null
          segment?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          city?: string | null
          cnpj?: string | null
          consultant_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          main_contact?: string | null
          monthly_value?: number | null
          name?: string
          notes?: string | null
          package?: string | null
          renewal_date?: string | null
          segment?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          event_date: string | null
          format: string | null
          id: string
          location: string | null
          name: string
          responsible_id: string | null
          status: Database["public"]["Enums"]["event_status"]
          type: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          format?: string | null
          id?: string
          location?: string | null
          name: string
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          format?: string | null
          id?: string
          location?: string | null
          name?: string
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      external_actions: {
        Row: {
          action_date: string | null
          audience: string | null
          company_id: string
          created_at: string
          id: string
          leads_goal: number | null
          location: string | null
          materials: string | null
          name: string
          notes: string | null
          objective: string | null
          results: string | null
          sales_goal: number | null
          script: string | null
          status: Database["public"]["Enums"]["event_status"]
          team: string | null
          updated_at: string
        }
        Insert: {
          action_date?: string | null
          audience?: string | null
          company_id: string
          created_at?: string
          id?: string
          leads_goal?: number | null
          location?: string | null
          materials?: string | null
          name: string
          notes?: string | null
          objective?: string | null
          results?: string | null
          sales_goal?: number | null
          script?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          team?: string | null
          updated_at?: string
        }
        Update: {
          action_date?: string | null
          audience?: string | null
          company_id?: string
          created_at?: string
          id?: string
          leads_goal?: number | null
          location?: string | null
          materials?: string | null
          name?: string
          notes?: string | null
          objective?: string | null
          results?: string | null
          sales_goal?: number | null
          script?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          team?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_actions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          company_id: string
          created_at: string
          file_url: string
          folder: string | null
          id: string
          name: string
          project_id: string | null
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          file_url: string
          folder?: string | null
          id?: string
          name: string
          project_id?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          file_url?: string
          folder?: string | null
          id?: string
          name?: string
          project_id?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          challenge: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          material: string | null
          name: string
          segment: string | null
          source: string
          whatsapp: string | null
        }
        Insert: {
          challenge?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          material?: string | null
          name: string
          segment?: string | null
          source: string
          whatsapp?: string | null
        }
        Update: {
          challenge?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          material?: string | null
          name?: string
          segment?: string | null
          source?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          agenda: string | null
          company_id: string
          created_at: string
          duration_minutes: number | null
          format: string | null
          id: string
          link: string | null
          meeting_date: string | null
          minutes: string | null
          next_steps: string | null
          responsible_id: string | null
          status: Database["public"]["Enums"]["meeting_status"]
          title: string
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          company_id: string
          created_at?: string
          duration_minutes?: number | null
          format?: string | null
          id?: string
          link?: string | null
          meeting_date?: string | null
          minutes?: string | null
          next_steps?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["meeting_status"]
          title: string
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          company_id?: string
          created_at?: string
          duration_minutes?: number | null
          format?: string | null
          id?: string
          link?: string | null
          meeting_date?: string | null
          minutes?: string | null
          next_steps?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["meeting_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          priority: Database["public"]["Enums"]["project_priority"]
          responsible_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          type: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          priority?: Database["public"]["Enums"]["project_priority"]
          responsible_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"]
          responsible_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          attention_points: string | null
          company_id: string
          created_at: string
          file_url: string | null
          id: string
          is_published: boolean
          next_steps: string | null
          period: string | null
          project_id: string | null
          publish_date: string | null
          responsible_id: string | null
          results: string | null
          summary: string | null
          title: string
          type: string | null
          updated_at: string
          what_was_done: string | null
        }
        Insert: {
          attention_points?: string | null
          company_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          next_steps?: string | null
          period?: string | null
          project_id?: string | null
          publish_date?: string | null
          responsible_id?: string | null
          results?: string | null
          summary?: string | null
          title: string
          type?: string | null
          updated_at?: string
          what_was_done?: string | null
        }
        Update: {
          attention_points?: string | null
          company_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          next_steps?: string | null
          period?: string | null
          project_id?: string | null
          publish_date?: string | null
          responsible_id?: string | null
          results?: string | null
          summary?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          what_was_done?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_comments: {
        Row: {
          author_id: string | null
          comment: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          author_id?: string | null
          comment: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string | null
          comment?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          requester_id: string | null
          responsible_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          company_id: string
          created_at: string
          feedback: string | null
          format: string | null
          id: string
          location: string | null
          material_url: string | null
          mentor_id: string | null
          name: string
          participants: string | null
          status: Database["public"]["Enums"]["event_status"]
          topic: string | null
          training_date: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          feedback?: string | null
          format?: string | null
          id?: string
          location?: string | null
          material_url?: string | null
          mentor_id?: string | null
          name: string
          participants?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          topic?: string | null
          training_date?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          feedback?: string | null
          format?: string | null
          id?: string
          location?: string | null
          material_url?: string | null
          mentor_id?: string | null
          name?: string
          participants?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          topic?: string | null
          training_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_or_admin: { Args: { _user_id: string }; Returns: boolean }
      user_company_id: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff" | "client"
      approval_status:
        | "rascunho"
        | "enviado"
        | "visualizado"
        | "aprovado"
        | "ajustes_solicitados"
        | "reenviado"
        | "finalizado"
        | "publicado"
      campaign_status:
        | "planejada"
        | "em_criacao"
        | "em_aprovacao"
        | "ativa"
        | "finalizada"
        | "pausada"
      company_status:
        | "lead"
        | "proposta_enviada"
        | "ativo"
        | "implantacao"
        | "pausado"
        | "encerrado"
        | "inadimplente"
      event_status:
        | "planejado"
        | "confirmado"
        | "em_preparacao"
        | "realizado"
        | "finalizado"
        | "cancelado"
      meeting_status:
        | "agendada"
        | "confirmada"
        | "realizada"
        | "remarcada"
        | "cancelada"
      post_status:
        | "ideia"
        | "em_criacao"
        | "em_revisao"
        | "aguardando_aprovacao"
        | "aprovado"
        | "agendado"
        | "publicado"
        | "cancelado"
      project_priority: "baixa" | "media" | "alta" | "urgente"
      project_status:
        | "planejado"
        | "em_producao"
        | "em_revisao"
        | "aguardando_aprovacao"
        | "ajustes_solicitados"
        | "aprovado"
        | "publicado"
        | "finalizado"
        | "pausado"
      ticket_priority: "baixa" | "media" | "alta" | "urgente"
      ticket_status:
        | "aberto"
        | "em_analise"
        | "em_andamento"
        | "aguardando_cliente"
        | "resolvido"
        | "encerrado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "client"],
      approval_status: [
        "rascunho",
        "enviado",
        "visualizado",
        "aprovado",
        "ajustes_solicitados",
        "reenviado",
        "finalizado",
        "publicado",
      ],
      campaign_status: [
        "planejada",
        "em_criacao",
        "em_aprovacao",
        "ativa",
        "finalizada",
        "pausada",
      ],
      company_status: [
        "lead",
        "proposta_enviada",
        "ativo",
        "implantacao",
        "pausado",
        "encerrado",
        "inadimplente",
      ],
      event_status: [
        "planejado",
        "confirmado",
        "em_preparacao",
        "realizado",
        "finalizado",
        "cancelado",
      ],
      meeting_status: [
        "agendada",
        "confirmada",
        "realizada",
        "remarcada",
        "cancelada",
      ],
      post_status: [
        "ideia",
        "em_criacao",
        "em_revisao",
        "aguardando_aprovacao",
        "aprovado",
        "agendado",
        "publicado",
        "cancelado",
      ],
      project_priority: ["baixa", "media", "alta", "urgente"],
      project_status: [
        "planejado",
        "em_producao",
        "em_revisao",
        "aguardando_aprovacao",
        "ajustes_solicitados",
        "aprovado",
        "publicado",
        "finalizado",
        "pausado",
      ],
      ticket_priority: ["baixa", "media", "alta", "urgente"],
      ticket_status: [
        "aberto",
        "em_analise",
        "em_andamento",
        "aguardando_cliente",
        "resolvido",
        "encerrado",
      ],
    },
  },
} as const
