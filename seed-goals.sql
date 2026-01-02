-- ==============================================
-- METAS DO PROJETO 2026
-- Execute este SQL no Supabase SQL Editor
-- ==============================================

-- Primeiro, vamos pegar seu user_id (substitua pelo seu email se necessário)
-- Você pode encontrar seu user_id em: Authentication > Users no Supabase Dashboard

-- OPÇÃO 1: Se você sabe seu user_id, substitua 'SEU_USER_ID_AQUI' pelo valor
-- OPÇÃO 2: Use a query abaixo para descobrir seu user_id:
-- SELECT id FROM auth.users WHERE email = 'seu_email@exemplo.com';

-- ==============================================
-- INSERIR METAS (substitua SEU_USER_ID_AQUI)
-- ==============================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Pega o primeiro usuário (já que o sistema é só seu)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Se não encontrar usuário, aborta
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado. Faça login primeiro.';
  END IF;

  -- Limpa metas existentes (opcional - descomente se quiser resetar)
  -- DELETE FROM goals WHERE user_id = v_user_id;

  -- FÍSICO (5 metas)
  INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline, priority) VALUES
  (v_user_id, 'fisico', 'Emagrecer 10kg', 'Perder 10kg de peso corporal ao longo do ano', 10, 0, 'kg', '2026-12-31', 'high'),
  (v_user_id, 'fisico', 'Tonificar barriga', 'Definir músculos abdominais com treino e dieta', 100, 0, '%', '2026-12-31', 'high'),
  (v_user_id, 'fisico', 'Ajustar postura corporal', 'Corrigir postura corporal para ereta', 100, 0, '%', '2026-12-31', 'medium'),
  (v_user_id, 'fisico', 'Treinar 1h por dia', 'Acumular 365 horas de treino no ano', 365, 0, 'horas', '2026-12-31', 'high'),
  (v_user_id, 'fisico', 'Projeto 2k Day', 'Correr 2km por dia - 730km no ano todo', 730, 0, 'km', '2026-12-31', 'high');

  -- INTELECTUAL (5 metas)
  INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline, priority) VALUES
  (v_user_id, 'intelectual', 'Inglês nível A2', 'Ler livros, ouvir músicas, conversar com nativos, consumir aulas e cursos em inglês', 100, 0, '%', '2026-12-31', 'high'),
  (v_user_id, 'intelectual', 'Branding e conteúdo', 'Aprender criação de branding e conteúdo para redes sociais', 100, 0, '%', '2026-12-31', 'medium'),
  (v_user_id, 'intelectual', 'Comunicação pessoal', 'Melhorar habilidades de comunicação interpessoal', 100, 0, '%', '2026-12-31', 'medium'),
  (v_user_id, 'intelectual', 'APIs e integração', 'Aprender criação de APIs e integração de ferramentas para desenvolvimento de software', 100, 0, '%', '2026-12-31', 'high'),
  (v_user_id, 'intelectual', 'Gestão de equipes e networking', 'Desenvolver habilidades de gestão de equipes e expandir networking', 100, 0, '%', '2026-12-31', 'medium');

  -- ALMÁTICO (2 metas)
  INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline, priority) VALUES
  (v_user_id, 'almatico', 'Ajudar 10 pessoas', 'Ajudar 10 pessoas a perdoarem seus pais e ter desbloqueio emocional', 10, 0, 'pessoas', '2026-12-31', 'high'),
  (v_user_id, 'almatico', 'Servir Jovens Sarados', 'Tornar-se servo dos Jovens Sarados novamente e resgatar almas para Deus', 100, 0, '%', '2026-12-31', 'high');

  -- FINANCEIRO (4 metas)
  INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline, priority) VALUES
  (v_user_id, 'financeiro', 'Faturar R$ 250.000', 'Faturar duzentos e cinquenta mil reais no ano', 250000, 0, 'R$', '2026-12-31', 'high'),
  (v_user_id, 'financeiro', 'Comprar primeiro carro', 'Adquirir o primeiro veículo próprio', 100, 0, '%', '2026-12-31', 'medium'),
  (v_user_id, 'financeiro', 'Viajar para namorada', 'Realizar viagem para visitar a namorada', 100, 0, '%', '2026-12-31', 'high'),
  (v_user_id, 'financeiro', 'Reserva de emergência', 'Guardar R$ 25.000 de reserva de emergência', 25000, 0, 'R$', '2026-12-31', 'high');

  -- SOCIAL (3 metas)
  INSERT INTO goals (user_id, category, title, description, target_value, current_value, unit, deadline, priority) VALUES
  (v_user_id, 'social', '5 obras de caridade', 'Fazer 5 obras de caridade - doações de dinheiro, tempo ou atenção', 5, 0, 'obras', '2026-12-31', 'medium'),
  (v_user_id, 'social', 'Entrar no BNI', 'Entrar para o grupo de networking BNI', 100, 0, '%', '2026-12-31', 'medium'),
  (v_user_id, 'social', 'Entrar no The One', 'Entrar para o grupo de networking The One', 100, 0, '%', '2026-12-31', 'medium');

  RAISE NOTICE '✅ 19 metas do Projeto 2026 inseridas com sucesso para o usuário %', v_user_id;
END $$;

-- ==============================================
-- VERIFICAR METAS INSERIDAS
-- ==============================================
SELECT
  category,
  title,
  target_value,
  unit,
  priority
FROM goals
ORDER BY
  CASE category
    WHEN 'fisico' THEN 1
    WHEN 'intelectual' THEN 2
    WHEN 'almatico' THEN 3
    WHEN 'financeiro' THEN 4
    WHEN 'social' THEN 5
  END,
  created_at;
