
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'client');

CREATE TYPE public.company_status AS ENUM (
  'lead','proposta_enviada','ativo','implantacao','pausado','encerrado','inadimplente'
);

CREATE TYPE public.project_status AS ENUM (
  'planejado','em_producao','em_revisao','aguardando_aprovacao',
  'ajustes_solicitados','aprovado','publicado','finalizado','pausado'
);

CREATE TYPE public.project_priority AS ENUM ('baixa','media','alta','urgente');

CREATE TYPE public.approval_status AS ENUM (
  'rascunho','enviado','visualizado','aprovado','ajustes_solicitados','reenviado','finalizado','publicado'
);

CREATE TYPE public.ticket_status AS ENUM (
  'aberto','em_analise','em_andamento','aguardando_cliente','resolvido','encerrado'
);

CREATE TYPE public.ticket_priority AS ENUM ('baixa','media','alta','urgente');

CREATE TYPE public.post_status AS ENUM (
  'ideia','em_criacao','em_revisao','aguardando_aprovacao','aprovado','agendado','publicado','cancelado'
);

CREATE TYPE public.event_status AS ENUM (
  'planejado','confirmado','em_preparacao','realizado','finalizado','cancelado'
);

CREATE TYPE public.meeting_status AS ENUM (
  'agendada','confirmada','realizada','remarcada','cancelada'
);

CREATE TYPE public.campaign_status AS ENUM (
  'planejada','em_criacao','em_aprovacao','ativa','finalizada','pausada'
);

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  company_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER ROLES
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','staff')
  )
$$;

CREATE OR REPLACE FUNCTION public.user_company_id(_user_id UUID)
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id
$$;

-- =========================================
-- COMPANIES
-- =========================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  segment TEXT,
  city TEXT,
  main_contact TEXT,
  email TEXT,
  whatsapp TEXT,
  package TEXT,
  monthly_value NUMERIC(12,2),
  start_date DATE,
  renewal_date DATE,
  status public.company_status NOT NULL DEFAULT 'lead',
  consultant_id UUID REFERENCES auth.users ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_company_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- =========================================
-- PROJECTS
-- =========================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  start_date DATE,
  due_date DATE,
  status public.project_status NOT NULL DEFAULT 'planejado',
  priority public.project_priority NOT NULL DEFAULT 'media',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- =========================================
-- APPROVALS
-- =========================================
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects ON DELETE SET NULL,
  title TEXT NOT NULL,
  piece_type TEXT,
  file_url TEXT,
  caption TEXT,
  scheduled_date DATE,
  status public.approval_status NOT NULL DEFAULT 'rascunho',
  version INT NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.approval_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID NOT NULL REFERENCES public.approvals ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.approval_comments ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TICKETS
-- =========================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  priority public.ticket_priority NOT NULL DEFAULT 'media',
  status public.ticket_status NOT NULL DEFAULT 'aberto',
  requester_id UUID REFERENCES auth.users ON DELETE SET NULL,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- =========================================
-- FILES
-- =========================================
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects ON DELETE SET NULL,
  folder TEXT,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- =========================================
-- CALENDAR POSTS
-- =========================================
CREATE TABLE public.calendar_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  title TEXT NOT NULL,
  channel TEXT,
  format TEXT,
  publish_date TIMESTAMPTZ,
  caption TEXT,
  file_url TEXT,
  status public.post_status NOT NULL DEFAULT 'ideia',
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  published_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calendar_posts ENABLE ROW LEVEL SECURITY;

-- =========================================
-- EVENTS
-- =========================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  format TEXT,
  description TEXT,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  status public.event_status NOT NULL DEFAULT 'planejado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- =========================================
-- MEETINGS
-- =========================================
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ,
  duration_minutes INT,
  format TEXT,
  link TEXT,
  agenda TEXT,
  minutes TEXT,
  next_steps TEXT,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  status public.meeting_status NOT NULL DEFAULT 'agendada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- =========================================
-- CAMPAIGNS
-- =========================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  objective TEXT,
  audience TEXT,
  offer TEXT,
  message TEXT,
  channels TEXT,
  start_date DATE,
  end_date DATE,
  status public.campaign_status NOT NULL DEFAULT 'planejada',
  results TEXT,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- =========================================
-- EXTERNAL ACTIONS
-- =========================================
CREATE TABLE public.external_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT,
  action_date TIMESTAMPTZ,
  location TEXT,
  audience TEXT,
  team TEXT,
  materials TEXT,
  script TEXT,
  leads_goal INT,
  sales_goal INT,
  results TEXT,
  notes TEXT,
  status public.event_status NOT NULL DEFAULT 'planejado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.external_actions ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TRAININGS
-- =========================================
CREATE TABLE public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  name TEXT NOT NULL,
  topic TEXT,
  training_date TIMESTAMPTZ,
  format TEXT,
  location TEXT,
  mentor_id UUID REFERENCES auth.users ON DELETE SET NULL,
  participants TEXT,
  material_url TEXT,
  feedback TEXT,
  status public.event_status NOT NULL DEFAULT 'planejado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

