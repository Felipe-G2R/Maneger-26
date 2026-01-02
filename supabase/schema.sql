-- =====================================================
-- MANEGER 26 - SQL MESTRE PARA SUPABASE
-- Sistema completo de gerenciamento de metas pessoais
-- =====================================================

-- Habilitar extensoes necessarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE USUARIOS (PROFILES)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TABELA DE PREFERENCIAS DO USUARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    language TEXT DEFAULT 'pt-BR',
    date_format TEXT DEFAULT 'dd/MM/yyyy',
    show_completed_goals BOOLEAN DEFAULT TRUE,
    enable_notifications BOOLEAN DEFAULT TRUE,
    sidebar_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TABELA DE CATEGORIAS DE METAS
-- =====================================================
CREATE TABLE IF NOT EXISTS goal_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Inserir categorias padrao
INSERT INTO goal_categories (id, name, color, icon, display_order) VALUES
    ('fisico', 'Fisico', '#EF4444', 'Dumbbell', 1),
    ('intelectual', 'Intelectual', '#3B82F6', 'Brain', 2),
    ('almatico', 'Almatico', '#A855F7', 'Heart', 3),
    ('financeiro', 'Financeiro', '#10B981', 'DollarSign', 4),
    ('social', 'Social', '#F59E0B', 'Users', 5)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. TABELA DE METAS
-- =====================================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT REFERENCES goal_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    target_value DECIMAL(15, 2) NOT NULL DEFAULT 100,
    current_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    unit TEXT DEFAULT '%',
    deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(status);

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. TABELA DE LOGS DE PROGRESSO DAS METAS
-- =====================================================
CREATE TABLE IF NOT EXISTS progress_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    value DECIMAL(15, 2) NOT NULL,
    notes TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_progress_logs_goal_id ON progress_logs(goal_id);
CREATE INDEX idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX idx_progress_logs_logged_at ON progress_logs(logged_at DESC);

-- =====================================================
-- 6. TABELA DE ENTRADAS DO DIARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    transcription TEXT,
    audio_url TEXT,
    mood TEXT CHECK (mood IN ('otimo', 'bom', 'neutro', 'ruim', 'pessimo')),
    tags TEXT[], -- Array de tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_entries_date ON diary_entries(date DESC);
CREATE INDEX idx_diary_entries_mood ON diary_entries(mood);

CREATE TRIGGER update_diary_entries_updated_at
    BEFORE UPDATE ON diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. TABELA DE ENTRADAS DO ALMATICO (DIARIO ESPIRITUAL)
