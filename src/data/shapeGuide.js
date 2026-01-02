// Guia completo de Shape 2026 - Projeto 2k Day
// Baseado na rotina personalizada de treino e alimentacao

export const shapeGuide = {
  // Informacoes gerais
  intro: {
    title: 'Projeto Shape 2026',
    subtitle: 'Recomposicao Corporal + Projeto 2k Day',
    description: 'Plano para atingir corpo atletico e definido (10-12% gordura) de forma natural',
    timeline: {
      short: '3-4 meses: Mudanca drastica na silhueta',
      long: '6-12 meses: Densidade muscular e definicao completa'
    }
  },

  // Regras do Projeto 2k Day
  projeto2kDay: {
    title: 'Regra de Ouro do Projeto 2k Day',
    rules: [
      {
        rule: 'Quando correr?',
        description: 'APOS o treino de musculacao ou em horario separado (ex: correr de manha e treinar a noite)'
      },
      {
        rule: 'Por que depois?',
        description: 'Se correr antes, gastara a energia (glicogenio) que precisaria para levantar peso com intensidade'
      },
      {
        rule: 'Ritmo nos dias de perna',
        description: 'Faca os 2km num ritmo leve/regenerativo. Nos outros dias pode acelerar'
      }
    ]
  },

  // Rotina Semanal Detalhada
  rotinaSemanal: [
    {
      dia: 'Segunda-feira',
      titulo: 'Empurrar (Peito, Ombros e Triceps)',
      foco: 'Largura de ombros e peitoral desenhado',
      duracao: '45-60 min',
      exercicios: [
        'Supino Inclinado com Halteres (foco na parte superior do peito)',
        'Supino Reto (Barra ou Maquina)',
        'Desenvolvimento de Ombros com Halteres',
        'Elevacao Lateral (crucial para a largura do ombro)',
        'Triceps Corda na Polia'
      ],
      cardio: 'Projeto 2k Day: Ritmo Moderado a Forte (pos-treino)'
    },
    {
      dia: 'Terca-feira',
      titulo: 'Puxar (Costas, Biceps e Trapezio)',
      foco: 'O "V" das costas e biceps',
      duracao: '45-60 min',
      exercicios: [
        'Puxada Alta (Polia) ou Barra Fixa',
        'Remada Curvada ou Serrote',
        'Remada Baixa (Triangulo)',
        'Rosca Direta (Barra ou Halteres)',
        'Rosca Martelo (da volume ao braco)'
      ],
      cardio: 'Projeto 2k Day: Ritmo Moderado'
    },
    {
      dia: 'Quarta-feira',
      titulo: 'Pernas Completo (Foco Quadriceps)',
      foco: 'Pernas fortes e base solida',
      duracao: '45-60 min',
      exercicios: [
        'Agachamento Livre ou no Smith',
        'Leg Press 45',
        'Cadeira Extensora (para definir o musculo da coxa)',
        'Panturrilhas em pe',
        'Abdomen: Prancha + Abdominal Infra (elevacao de pernas)'
      ],
      cardio: 'Projeto 2k Day: Ritmo LEVE - Use a corrida para "soltar" a musculatura'
    },
    {
      dia: 'Quinta-feira',
      titulo: 'Descanso Ativo (Apenas Cardio e Core)',
      foco: 'Recuperacao muscular e queima de gordura pura',
      duracao: '15-20 min abdomen',
      exercicios: [
        'Folga de pesos',
        'Treino completo de abdomen (Supra, Infra e Obliquos)'
      ],
      cardio: 'Projeto 2k Day: Tente fazer o seu MELHOR TEMPO da semana!'
    },
    {
      dia: 'Sexta-feira',
      titulo: 'Upper Body (Superior Completo)',
      foco: 'Pump para o fim de semana e correcao de pontos fracos',
      duracao: '45-60 min',
      exercicios: [
        '1 exercicio de Peito (ex: Voador/Peck Deck)',
        '1 exercicio de Costas (ex: Puxada Frente)',
        '2 exercicios de Ombro (Elevacao Lateral e Posterior)',
        'Super-serie de Bracos (Biceps e Triceps alternados sem descanso)'
      ],
      cardio: 'Projeto 2k Day: Ritmo Moderado'
    },
    {
      dia: 'Sabado',
      titulo: 'Lower Body (Posterior e Gluteo)',
      foco: 'Parte de tras da perna e condicionamento',
      duracao: '30-45 min (opcional)',
      exercicios: [
        'Stiff ou Levantamento Terra (otimo para postura)',
        'Mesa Flexora',
        'Cadeira Adutora'
      ],
      cardio: 'Projeto 2k Day: Corrida completada. Se tiver energia, estenda com caminhada'
    },
    {
      dia: 'Domingo',
      titulo: 'Descanso Total e Preparacao',
      foco: 'Relaxar o sistema nervoso central',
      duracao: 'Sem pesos',
      exercicios: [
        'NENHUM peso',
        'Planeje as refeicoes da semana (Meal Prep)'
      ],
      cardio: 'Projeto 2k Day: Corrida leve matinal para ativar o corpo'
    }
  ],

  // Dieta Completa
  dieta: {
    hidratacao: {
      meta: '3,5 a 4 Litros de agua por dia',
      dica: 'Beba 500ml assim que acordar - ativa o metabolismo'
    },
    semana: {
      titulo: 'Segunda a Sexta (Rotina de Estudo/Trabalho)',
      refeicoes: [
        {
          nome: 'Cafe da Manha',
          objetivo: 'Saciedade e proteina logo cedo',
          opcoes: [
            '3 Ovos mexidos (ou cozidos) + 1-2 fatias de pao integral com requeijao light',
            'Crepioca (2 ovos + 2 colheres de goma de tapioca) recheada com queijo branco ou frango'
          ],
          bebida: 'Cafe preto sem acucar (ajuda no foco e queima de gordura)'
        },
        {
          nome: 'Almoco',
          objetivo: 'Combustivel para o dia',
          componentes: [
            { tipo: 'Proteina (Mao aberta)', qtd: '150g a 180g de Peito de Frango, Patinho ou Peixe' },
            { tipo: 'Carboidrato (Punho fechado)', qtd: '4 colheres de Arroz + 1 concha de Feijao' },
            { tipo: 'Vegetais (A vontade)', qtd: 'Alface, tomate, pepino, brocolis. Tempere com azeite e limao' }
          ]
        },
        {
          nome: 'Lanche da Tarde (Pre-Treino)',
          objetivo: 'Energia rapida sem enjoar na corrida',
          timing: '1h a 45min antes do treino',
          opcoes: [
            '1 Banana amassada + 2 colheres de aveia + 1 scoop de Whey',
            '1 Iogurte Natural com frutas (morango ou uva)'
          ]
        },
        {
          nome: 'Jantar (Pos-Treino)',
          objetivo: 'Consertar o musculo e repor energia',
          componentes: [
            { tipo: 'Proteina', qtd: '150g de Frango ou Carne Magra' },
            { tipo: 'Carboidrato de Qualidade', qtd: '150g de Batata Doce, Inglesa, Mandioca ou Abobora' },
            { tipo: 'Salada', qtd: 'Folhas verdes a vontade' }
          ]
        },
        {
          nome: 'Ceia (Opcional)',
          objetivo: 'Manter o corpo nutrido enquanto dorme',
          opcoes: [
            '2 Ovos cozidos',
            '1 fatia de queijo branco',
            '1 dose de albumina/caseina'
          ]
        }
      ]
    },
    fimDeSemana: {
      sabado: {
        almoco: 'Pode trocar arroz/feijao por Macarrao integral com molho de tomate e carne moida',
        refeicaoLivre: 'UMA refeicao livre (hamburguer artesanal ou 2 fatias de pizza). Coma proteina junto!'
      },
      domingo: {
        dica: 'Reduza um pouco o carboidrato (menos arroz/batata) ja que nao vai treinar musculacao',
        foco: 'Compre e prepare as marmitas da semana'
      }
    }
  },

  // Suplementacao
  suplementacao: [
    {
      nome: 'Creatina',
      dose: '3g a 5g por dia',
      frequencia: 'Todos os dias (mesmo sem treino)',
      beneficio: 'Puxa agua para o musculo (deixando cheio e duro) e da mais forca'
    },
    {
      nome: 'Whey Protein',
      dose: '1 scoop',
      frequencia: 'Quando nao conseguir comer proteina solida',
      beneficio: 'Praticidade para bater a meta de proteina'
    }
  ],

  // O que evitar
  evitar: [
    {
      item: 'Bebidas acucaradas',
      razao: 'Refrigerante, suco de caixinha - calorias vazias que vao direto para a barriga'
    },
    {
      item: 'Alcool',
      razao: 'Para a queima de gordura e diminui a testosterona'
    },
    {
      item: 'Frituras',
      razao: 'Oleo de soja em excesso inflama o corpo e esconde a definicao'
    }
  ],

  // Principios da Dieta
  principiosDieta: {
    deficitCalorico: 'Corte de 300 a 500 calorias diarias (nao faca dietas de fome!)',
    proteina: {
      meta: '1,6g a 2g de proteina por kg de peso corporal',
      fontes: 'Frango, ovos, carne vermelha magra (patinho), peixe, whey protein'
    },
    carboidratos: 'Nao zere! Prefira batata, arroz, aveia e frutas',
    agua: 'Minimo 3-4 litros por dia para evitar retencao'
  },

  // Principios do Treino
  principiosTreino: {
    foco: 'Musculacao Pesada (nao apenas aerobico)',
    exerciciosCompostos: [
      'Agachamento',
      'Levantamento Terra',
      'Supino',
      'Remada Curvada',
      'Desenvolvimento de Ombros'
    ],
    hipertrofia: '8 a 12 repeticoes com carga dificil (chegar perto da falha)',
    abdomen: {
      dica: 'Treinar abdomen com CARGA (peso), nao 1000 abdominais sem peso',
      exercicios: ['Abdominal na polia (com peso)', 'Elevacao de pernas na barra fixa', 'Prancha']
    }
  },

  // Monitoramento
  monitoramento: {
    fotos: 'Tire foto no mesmo espelho, mesma luz, a cada 15 dias',
    cargas: 'Anote as cargas. Tente subir peso ou repeticoes a cada 2 semanas'
  }
}

// Helper para obter o treino do dia atual
export const getTreinoDoDia = () => {
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']
  const hoje = new Date().getDay()
  const diaAtual = diasSemana[hoje]

  return shapeGuide.rotinaSemanal.find(treino => treino.dia === diaAtual)
}

// Helper para obter refeicao baseada no horario
export const getRefeicaoAtual = () => {
  const hora = new Date().getHours()

  if (hora >= 6 && hora < 10) return 'Cafe da Manha'
  if (hora >= 11 && hora < 14) return 'Almoco'
  if (hora >= 15 && hora < 17) return 'Lanche da Tarde'
  if (hora >= 18 && hora < 21) return 'Jantar'
  if (hora >= 21 || hora < 6) return 'Ceia'

  return null
}
