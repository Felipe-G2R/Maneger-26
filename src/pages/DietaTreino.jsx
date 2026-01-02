import { useState } from 'react'
import {
  Dumbbell,
  Apple,
  Droplets,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Moon,
  Sun,
  Trophy,
  AlertTriangle,
  Pill,
  Gauge,
  Timer,
  Repeat
} from 'lucide-react'
import { Card } from '../components/common/Card'

const sections = [
  {
    id: 'dieta',
    title: 'A Dieta (80% do Resultado)',
    icon: Apple,
    color: '#22c55e',
    content: [
      {
        title: 'Deficit Calorico Leve',
        description: 'Coma um pouco menos do que gasta. Nao faca dietas de fome! Um corte de 300 a 500 calorias diarias e o ideal. Isso forca o corpo a usar a gordura estocada como energia.'
      },
      {
        title: 'Proteina Alta (Meta: 1,6g a 2g por kg)',
        description: 'Crucial para ficar definido e nao "magrelo". Proteja seus musculos.',
        items: ['Frango', 'Ovos', 'Carne vermelha magra (patinho)', 'Peixe', 'Whey protein']
      },
      {
        title: 'Carboidratos Inteligentes',
        description: 'Nao zere o carboidrato, voce precisa de energia para treinar pesado.',
        items: ['Batata', 'Arroz', 'Aveia', 'Frutas']
      },
      {
        title: 'Agua',
        description: 'A retencao de liquido muitas vezes esconde a definicao abdominal. Beba pelo menos 3 a 4 litros de agua por dia.'
      }
    ]
  },
  {
    id: 'treino',
    title: 'O Treino (A Escultura)',
    icon: Dumbbell,
    color: '#ef4444',
    content: [
      {
        title: 'Exercicios Compostos',
        description: 'Trabalham varios musculos ao mesmo tempo e aumentam a testosterona natural.',
        items: ['Agachamento', 'Levantamento Terra', 'Supino', 'Remada Curvada', 'Desenvolvimento de Ombros']
      },
      {
        title: 'Treino de Hipertrofia',
        description: 'Faca entre 8 a 12 repeticoes com uma carga que seja dificil de levantar nas ultimas repeticoes (chegar perto da falha).'
      },
      {
        title: 'O Abdomen',
        description: 'O abdomen e um musculo como qualquer outro. Para ele ficar "saltado" (os gominhos), voce precisa treina-lo com carga (peso), e nao fazer 1.000 abdominais sem peso.',
        items: ['Abdominal na polia (com peso)', 'Elevacao de pernas na barra fixa', 'Prancha']
      }
    ]
  },
  {
    id: 'cardio',
    title: 'O Cardio (Acelerador)',
    icon: Flame,
    color: '#f97316',
    content: [
      {
        title: 'Frequencia',
        description: '3 a 4 vezes na semana.'
      },
      {
        title: 'Tipo',
        description: 'Corrida moderada, bicicleta ou caminhada rapida inclinada. O HIIT (treino intervalado de alta intensidade) e otimo para queimar gordura mais rapido se voce tiver pouco tempo.'
      }
    ]
  }
]