-- =========================================
-- REPORTS
-- =========================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects ON DELETE SET NULL,
  type TEXT,
  title TEXT NOT NULL,
  period TEXT,
  summary TEXT,
  what_was_done TEXT,
  results TEXT,
  attention_points TEXT,
  next_steps TEXT,
  file_url TEXT,
  publish_date DATE,
  responsible_id UUID REFERENCES auth.users ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE,
  type TEXT,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =========================================
-- PUBLIC LEADS (form submissions)
-- =========================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  whatsapp TEXT,
  email TEXT,
  segment TEXT,
  challenge TEXT,
  material TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TRIGGERS for updated_at
-- =========================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles','companies','projects','approvals','tickets','calendar_posts','events','meetings','campaigns','external_actions','trainings','reports']) LOOP
    EXECUTE format('CREATE TRIGGER trg_%s_touch BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', t, t);
  END LOOP;
END $$;

-- =========================================
-- Auto-create profile + default 'client' role on signup
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- RLS POLICIES
-- =========================================

-- profiles
CREATE POLICY "self select profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_staff_or_admin(auth.uid()));
CREATE POLICY "self update profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin insert profile" ON public.profiles FOR INSERT WITH CHECK (public.has_role(auth.uid(),'admin') OR auth.uid() = id);

-- user_roles
CREATE POLICY "self read roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_staff_or_admin(auth.uid()));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- companies
CREATE POLICY "staff full companies" ON public.companies FOR ALL
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read own company" ON public.companies FOR SELECT
  USING (id = public.user_company_id(auth.uid()));

-- Generic helper macro pattern for company-scoped tables:
-- staff = full; client = read+limited writes on own company

-- projects
CREATE POLICY "staff projects" ON public.projects FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read projects" ON public.projects FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- approvals
CREATE POLICY "staff approvals" ON public.approvals FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read approvals" ON public.approvals FOR SELECT USING (company_id = public.user_company_id(auth.uid()));
CREATE POLICY "client update approval status" ON public.approvals FOR UPDATE
  USING (company_id = public.user_company_id(auth.uid()))
  WITH CHECK (company_id = public.user_company_id(auth.uid()));

-- approval_comments
CREATE POLICY "staff approval_comments" ON public.approval_comments FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read approval_comments" ON public.approval_comments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.approvals a WHERE a.id = approval_id AND a.company_id = public.user_company_id(auth.uid())));
CREATE POLICY "client insert approval_comments" ON public.approval_comments FOR INSERT
  WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM public.approvals a WHERE a.id = approval_id AND a.company_id = public.user_company_id(auth.uid())));

-- tickets
CREATE POLICY "staff tickets" ON public.tickets FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read tickets" ON public.tickets FOR SELECT USING (company_id = public.user_company_id(auth.uid()));
CREATE POLICY "client insert tickets" ON public.tickets FOR INSERT
  WITH CHECK (company_id = public.user_company_id(auth.uid()) AND requester_id = auth.uid());
CREATE POLICY "client update own tickets" ON public.tickets FOR UPDATE
  USING (company_id = public.user_company_id(auth.uid()) AND requester_id = auth.uid())
  WITH CHECK (company_id = public.user_company_id(auth.uid()));

-- ticket_comments
CREATE POLICY "staff ticket_comments" ON public.ticket_comments FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read ticket_comments" ON public.ticket_comments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.company_id = public.user_company_id(auth.uid())));
CREATE POLICY "client insert ticket_comments" ON public.ticket_comments FOR INSERT
  WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.company_id = public.user_company_id(auth.uid())));

-- files
CREATE POLICY "staff files" ON public.files FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read files" ON public.files FOR SELECT USING (company_id = public.user_company_id(auth.uid()));
CREATE POLICY "client upload files" ON public.files FOR INSERT
  WITH CHECK (company_id = public.user_company_id(auth.uid()) AND uploaded_by = auth.uid());

-- calendar_posts
CREATE POLICY "staff posts" ON public.calendar_posts FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read posts" ON public.calendar_posts FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- events
CREATE POLICY "staff events" ON public.events FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read events" ON public.events FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- meetings
CREATE POLICY "staff meetings" ON public.meetings FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read meetings" ON public.meetings FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- campaigns
CREATE POLICY "staff campaigns" ON public.campaigns FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read campaigns" ON public.campaigns FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- external_actions
CREATE POLICY "staff actions" ON public.external_actions FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read actions" ON public.external_actions FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- trainings
CREATE POLICY "staff trainings" ON public.trainings FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read trainings" ON public.trainings FOR SELECT USING (company_id = public.user_company_id(auth.uid()));

-- reports (clients see only published)
CREATE POLICY "staff reports" ON public.reports FOR ALL USING (public.is_staff_or_admin(auth.uid())) WITH CHECK (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "client read published reports" ON public.reports FOR SELECT
  USING (company_id = public.user_company_id(auth.uid()) AND is_published = true);

-- notifications
CREATE POLICY "self read notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "self update notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "staff create notifications" ON public.notifications FOR INSERT WITH CHECK (public.is_staff_or_admin(auth.uid()) OR user_id = auth.uid());

-- leads (public form -> anyone can insert, only staff reads)
CREATE POLICY "anyone insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "staff read leads" ON public.leads FOR SELECT USING (public.is_staff_or_admin(auth.uid()));
