-- =====================================================
-- MANEGER 26 - CRIACAO DO USUARIO ADMIN
-- =====================================================
--
-- IMPORTANTE: No Supabase, usuarios sao criados via Auth API.
-- Este SQL deve ser executado APOS criar o usuario no Dashboard.
--
-- PASSO 1: Criar usuario no Supabase Dashboard
-- ---------------------------------------------
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto (qgcqjeffpjgtydukmoyq)
-- 3. Va em: Authentication > Users
-- 4. Clique em "Add user" > "Create new user"
-- 5. Preencha:
--    - Email: lemescoprodutor@gmail.com
--    - Password: 118246
--    - Marque "Auto Confirm User" (para nao precisar confirmar email)
-- 6. Clique em "Create user"
--
-- PASSO 2: Execute este SQL para completar o perfil
-- --------------------------------------------------

-- Obter o ID do usuario recem-criado e atualizar o perfil
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Buscar o usuario pelo email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'lemescoprodutor@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario lemescoprodutor@gmail.com nao encontrado. Crie o usuario no Dashboard primeiro.';
    END IF;

    -- Verificar se o profile ja existe (trigger pode ter criado automaticamente)
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
        -- Criar profile
        INSERT INTO profiles (id, email, full_name)
        VALUES (v_user_id, 'lemescoprodutor@gmail.com', 'Lemes Produtor');
    ELSE
        -- Atualizar profile existente
        UPDATE profiles
        SET full_name = 'Lemes Produtor'
        WHERE id = v_user_id;
    END IF;

    -- Verificar se preferencias existem
    IF NOT EXISTS (SELECT 1 FROM user_preferences WHERE user_id = v_user_id) THEN
        INSERT INTO user_preferences (user_id, theme, language)
        VALUES (v_user_id, 'dark', 'pt-BR');
    END IF;

    -- Verificar se stats do almatico existem
    IF NOT EXISTS (SELECT 1 FROM almatico_stats WHERE user_id = v_user_id) THEN
        INSERT INTO almatico_stats (user_id)
        VALUES (v_user_id);
    END IF;

    RAISE NOTICE 'Usuario configurado com sucesso!';
    RAISE NOTICE 'ID: %', v_user_id;
    RAISE NOTICE 'Email: lemescoprodutor@gmail.com';
    RAISE NOTICE 'Nome: Lemes Produtor';
END $$;

-- =====================================================
-- METAS INICIAIS (OPCIONAL)
-- =====================================================
-- Adiciona algumas metas de exemplo para o usuario

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Buscar o usuario
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'lemescoprodutor@gmail.com';

    IF v_user_id IS NOT NULL THEN
        -- Meta Fisica
        INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline)
        VALUES (
            v_user_id,
            'fisico',
            'Peso Ideal - 79kg',
            'Alcancar e manter o peso de 79kg com percentual de gordura saudavel',
            79,
            0,
            'kg',
            '2026-12-31'
        )
        ON CONFLICT DO NOTHING;

        -- Meta Financeira
        INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline)
        VALUES (
            v_user_id,
            'financeiro',
            'Reserva de Emergencia',
            'Construir reserva de emergencia de 6 meses de despesas',
            50000,
            0,
            'R$',
            '2026-12-31'
        )
        ON CONFLICT DO NOTHING;

        -- Meta Intelectual
        INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline)
        VALUES (
            v_user_id,
            'intelectual',
            'Ler 24 Livros',
            'Ler 2 livros por mes durante o ano',
            24,
            0,
            'livros',
            '2026-12-31'
        )
        ON CONFLICT DO NOTHING;

        -- Meta Almatica
        INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline)
        VALUES (
            v_user_id,
            'almatico',
            'Ler a Biblia Completa',
            'Ler a Biblia completa durante o ano',
            100,
            0,
            '%',
            '2026-12-31'
        )
        ON CONFLICT DO NOTHING;

        -- Meta Social
        INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline)
        VALUES (
            v_user_id,
            'social',
            'Encontros em Familia',
            'Realizar encontros mensais com a familia',
            12,
            0,
            'encontros',
            '2026-12-31'
        )
        ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Metas iniciais criadas com sucesso!';
    END IF;
END $$;

-- =====================================================
-- VERIFICACAO FINAL
-- =====================================================

-- Listar informacoes do usuario
SELECT
    'Usuario' as tipo,
    u.id::text as id,
    u.email,
    u.created_at::text
FROM auth.users u
WHERE u.email = 'lemescoprodutor@gmail.com'

UNION ALL

SELECT
    'Profile' as tipo,
    p.id::text,
    p.full_name as email,
    p.created_at::text
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'lemescoprodutor@gmail.com'

UNION ALL

SELECT
    'Metas' as tipo,
    COUNT(*)::text as id,
    '' as email,
    '' as created_at
FROM goals g
JOIN auth.users u ON g.user_id = u.id
WHERE u.email = 'lemescoprodutor@gmail.com';