const weeklyRoutine = [
  {
    day: 'Segunda-feira',
    title: 'Empurrar (Peito, Ombros e Triceps)',
    focus: 'Largura de ombros e peitoral desenhado',
    exercises: [
      'Supino Inclinado com Halteres',
      'Supino Reto (Barra ou Maquina)',
      'Desenvolvimento de Ombros com Halteres',
      'Elevacao Lateral',
      'Triceps Corda na Polia'
    ],
    cardio: 'Projeto 2k Day: Ritmo Moderado a Forte (pos-treino)',
    color: '#3b82f6'
  },
  {
    day: 'Terca-feira',
    title: 'Puxar (Costas, Biceps e Trapezio)',
    focus: 'O "V" das costas e biceps',
    exercises: [
      'Puxada Alta (Polia) ou Barra Fixa',
      'Remada Curvada ou Serrote',
      'Remada Baixa (Triangulo)',
      'Rosca Direta (Barra ou Halteres)',
      'Rosca Martelo'
    ],
    cardio: 'Projeto 2k Day: Ritmo Moderado',
    color: '#8b5cf6'
  },
  {
    day: 'Quarta-feira',
    title: 'Pernas Completo (Foco Quadriceps)',
    focus: 'Pernas fortes e base solida',
    exercises: [
      'Agachamento Livre ou no Smith',
      'Leg Press 45',
      'Cadeira Extensora',
      'Panturrilhas em pe',
      'Abdomen: Prancha + Abdominal Infra'
    ],
    cardio: 'Projeto 2k Day: Ritmo LEVE (pernas cansadas)',
    color: '#ef4444'
  },
  {
    day: 'Quinta-feira',
    title: 'Descanso Ativo (Cardio e Core)',
    focus: 'Recuperacao muscular e queima de gordura pura',
    exercises: [
      'Folga de pesos',
      'Treino completo de abdomen (Supra, Infra e Obliquos) - 15 a 20 min'
    ],
    cardio: 'Projeto 2k Day: Faca o seu melhor tempo da semana!',
    color: '#22c55e'
  },
  {
    day: 'Sexta-feira',
    title: 'Upper Body (Superior Completo)',
    focus: '"Pump" para o fim de semana',
    exercises: [
      '1 exercicio de Peito (ex: Voador/Peck Deck)',
      '1 exercicio de Costas (ex: Puxada Frente)',
      '2 exercicios de Ombro (Elevacao Lateral e Posterior)',
      'Super-serie de Bracos (Biceps e Triceps alternados)'
    ],
    cardio: 'Projeto 2k Day: Ritmo Moderado',
    color: '#f97316'
  },
  {
    day: 'Sabado',
    title: 'Lower Body (Posterior e Gluteo)',
    focus: 'Parte de tras da perna e condicionamento',
    exercises: [
      'Stiff ou Levantamento Terra',
      'Mesa Flexora',
      'Cadeira Adutora'
    ],
    cardio: 'Projeto 2k Day: Corrida completada + caminhada opcional',
    color: '#ec4899'
  },
  {
    day: 'Domingo',
    title: 'Descanso Total e Preparacao',
    focus: 'Relaxar o sistema nervoso central',
    exercises: [
      'NENHUM peso',
      'Planeje as refeicoes da semana (Meal Prep)'
    ],
    cardio: 'Projeto 2k Day: Corrida leve matinal',
    color: '#6b7280'
  }
]

const mealPlan = {
  semana: [
    {
      meal: 'Cafe da Manha',
      icon: Sun,
      options: [
        '3 Ovos mexidos + 1-2 fatias de pao integral com requeijao light',
        'Crepioca (2 ovos + 2 col. goma de tapioca) com queijo branco ou frango'
      ],
      drink: 'Cafe preto (sem acucar ou com adocante)'
    },
    {
      meal: 'Almoco',
      icon: Clock,
      description: 'Metade do prato deve ser vegetais',
      items: [
        'Proteina (150g a 180g): Frango grelhado, Patinho moido ou Peixe',
        'Carboidrato: 4 col. sopa de Arroz + 1 concha de Feijao',
        'Vegetais (a vontade): Alface, tomate, pepino, brocolis, cenoura',
        'Tempero: Azeite de oliva e limao'
      ]
    },
    {
      meal: 'Lanche da Tarde (Pre-Treino)',
      icon: Zap,
      description: 'Coma 1h a 45min antes de treinar',
      options: [
        '1 Banana amassada + 2 col. aveia + 1 scoop Whey (ou 2 ovos cozidos)',
        '1 Iogurte Natural com frutas picadas'
      ]
    },
    {
      meal: 'Jantar (Pos-Treino)',
      icon: Moon,
      description: '"Conserta" o musculo e repoe energia',
      items: [
        'Proteina: 150g de Frango ou Carne Magra',
        'Carboidrato: 150g Batata Doce, Inglesa, Mandioca ou Abobora',
        'Salada: Folhas verdes a vontade'
      ]
    },
    {
      meal: 'Ceia (Opcional)',
      icon: Moon,
      description: 'So coma se tiver muita fome',
      options: [
        '2 Ovos cozidos',
        '1 fatia de queijo branco',
        '1 dose de albumina/caseina'
      ]
    }
  ],
  fimDeSemana: {
    sabado: 'Almoco: Pode trocar arroz/feijao por Macarrao (integral) com molho de tomate caseiro e carne moida magra.',
    refeicaoLivre: '1 refeicao livre na semana (hamburguer artesanal ou 2 fatias de pizza). E uma refeicao, nao o dia todo!',
    domingo: 'Mantenha a estrutura da semana, mas pode reduzir carboidrato (menos arroz/batata) ja que nao vai treinar musculacao.'
  }
}