-- =====================================================
CREATE TABLE IF NOT EXISTS almatico_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    passagem TEXT, -- Passagem biblica lida (ex: "Salmos 23")
    versiculo TEXT, -- Versiculo que tocou o coracao
    oracao TEXT, -- Transcricao da oracao
    audio_url TEXT, -- URL do audio da oracao
    sentimento TEXT CHECK (sentimento IN ('grato', 'paz', 'esperanca', 'reflexivo', 'arrependido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_almatico_entries_user_id ON almatico_entries(user_id);
CREATE INDEX idx_almatico_entries_date ON almatico_entries(date DESC);
CREATE INDEX idx_almatico_entries_sentimento ON almatico_entries(sentimento);

CREATE TRIGGER update_almatico_entries_updated_at
    BEFORE UPDATE ON almatico_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. TABELA DE ESTATISTICAS DO ALMATICO
-- =====================================================
CREATE TABLE IF NOT EXISTS almatico_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_leituras INTEGER DEFAULT 0,
    total_oracoes INTEGER DEFAULT 0,
    sequencia_dias INTEGER DEFAULT 0,
    maior_sequencia INTEGER DEFAULT 0,
    ultimo_dia DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TRIGGER update_almatico_stats_updated_at
    BEFORE UPDATE ON almatico_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. CATEGORIAS FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Inserir categorias de despesas
INSERT INTO financial_categories (id, name, type, color, icon, display_order) VALUES
    ('moradia', 'Moradia', 'despesa', '#3b82f6', 'Home', 1),
    ('alimentacao', 'Alimentacao', 'despesa', '#22c55e', 'Utensils', 2),
    ('transporte', 'Transporte', 'despesa', '#f97316', 'Car', 3),
    ('saude', 'Saude', 'despesa', '#ef4444', 'Heart', 4),
    ('educacao', 'Educacao', 'despesa', '#8b5cf6', 'GraduationCap', 5),
    ('lazer', 'Lazer', 'despesa', '#ec4899', 'Plane', 6),
    ('compras', 'Compras', 'despesa', '#14b8a6', 'ShoppingCart', 7),
    ('tecnologia', 'Tecnologia', 'despesa', '#6366f1', 'Smartphone', 8),
    ('presentes', 'Presentes', 'despesa', '#f43f5e', 'Gift', 9),
    ('outros_despesa', 'Outros', 'despesa', '#64748b', 'MoreHorizontal', 10),
    ('salario', 'Salario', 'receita', '#22c55e', 'Wallet', 1),
    ('freelance', 'Freelance', 'receita', '#3b82f6', 'CreditCard', 2),
    ('investimentos', 'Investimentos', 'receita', '#8b5cf6', 'TrendingUp', 3),
    ('outros_receita', 'Outros', 'receita', '#64748b', 'MoreHorizontal', 4)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 10. TABELA DE TRANSACOES FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
    category_id TEXT REFERENCES financial_categories(id),
    description TEXT NOT NULL,
    value DECIMAL(15, 2) NOT NULL CHECK (value > 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_period TEXT CHECK (recurring_period IN ('daily', 'weekly', 'monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_financial_transactions_user_id ON financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(date DESC);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX idx_financial_transactions_category_id ON financial_transactions(category_id);

CREATE TRIGGER update_financial_transactions_updated_at
    BEFORE UPDATE ON financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. TABELA DE METAS FINANCEIRAS (POUPANCA)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_value DECIMAL(15, 2) NOT NULL CHECK (target_value > 0),
    current_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    color TEXT DEFAULT '#3b82f6',
    deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_financial_goals_status ON financial_goals(status);

CREATE TRIGGER update_financial_goals_updated_at
    BEFORE UPDATE ON financial_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. TABELA DE CONTRIBUICOES PARA METAS FINANCEIRAS
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_goal_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    financial_goal_id UUID REFERENCES financial_goals(id) ON DELETE CASCADE,
    value DECIMAL(15, 2) NOT NULL CHECK (value > 0),
    notes TEXT,
    contributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_financial_goal_contributions_goal_id ON financial_goal_contributions(financial_goal_id);

-- =====================================================
-- 13. TABELA DE FOTOS DO MURAL DE EVOLUCAO
-- =====================================================
CREATE TABLE IF NOT EXISTS evolution_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT REFERENCES goal_categories(id),
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_evolution_photos_user_id ON evolution_photos(user_id);
CREATE INDEX idx_evolution_photos_category ON evolution_photos(category);
CREATE INDEX idx_evolution_photos_date ON evolution_photos(date DESC);

-- =====================================================
-- 14. TABELA DE DIETA E TREINO (PERIODIZACAO)
-- =====================================================
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_type TEXT, -- 'empurrar', 'puxar', 'pernas', 'upper', 'lower', 'descanso'
    exercises JSONB, -- Array de exercicios com series, reps e carga
    cardio_km DECIMAL(5, 2) DEFAULT 0, -- Km de corrida (Projeto 2k Day)
    cardio_minutes INTEGER DEFAULT 0,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_date ON workout_logs(date DESC);

-- =====================================================
-- 15. TABELA DE MEDICOES CORPORAIS
-- =====================================================
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5, 2), -- Peso em kg
    height DECIMAL(5, 2), -- Altura em cm
    body_fat_percentage DECIMAL(4, 2), -- Percentual de gordura
    muscle_mass DECIMAL(5, 2), -- Massa muscular em kg
    waist DECIMAL(5, 2), -- Cintura em cm
    chest DECIMAL(5, 2), -- Peito em cm
    arm DECIMAL(5, 2), -- Braco em cm
    thigh DECIMAL(5, 2), -- Coxa em cm
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_body_measurements_user_id ON body_measurements(user_id);
CREATE INDEX idx_body_measurements_date ON body_measurements(date DESC);

-- =====================================================
-- 16. TABELA DE REFEICOES
-- =====================================================
CREATE TABLE IF NOT EXISTS meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT CHECK (meal_type IN ('cafe_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia')),
    description TEXT,
    calories INTEGER,
    protein DECIMAL(5, 2), -- Proteina em gramas
    carbs DECIMAL(5, 2), -- Carboidratos em gramas
    fat DECIMAL(5, 2), -- Gordura em gramas
    water_ml INTEGER DEFAULT 0, -- Agua em ml
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_id ON meal_logs(user_id);
CREATE INDEX idx_meal_logs_date ON meal_logs(date DESC);

-- =====================================================
-- 17. TABELA DE NOTIFICACOES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- VIEWS UTEIS
-- =====================================================

-- View de resumo de metas por categoria
CREATE OR REPLACE VIEW goals_summary AS
SELECT
    g.user_id,
    g.category,
    gc.name as category_name,
    gc.color as category_color,
    COUNT(*) as total_goals,
    COUNT(CASE WHEN g.current_value >= g.target_value THEN 1 END) as completed_goals,
    ROUND(AVG((g.current_value / NULLIF(g.target_value, 0)) * 100), 2) as avg_progress
FROM goals g
JOIN goal_categories gc ON g.category = gc.id
WHERE g.status = 'active'
GROUP BY g.user_id, g.category, gc.name, gc.color;

-- View de resumo financeiro mensal
CREATE OR REPLACE VIEW financial_monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', date) as month,
    SUM(CASE WHEN type = 'receita' THEN value ELSE 0 END) as total_receitas,
    SUM(CASE WHEN type = 'despesa' THEN value ELSE 0 END) as total_despesas,
    SUM(CASE WHEN type = 'receita' THEN value ELSE -value END) as saldo
FROM financial_transactions
GROUP BY user_id, DATE_TRUNC('month', date)
ORDER BY month DESC;

-- View de gastos por categoria
CREATE OR REPLACE VIEW expenses_by_category AS
SELECT
    ft.user_id,
    DATE_TRUNC('month', ft.date) as month,
    ft.category_id,
    fc.name as category_name,
    fc.color as category_color,
    SUM(ft.value) as total
FROM financial_transactions ft
JOIN financial_categories fc ON ft.category_id = fc.id
WHERE ft.type = 'despesa'
GROUP BY ft.user_id, DATE_TRUNC('month', ft.date), ft.category_id, fc.name, fc.color
ORDER BY total DESC;

-- View de streak do almatico
CREATE OR REPLACE VIEW almatico_streaks AS
SELECT
    user_id,
    total_leituras,
    total_oracoes,
    sequencia_dias,
    maior_sequencia,
    ultimo_dia,
    CASE
        WHEN ultimo_dia = CURRENT_DATE THEN TRUE
        WHEN ultimo_dia = CURRENT_DATE - 1 THEN TRUE
        ELSE FALSE
    END as streak_ativo
FROM almatico_stats;

-- =====================================================
-- FUNCOES UTEIS
-- =====================================================

-- Funcao para calcular progresso de uma meta
CREATE OR REPLACE FUNCTION calculate_goal_progress(goal_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    progress DECIMAL;
BEGIN
    SELECT
        LEAST(ROUND((current_value / NULLIF(target_value, 0)) * 100, 2), 100)
    INTO progress
    FROM goals
    WHERE id = goal_id;

    RETURN COALESCE(progress, 0);
END;
$$ LANGUAGE plpgsql;

-- Funcao para atualizar estatisticas do almatico
CREATE OR REPLACE FUNCTION update_almatico_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_hoje DATE;
    v_ontem DATE;
    v_ultimo_dia DATE;
    v_sequencia INTEGER;
    v_maior_sequencia INTEGER;
BEGIN
    v_user_id := NEW.user_id;
    v_hoje := CURRENT_DATE;
    v_ontem := CURRENT_DATE - 1;

    -- Buscar dados atuais
    SELECT ultimo_dia, sequencia_dias, maior_sequencia
    INTO v_ultimo_dia, v_sequencia, v_maior_sequencia
    FROM almatico_stats
    WHERE user_id = v_user_id;

    -- Se nao existe, criar registro
    IF NOT FOUND THEN
        INSERT INTO almatico_stats (user_id, total_leituras, total_oracoes, sequencia_dias, maior_sequencia, ultimo_dia)
        VALUES (v_user_id,
                CASE WHEN NEW.passagem IS NOT NULL THEN 1 ELSE 0 END,
                CASE WHEN NEW.oracao IS NOT NULL THEN 1 ELSE 0 END,
                1, 1, v_hoje);
        RETURN NEW;
    END IF;

    -- Calcular nova sequencia
    IF v_ultimo_dia = v_ontem THEN
        v_sequencia := v_sequencia + 1;
    ELSIF v_ultimo_dia != v_hoje THEN
        v_sequencia := 1;
    END IF;

    -- Atualizar maior sequencia
    IF v_sequencia > v_maior_sequencia THEN
        v_maior_sequencia := v_sequencia;
    END IF;

    -- Atualizar stats
    UPDATE almatico_stats SET
        total_leituras = total_leituras + CASE WHEN NEW.passagem IS NOT NULL THEN 1 ELSE 0 END,
        total_oracoes = total_oracoes + CASE WHEN NEW.oracao IS NOT NULL THEN 1 ELSE 0 END,
        sequencia_dias = v_sequencia,
        maior_sequencia = v_maior_sequencia,
        ultimo_dia = v_hoje
    WHERE user_id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_almatico_stats
    AFTER INSERT ON almatico_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_almatico_stats();

-- Funcao para atualizar valor atual de meta financeira
CREATE OR REPLACE FUNCTION update_financial_goal_value()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE financial_goals
    SET current_value = current_value + NEW.value
    WHERE id = NEW.financial_goal_id;

    -- Verificar se atingiu a meta
    UPDATE financial_goals
    SET status = 'completed'
    WHERE id = NEW.financial_goal_id
    AND current_value >= target_value
    AND status = 'active';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_financial_goal_value
    AFTER INSERT ON financial_goal_contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_financial_goal_value();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE almatico_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE almatico_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies para user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies genericas para tabelas com user_id
CREATE POLICY "Users can manage own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress_logs" ON progress_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own diary_entries" ON diary_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own almatico_entries" ON almatico_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own almatico_stats" ON almatico_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own financial_transactions" ON financial_transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own financial_goals" ON financial_goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own financial_goal_contributions" ON financial_goal_contributions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own evolution_photos" ON evolution_photos
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workout_logs" ON workout_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own body_measurements" ON body_measurements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal_logs" ON meal_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKETS (para arquivos)
-- =====================================================

-- Bucket para audios do diario e almatico
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de evolucao
INSERT INTO storage.buckets (id, name, public)
VALUES ('evolution-photos', 'evolution-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de refeicoes
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-photos', 'meal-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para storage
CREATE POLICY "Users can upload own audio" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'audio-recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own audio" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'audio-recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own audio" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'audio-recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can manage own evolution photos" ON storage.objects
    FOR ALL USING (
        bucket_id = 'evolution-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can manage own meal photos" ON storage.objects
    FOR ALL USING (
        bucket_id = 'meal-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);

    INSERT INTO public.almatico_stats (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Mensagem de conclusao
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'MANEGER 26 - Schema criado com sucesso!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tabelas criadas:';
    RAISE NOTICE '  - profiles (usuarios)';
    RAISE NOTICE '  - user_preferences (preferencias)';
    RAISE NOTICE '  - goal_categories (categorias de metas)';
    RAISE NOTICE '  - goals (metas)';
    RAISE NOTICE '  - progress_logs (logs de progresso)';
    RAISE NOTICE '  - diary_entries (diario)';
    RAISE NOTICE '  - almatico_entries (diario espiritual)';
    RAISE NOTICE '  - almatico_stats (estatisticas almatico)';
    RAISE NOTICE '  - financial_categories (categorias financeiras)';
    RAISE NOTICE '  - financial_transactions (transacoes)';
    RAISE NOTICE '  - financial_goals (metas financeiras)';
    RAISE NOTICE '  - financial_goal_contributions (contribuicoes)';
    RAISE NOTICE '  - evolution_photos (fotos evolucao)';
    RAISE NOTICE '  - workout_logs (logs de treino)';
    RAISE NOTICE '  - body_measurements (medicoes corporais)';
    RAISE NOTICE '  - meal_logs (logs de refeicoes)';
    RAISE NOTICE '  - notifications (notificacoes)';
    RAISE NOTICE '=====================================================';
END $$;
