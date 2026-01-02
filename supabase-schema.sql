-- ==============================================
-- MANEGER 26 - Schema do Banco de Dados Supabase
-- ==============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para categorias
CREATE TYPE goal_category AS ENUM (
  'fisico',
  'intelectual',
  'almatico',
  'financeiro',
  'social'
);

-- Enum para humor
CREATE TYPE mood_type AS ENUM (
  'otimo',
  'bom',
  'neutro',
  'ruim',
  'pessimo'
);

-- ==============================================
-- TABELA: goals (Metas)
-- ==============================================
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category goal_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL DEFAULT 100,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT DEFAULT '%',
  deadline DATE DEFAULT '2026-12-31',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca por usuario
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);

-- RLS (Row Level Security)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- TABELA: diary_entries (Entradas do Diario)
-- ==============================================
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  audio_url TEXT,
  transcription TEXT,
  mood mood_type DEFAULT 'neutro',
  related_goals UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_diary_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_date ON diary_entries(date);

-- RLS
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries" ON diary_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries" ON diary_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries" ON diary_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary entries" ON diary_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- TABELA: progress_logs (Logs de Progresso)
-- ==============================================
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_progress_goal_id ON progress_logs(goal_id);
CREATE INDEX idx_progress_user_id ON progress_logs(user_id);
CREATE INDEX idx_progress_logged_at ON progress_logs(logged_at);

-- RLS
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress logs" ON progress_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs" ON progress_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- STORAGE: Bucket para audios
-- ==============================================
-- Execute isso no dashboard do Supabase > Storage

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('diary-audio', 'diary-audio', true);

-- CREATE POLICY "Anyone can view audio files"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'diary-audio');

-- CREATE POLICY "Authenticated users can upload audio"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'diary-audio' AND auth.role() = 'authenticated');

-- ==============================================
-- FUNCAO: Atualizar updated_at automaticamente
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- METAS INICIAIS (Opcional - Seed Data)
-- ==============================================
-- Descomente e execute apos criar um usuario para popular com as metas iniciais

/*
INSERT INTO goals (user_id, category, title, description, target_value, unit) VALUES
  -- Fisico
  ('SEU_USER_ID', 'fisico', 'Emagrecer 10kg', 'Perder 10kg de peso corporal ao longo do ano', 10, 'kg'),
  ('SEU_USER_ID', 'fisico', 'Tonificar barriga', 'Definir musculos abdominais', 100, '%'),
  ('SEU_USER_ID', 'fisico', 'Ajustar postura', 'Corrigir postura corporal para ereta', 100, '%'),
  ('SEU_USER_ID', 'fisico', 'Treinar 1h por dia', 'Acumular 365 horas de treino no ano', 365, 'horas'),
  ('SEU_USER_ID', 'fisico', 'Correr 2km por dia', 'Correr 730km no ano todo', 730, 'km'),

  -- Intelectual
  ('SEU_USER_ID', 'intelectual', 'Ingles nivel A2', 'Ler livros, ouvir musicas, conversar com nativos', 100, '%'),
  ('SEU_USER_ID', 'intelectual', 'Branding e conteudo', 'Aprender criacao de branding e conteudo', 100, '%'),
  ('SEU_USER_ID', 'intelectual', 'Comunicacao pessoal', 'Melhorar habilidades de comunicacao', 100, '%'),
  ('SEU_USER_ID', 'intelectual', 'APIs e integracao', 'Aprender criacao de APIs e integracao de ferramentas', 100, '%'),

  -- Almatico
  ('SEU_USER_ID', 'almatico', 'Ajudar 10 pessoas', 'Ajudar 10 pessoas a perdoarem seus pais', 10, 'pessoas'),
  ('SEU_USER_ID', 'almatico', 'Servir Jovens Sarados', 'Tornar-se servo dos Jovens Sarados', 100, '%'),

  -- Financeiro
  ('SEU_USER_ID', 'financeiro', 'Faturar R$ 250.000', 'Faturar duzentos e cinquenta mil reais no ano', 250000, 'R$'),
  ('SEU_USER_ID', 'financeiro', 'Comprar primeiro carro', 'Adquirir o primeiro veiculo proprio', 100, '%'),
  ('SEU_USER_ID', 'financeiro', 'Viajar para namorada', 'Realizar viagem para visitar a namorada', 100, '%'),
  ('SEU_USER_ID', 'financeiro', 'Reserva de emergencia', 'Guardar R$ 25.000 de reserva', 25000, 'R$'),

  -- Social
  ('SEU_USER_ID', 'social', '5 obras de caridade', 'Fazer 5 obras de caridade', 5, 'obras'),
  ('SEU_USER_ID', 'social', 'Entrar no BNI', 'Entrar para o grupo de networking BNI', 100, '%'),
  ('SEU_USER_ID', 'social', 'Entrar no The One', 'Entrar para o grupo de networking The One', 100, '%');
*/