const supplements = [
  {
    name: 'Creatina',
    dose: '3g a 5g por dia',
    description: 'Indispensavel. Toma-se todos os dias (mesmo sem treino). Puxa agua para dentro do musculo (deixando-o cheio e duro) e te da forca para levantar mais peso.',
    icon: Pill
  },
  {
    name: 'Whey Protein',
    dose: '1 scoop pos-treino',
    description: 'Pela praticidade. As vezes e dificil comer ovo ou frango a tarde na faculdade/trabalho. O Whey resolve isso rapido.',
    icon: Zap
  }
]

const avoidList = [
  {
    item: 'Bebidas acucaradas',
    description: 'Refrigerante, suco de caixinha (calorias vazias que vao direto para a barriga)'
  },
  {
    item: 'Alcool',
    description: 'Para a queima de gordura e diminui a testosterona. Reduza a frequencia drasticamente.'
  },
  {
    item: 'Frituras',
    description: 'Oleo de soja em excesso inflama o corpo e esconde a definicao.'
  }
]

// Periodizacao Anual - Progressao de Cargas
const periodizacao = [
  {
    id: 'fase1',
    fase: 'FASE 1',
    periodo: 'Janeiro - Marco',
    meses: 'Meses 1-3',
    titulo: 'Adaptacao e Base',
    objetivo: 'Aprender os movimentos, criar conexao mente-musculo e preparar o corpo para cargas maiores',
    color: '#22c55e',
    colorBg: '#22c55e20',
    intensidade: '50-65%',
    descanso: '60-90 seg',
    exercises: [
      { nome: 'Supino Inclinado Halteres', series: '3x12-15', carga: '8-12kg cada', obs: 'Foco na execucao' },
      { nome: 'Supino Reto', series: '3x12-15', carga: '20-30kg total', obs: 'Barra ou maquina' },
      { nome: 'Desenvolvimento Ombros', series: '3x12-15', carga: '6-10kg cada', obs: 'Sentado, controlado' },
      { nome: 'Elevacao Lateral', series: '3x15-20', carga: '4-6kg cada', obs: 'Leve e controlado' },
      { nome: 'Triceps Corda', series: '3x15', carga: '15-20kg', obs: 'Polia' },
      { nome: 'Puxada Alta', series: '3x12-15', carga: '35-45kg', obs: 'Pegada aberta' },
      { nome: 'Remada Curvada', series: '3x12-15', carga: '20-30kg', obs: 'Costas retas' },
      { nome: 'Remada Baixa', series: '3x12-15', carga: '30-40kg', obs: 'Triangulo' },
      { nome: 'Rosca Direta', series: '3x12-15', carga: '8-12kg total', obs: 'Barra W' },
      { nome: 'Rosca Martelo', series: '3x12-15', carga: '6-8kg cada', obs: 'Alternado' },
      { nome: 'Agachamento', series: '3x12-15', carga: '30-50kg', obs: 'Smith ou livre' },
      { nome: 'Leg Press 45', series: '3x15', carga: '80-120kg', obs: 'Pes largura ombros' },
      { nome: 'Cadeira Extensora', series: '3x15', carga: '25-35kg', obs: 'Contracao no topo' },
      { nome: 'Panturrilha', series: '4x20', carga: 'Peso corporal', obs: 'Amplitude total' },
      { nome: 'Stiff', series: '3x12', carga: '20-30kg', obs: 'Joelhos semi-flexionados' },
      { nome: 'Mesa Flexora', series: '3x15', carga: '20-30kg', obs: 'Posterior de coxa' },
      { nome: 'Prancha', series: '3x30-45seg', carga: 'Peso corporal', obs: 'Core contraido' },
      { nome: 'Abdominal Infra', series: '3x15-20', carga: 'Peso corporal', obs: 'Elevacao de pernas' }
    ]
  },
  {
    id: 'fase2',
    fase: 'FASE 2',
    periodo: 'Abril - Junho',
    meses: 'Meses 4-6',
    titulo: 'Construcao Muscular',
    objetivo: 'Hipertrofia classica - aumentar volume muscular com cargas progressivas',
    color: '#3b82f6',
    colorBg: '#3b82f620',
    intensidade: '65-75%',
    descanso: '60-90 seg',
    exercises: [
      { nome: 'Supino Inclinado Halteres', series: '4x10-12', carga: '14-18kg cada', obs: '+40% carga' },
      { nome: 'Supino Reto', series: '4x10-12', carga: '40-50kg total', obs: 'Barra livre' },
      { nome: 'Desenvolvimento Ombros', series: '4x10-12', carga: '12-16kg cada', obs: 'Em pe ou sentado' },
      { nome: 'Elevacao Lateral', series: '4x12-15', carga: '8-10kg cada', obs: 'Drop set ultima serie' },
      { nome: 'Triceps Corda', series: '4x12', carga: '25-35kg', obs: '+ Triceps Frances' },
      { nome: 'Puxada Alta', series: '4x10-12', carga: '50-60kg', obs: 'Pegada fechada tambem' },
      { nome: 'Remada Curvada', series: '4x10-12', carga: '40-50kg', obs: 'Barra ou halteres' },
      { nome: 'Remada Baixa', series: '4x10-12', carga: '50-60kg', obs: 'Unilateral tambem' },
      { nome: 'Rosca Direta', series: '4x10-12', carga: '15-20kg total', obs: 'Barra reta' },
      { nome: 'Rosca Martelo', series: '4x10-12', carga: '10-12kg cada', obs: 'Simultaneo' },
      { nome: 'Agachamento', series: '4x10-12', carga: '60-80kg', obs: 'Profundo' },
      { nome: 'Leg Press 45', series: '4x12', carga: '150-200kg', obs: 'Pes variados' },
      { nome: 'Cadeira Extensora', series: '4x12', carga: '40-50kg', obs: 'Unilateral tambem' },
      { nome: 'Panturrilha', series: '4x15-20', carga: '40-60kg', obs: 'Maquina ou Smith' },
      { nome: 'Stiff', series: '4x10-12', carga: '40-50kg', obs: 'Halteres ou barra' },
      { nome: 'Mesa Flexora', series: '4x12', carga: '35-45kg', obs: 'Foco na negativa' },
      { nome: 'Abdominal Polia', series: '4x12-15', carga: '20-30kg', obs: 'Crunch na polia' },
      { nome: 'Elevacao Pernas', series: '4x12-15', carga: 'Peso corporal', obs: 'Barra fixa' }
    ]
  },
  {
    id: 'fase3',
    fase: 'FASE 3',
    periodo: 'Julho - Setembro',
    meses: 'Meses 7-9',
    titulo: 'Forca e Intensidade',
    objetivo: 'Aumentar forca maxima e densidade muscular com cargas pesadas',
    color: '#ef4444',
    colorBg: '#ef444420',
    intensidade: '75-85%',
    descanso: '90-120 seg',
    exercises: [
      { nome: 'Supino Inclinado Halteres', series: '4x8-10', carga: '20-26kg cada', obs: 'Pesado e controlado' },
      { nome: 'Supino Reto', series: '5x6-8', carga: '60-80kg total', obs: 'Forca maxima' },
      { nome: 'Desenvolvimento Ombros', series: '4x8-10', carga: '18-24kg cada', obs: 'Arnold Press' },
      { nome: 'Elevacao Lateral', series: '4x10-12', carga: '12-14kg cada', obs: 'Estrito' },
      { nome: 'Triceps Testa', series: '4x8-10', carga: '25-35kg', obs: 'Barra W' },
      { nome: 'Barra Fixa', series: '4x6-10', carga: '+5-10kg', obs: 'Lastro se possivel' },
      { nome: 'Remada Curvada', series: '4x8-10', carga: '60-70kg', obs: 'Pegada pronada' },
      { nome: 'Remada Cavalinho', series: '4x8-10', carga: '3-4 anilhas', obs: 'Maquina T' },
      { nome: 'Rosca Scott', series: '4x8-10', carga: '25-30kg', obs: 'Banco scott' },
      { nome: 'Rosca Concentrada', series: '3x10', carga: '12-16kg', obs: 'Pico de contracao' },
      { nome: 'Agachamento', series: '5x6-8', carga: '90-120kg', obs: 'Forca!' },
      { nome: 'Leg Press 45', series: '4x8-10', carga: '250-350kg', obs: 'Pesado' },
      { nome: 'Hack Squat', series: '4x8-10', carga: '80-100kg', obs: 'Se disponivel' },
      { nome: 'Panturrilha', series: '5x12-15', carga: '80-100kg', obs: 'Carga pesada' },
      { nome: 'Levantamento Terra', series: '4x6-8', carga: '80-100kg', obs: 'Tecnica perfeita' },
      { nome: 'Mesa Flexora', series: '4x8-10', carga: '50-60kg', obs: 'Pesado' },
      { nome: 'Abdominal Polia', series: '4x10-12', carga: '35-45kg', obs: 'Carga progressiva' },
      { nome: 'Dragon Flag', series: '3x6-10', carga: 'Peso corporal', obs: 'Avancado' }
    ]
  },
  {
    id: 'fase4',
    fase: 'FASE 4',
    periodo: 'Outubro - Dezembro',
    meses: 'Meses 10-12',
    titulo: 'Definicao e Refinamento',
    objetivo: 'Manter massa muscular, definir e mostrar o trabalho do ano todo',
    color: '#f97316',
    colorBg: '#f9731620',
    intensidade: '65-75%',
    descanso: '45-60 seg',
    exercises: [
      { nome: 'Supino Inclinado Halteres', series: '4x12-15', carga: '16-20kg cada', obs: 'Mais volume' },
      { nome: 'Supino Reto', series: '4x10-12', carga: '50-60kg total', obs: 'Manter forca' },
      { nome: 'Crossover', series: '4x15', carga: '15-25kg lado', obs: 'Definicao peitoral' },
      { nome: 'Elevacao Lateral', series: '5x15-20', carga: '8-12kg cada', obs: 'Giant set' },
      { nome: 'Elevacao Frontal', series: '3x15', carga: '8-10kg cada', obs: 'Complemento' },
      { nome: 'Triceps Francês', series: '4x12-15', carga: '20-30kg', obs: 'Super-serie biceps' },
      { nome: 'Puxada Alta', series: '4x12-15', carga: '55-65kg', obs: 'Drop sets' },
      { nome: 'Remada Unilateral', series: '4x12', carga: '18-22kg', obs: 'Serrote' },
      { nome: 'Pulldown Braco Reto', series: '3x15', carga: '25-35kg', obs: 'Definicao' },
      { nome: 'Rosca 21', series: '3x21', carga: '10-15kg', obs: '7+7+7 reps' },
      { nome: 'Rosca Inversa', series: '3x15', carga: '10-15kg', obs: 'Antebraco' },
      { nome: 'Agachamento', series: '4x12-15', carga: '70-90kg', obs: 'Mais reps' },
      { nome: 'Leg Press 45', series: '4x15-20', carga: '200-280kg', obs: 'Drop set final' },
      { nome: 'Afundo', series: '3x12 cada', carga: '10-14kg cada', obs: 'Caminhando' },
      { nome: 'Panturrilha', series: '5x20', carga: '60-80kg', obs: 'Alto volume' },
      { nome: 'Stiff', series: '4x12-15', carga: '40-50kg', obs: 'Definir posterior' },
      { nome: 'Cadeira Adutora/Abdutora', series: '3x20 cada', carga: '40-50kg', obs: 'Acabamento' },
      { nome: 'Circuito Abdomen', series: '4 rounds', carga: 'Misto', obs: '4 exercicios sem pausa' }
    ]
  }
]

export function DietaTreino() {
  const [expandedSection, setExpandedSection] = useState('dieta')
  const [expandedDay, setExpandedDay] = useState(null)
  const [expandedFase, setExpandedFase] = useState('fase1')

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const toggleFase = (id) => {
    setExpandedFase(expandedFase === id ? null : id)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Projeto Shape 2026</span>
        </h1>
        <p className="text-slate-600 dark:text-dark-muted">
          Seu guia completo para transformacao fisica natural
        </p>
      </div>

      {/* Regra de Ouro */}
      <Card className="border-l-4 border-l-amber-500">
        <div className="flex items-start gap-3">
          <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2">Regra de Ouro do "2k Day"</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-muted">
              <li><strong>Quando correr?</strong> De preferencia, APOS o treino de musculacao ou em horario separado.</li>
              <li><strong>Porque?</strong> Se correr antes, gastara a energia que precisaria para levantar peso com intensidade.</li>
              <li><strong>Ritmo:</strong> Nos dias de treino de perna, faca os 2km num ritmo leve/regenerativo. Nos outros dias, pode acelerar.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(section => (
          <Card key={section.id} className="overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-dark-border/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: section.color + '20' }}
                >
                  <section.icon className="w-5 h-5" style={{ color: section.color }} />
                </div>
                <h2 className="font-bold text-lg">{section.title}</h2>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="px-4 pb-4 space-y-4">
                {section.content.map((item, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-slate-200 dark:border-dark-border">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-dark-muted mb-2">{item.description}</p>
                    {item.items && (
                      <ul className="space-y-1">
                        {item.items.map((i, iIdx) => (
                          <li key={iIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {i}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Rotina Semanal */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-500" />
          Rotina Semanal Blindada
        </h2>
        <div className="grid gap-3">
          {weeklyRoutine.map(day => (
            <Card key={day.day} className="overflow-hidden">
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-dark-border/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-10 rounded-full"
                    style={{ backgroundColor: day.color }}
                  />
                  <div className="text-left">
                    <p className="font-bold">{day.day}</p>
                    <p className="text-sm text-slate-600 dark:text-dark-muted">{day.title}</p>
                  </div>
                </div>
                {expandedDay === day.day ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedDay === day.day && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" style={{ color: day.color }} />
                    <span className="font-medium">Foco:</span> {day.focus}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Exercicios:</p>
                    <ul className="space-y-1 ml-4">
                      {day.exercises.map((ex, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-dark-muted">
                          <Dumbbell className="w-3 h-3" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-500/10 p-2 rounded-lg">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{day.cardio}</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Periodizacao Anual */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gauge className="w-6 h-6 text-purple-500" />
          Periodizacao Anual - Cargas Progressivas
        </h2>
        <p className="text-sm text-slate-600 dark:text-dark-muted mb-4">
          Siga esta progressao de cargas ao longo do ano para maximizar seus resultados de forma segura e eficiente.
        </p>

        {/* Timeline Visual */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {periodizacao.map((fase, idx) => (
            <button
              key={fase.id}
              onClick={() => toggleFase(fase.id)}
              className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 transition-all ${
                expandedFase === fase.id
                  ? 'border-current shadow-lg scale-105'
                  : 'border-slate-200 dark:border-dark-border hover:border-slate-300'
              }`}
              style={{
                borderColor: expandedFase === fase.id ? fase.color : undefined,
                backgroundColor: expandedFase === fase.id ? fase.colorBg : undefined
              }}
            >
              <div className="text-xs font-bold" style={{ color: fase.color }}>{fase.fase}</div>
              <div className="text-xs text-slate-500 dark:text-dark-muted mt-1">{fase.periodo}</div>
            </button>
          ))}
        </div>

        {/* Detalhes da Fase */}
        {periodizacao.map(fase => (
          expandedFase === fase.id && (
            <Card key={fase.id} className="overflow-hidden">
              {/* Header da Fase */}
              <div
                className="p-4 border-b border-slate-200 dark:border-dark-border"
                style={{ backgroundColor: fase.colorBg }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: fase.color }}>
                      {fase.fase}: {fase.titulo}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-dark-muted">{fase.periodo}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: fase.color }}
                  >
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{fase.objetivo}</p>

                {/* Metricas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-white dark:bg-dark-card p-2 rounded-lg">
                    <Gauge className="w-4 h-4" style={{ color: fase.color }} />
                    <div>
                      <div className="text-xs text-slate-500">Intensidade</div>
                      <div className="text-sm font-bold">{fase.intensidade}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-dark-card p-2 rounded-lg">
                    <Timer className="w-4 h-4" style={{ color: fase.color }} />
                    <div>
                      <div className="text-xs text-slate-500">Descanso</div>
                      <div className="text-sm font-bold">{fase.descanso}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Exercicios */}
              <div className="p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Cargas e Repeticoes Recomendadas
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-dark-border">
                        <th className="text-left py-2 px-2 font-semibold">Exercicio</th>
                        <th className="text-center py-2 px-2 font-semibold">Series x Reps</th>
                        <th className="text-center py-2 px-2 font-semibold">Carga</th>
                        <th className="text-left py-2 px-2 font-semibold hidden md:table-cell">Obs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fase.exercises.map((ex, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-slate-100 dark:border-dark-border/50 ${
                            idx % 2 === 0 ? 'bg-slate-50 dark:bg-dark-border/20' : ''
                          }`}
                        >
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="w-3 h-3 flex-shrink-0" style={{ color: fase.color }} />
                              <span className="font-medium">{ex.nome}</span>
                            </div>
                          </td>
                          <td className="text-center py-2 px-2">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: fase.colorBg, color: fase.color }}
                            >
                              {ex.series}
                            </span>
                          </td>
                          <td className="text-center py-2 px-2 font-semibold text-slate-700 dark:text-slate-300">
                            {ex.carga}
                          </td>
                          <td className="py-2 px-2 text-slate-500 dark:text-dark-muted hidden md:table-cell">
                            {ex.obs}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dica da Fase */}
              <div className="px-4 pb-4">
                <div
                  className="p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: fase.colorBg }}
                >
                  <Trophy className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: fase.color }} />
                  <div className="text-sm">
                    <span className="font-bold" style={{ color: fase.color }}>Dica: </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {fase.id === 'fase1' && 'Nao tenha pressa! Aprenda a tecnica correta agora para evitar lesoes e ganhar mais no futuro.'}
                      {fase.id === 'fase2' && 'E hora de aumentar as cargas! Se consegue fazer mais de 12 reps facilmente, aumente o peso.'}
                      {fase.id === 'fase3' && 'Fase mais intensa do ano. Descanse bem, coma bastante proteina e durma 7-8h por noite.'}
                      {fase.id === 'fase4' && 'Mantenha as cargas mas aumente o volume. Menos descanso = mais definicao. Capriche no cardio!'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        ))}

        {/* Legenda */}
        <Card className="mt-4 p-4">
          <h4 className="font-bold mb-3">Como interpretar as cargas:</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-muted">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>"X-Y kg cada"</strong> = peso de cada halter (ex: 10kg cada = 20kg total)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>"X-Y kg total"</strong> = peso total na barra (incluindo a barra de ~20kg)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Intensidade %</strong> = percentual da sua carga maxima (1RM)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Ajuste individual:</strong> As cargas sao estimativas. Aumente se muito facil, diminua se nao conseguir manter a forma correta.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Plano Alimentar */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Apple className="w-6 h-6 text-green-500" />
          Plano Alimentar
        </h2>

        {/* Hidratacao */}
        <Card className="mb-4 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <Droplets className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold">Regra Zero: Hidratacao</h3>
              <p className="text-sm text-slate-600 dark:text-dark-muted">
                Meta: 3,5 a 4 Litros de agua por dia. Beba 500ml assim que acordar para ativar o metabolismo.
              </p>
            </div>
          </div>
        </Card>

        {/* Refeicoes */}
        <div className="grid gap-3 md:grid-cols-2">
          {mealPlan.semana.map((meal, idx) => (
            <Card key={idx}>
              <div className="flex items-center gap-2 mb-3">
                <meal.icon className="w-5 h-5 text-primary-500" />
                <h4 className="font-bold">{meal.meal}</h4>
              </div>
              {meal.description && (
                <p className="text-xs text-slate-500 dark:text-dark-muted mb-2">{meal.description}</p>
              )}
              {meal.options && (
                <ul className="space-y-2">
                  {meal.options.map((opt, oIdx) => (
                    <li key={oIdx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
              {meal.items && (
                <ul className="space-y-1">
                  {meal.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {meal.drink && (
                <p className="text-xs text-slate-500 dark:text-dark-muted mt-2">Bebida: {meal.drink}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Fim de Semana */}
        <Card className="mt-4">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Fim de Semana Estrategico
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-muted">
            <li><strong>Sabado:</strong> {mealPlan.fimDeSemana.sabado}</li>
            <li><strong>Refeicao Livre:</strong> {mealPlan.fimDeSemana.refeicaoLivre}</li>
            <li><strong>Domingo:</strong> {mealPlan.fimDeSemana.domingo}</li>
          </ul>
        </Card>
      </div>

      {/* Suplementacao */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Pill className="w-6 h-6 text-purple-500" />
          Suplementacao (Opcional)
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {supplements.map((sup, idx) => (
            <Card key={idx}>
              <div className="flex items-center gap-2 mb-2">
                <sup.icon className="w-5 h-5 text-purple-500" />
                <h4 className="font-bold">{sup.name}</h4>
                <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                  {sup.dose}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-dark-muted">{sup.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* O que Evitar */}
      <Card className="border-l-4 border-l-red-500">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          O que Cortar (Os viloes da barriga definida)
        </h3>
        <ul className="space-y-2">
          {avoidList.map((item, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-semibold text-red-600 dark:text-red-400">{item.item}:</span>{' '}
              <span className="text-slate-600 dark:text-dark-muted">{item.description}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Timeline */}
      <Card className="border-l-4 border-l-green-500">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Quanto tempo leva?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-16 text-sm font-bold text-green-600">3-4 meses</div>
            <p className="text-sm text-slate-600 dark:text-dark-muted">
              Mudanca drastica na silhueta (roupas caindo melhor, rosto desinchando)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-16 text-sm font-bold text-green-600">6-12 meses</div>
            <p className="text-sm text-slate-600 dark:text-dark-muted">
              Prazo realista para atingir a densidade muscular e definicao completa
            </p>
          </div>
        </div>
      </Card>

      {/* Dicas de Monitoramento */}
      <Card>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          Como Monitorizar o Progresso
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Fotos:</strong> Tire uma foto no mesmo espelho, com a mesma luz, a cada 15 dias (Dia 1 e Dia 15 do mes).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Registro:</strong> Anote as cargas que levanta. Tente subir o peso ou as repeticoes a cada 2 semanas.</span>
          </li>
        </ul>
      </Card>

      {/* Motivacao Final */}
      <div className="text-center py-6">
        <p className="text-lg font-semibold gradient-text">
          "Seu corpo e construido na cozinha e esculpido no treino."
        </p>
        <p className="text-sm text-slate-500 dark:text-dark-muted mt-2">
          A corrida de 2km todo dia vai ser o seu "queimador de gordura extra"
        </p>
      </div>
    </div>
  )
}
