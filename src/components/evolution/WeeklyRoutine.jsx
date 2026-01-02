import { useState } from 'react'
import {
  Dumbbell,
  Utensils,
  ChevronDown,
  ChevronUp,
  Footprints,
  Moon,
  Droplets,
  Pill
} from 'lucide-react'
import { Card } from '../common'

const WEEKLY_ROUTINE = [
  {
    day: 'Segunda-feira',
    focus: 'Empurrar (Peito, Ombros, Triceps)',
    color: 'from-red-500 to-orange-500',
    workout: [
      'Supino Inclinado com Halteres',
      'Supino Reto (Barra ou Maquina)',
      'Desenvolvimento de Ombros com Halteres',
      'Elevacao Lateral',
      'Triceps Corda na Polia'
    ],
    cardio: 'Ritmo Moderado a Forte',
    duration: '45-60 min'
  },
  {
    day: 'Terca-feira',
    focus: 'Puxar (Costas, Biceps, Trapezio)',
    color: 'from-blue-500 to-cyan-500',
    workout: [
      'Puxada Alta (Polia) ou Barra Fixa',
      'Remada Curvada ou Serrote',
      'Remada Baixa (Triangulo)',
      'Rosca Direta (Barra ou Halteres)',
      'Rosca Martelo'
    ],
    cardio: 'Ritmo Moderado',
    duration: '45-60 min'
  },
  {
    day: 'Quarta-feira',
    focus: 'Pernas Completo (Foco Quadriceps)',
    color: 'from-purple-500 to-pink-500',
    workout: [
      'Agachamento Livre ou no Smith',
      'Leg Press 45º',
      'Cadeira Extensora',
      'Panturrilhas em pe',
      'Abdomen: Prancha + Infra'
    ],
    cardio: 'Ritmo LEVE (recuperacao)',
    duration: '45-60 min'
  },
  {
    day: 'Quinta-feira',
    focus: 'Descanso Ativo (Cardio + Core)',
    color: 'from-emerald-500 to-teal-500',
    workout: [
      'Folga de pesos',
      'Abdomen completo (Supra, Infra, Obliquos)',
      'Melhor tempo da semana no 2k!'
    ],
    cardio: 'Foco total no Projeto 2k Day',
    duration: '15-20 min (abdomen)'
  },
  {
    day: 'Sexta-feira',
    focus: 'Upper Body (Superior Completo)',
    color: 'from-amber-500 to-yellow-500',
    workout: [
      '1 exercicio de Peito (Voador/Peck Deck)',
      '1 exercicio de Costas (Puxada Frente)',
      '2 exercicios de Ombro (Lateral + Posterior)',
      'Super-serie de Bracos (Biceps/Triceps)'
    ],
    cardio: 'Ritmo Moderado',
    duration: '45-60 min'
  },
  {
    day: 'Sabado',
    focus: 'Lower Body (Posterior e Gluteo)',
    color: 'from-rose-500 to-red-500',
    workout: [
      'Stiff ou Levantamento Terra',
      'Mesa Flexora',
      'Cadeira Adutora',
      'Opcional: Esporte ao ar livre'
    ],
    cardio: 'Corrida + caminhada longa',
    duration: 'Treino leve ou opcional'
  },
  {
    day: 'Domingo',
    focus: 'Descanso Total e Preparacao',
    color: 'from-slate-500 to-slate-600',
    workout: [
      'NENHUM peso',
      'Corrida leve matinal',
      'Planejamento de refeicoes (Meal Prep)',
      'Descanso do sistema nervoso'
    ],
    cardio: 'Corrida leve para ativar',
    duration: 'Foco em recuperacao'
  }
]

const MEAL_PLAN = {
  morning: {
    title: 'Cafe da Manha',
    icon: '☀️',
    options: [
      '3 Ovos mexidos + 1-2 fatias pao integral com requeijao light',
      'Crepioca (2 ovos + 2 col. tapioca) com queijo branco ou frango'
    ],
    tip: 'Cafe preto sem acucar para foco e queima de gordura'
  },
  lunch: {
    title: 'Almoco',
    icon: '🍽️',
    options: [
      '150-180g Proteina (Frango, Patinho ou Peixe)',
      '4 col. sopa de Arroz + 1 concha de Feijao',
      'Vegetais a vontade (alface, tomate, brocolis)'
    ],
    tip: 'Metade do prato deve ser vegetais'
  },
  snack: {
    title: 'Lanche da Tarde (Pre-Treino)',
    icon: '🍌',
    options: [
      '1 Banana amassada + 2 col. aveia + Whey Protein',
      '1 Iogurte Natural com frutas picadas'
    ],
    tip: 'Comer 1h a 45min antes de treinar'
  },
  dinner: {
    title: 'Jantar (Pos-Treino)',
    icon: '🥗',
    options: [
      '150g de Frango ou Carne Magra',
      '150g de Batata Doce, Batata Inglesa ou Mandioca',
      'Salada de folhas verdes a vontade'
    ],
    tip: 'Momento de repor energia e recuperar musculos'
  },
  supper: {
    title: 'Ceia (Opcional)',
    icon: '🌙',
    options: [
      '2 Ovos cozidos',
      '1 fatia de queijo branco',
      '1 dose de albumina/caseina'
    ],
    tip: 'Apenas se tiver muita fome antes de dormir'
  }
}

export function WeeklyRoutine() {
  const [expandedDay, setExpandedDay] = useState(null)
  const [showMealPlan, setShowMealPlan] = useState(false)
  const [showSupplements, setShowSupplements] = useState(false)

  const today = new Date().getDay()
  const dayNames = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']
  const todayName = dayNames[today]

  return (
    <div className="space-y-6">
      {/* Rotina de Treino */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-red-500" />
          Rotina Semanal de Treino
          <span className="ml-auto text-sm font-normal text-primary-500">
            Projeto 2k Day
          </span>
        </h3>

        <div className="space-y-3">
          {WEEKLY_ROUTINE.map((routine, index) => {
            const isToday = routine.day === todayName
            const isExpanded = expandedDay === index

            return (
              <div
                key={routine.day}
                className={`rounded-xl overflow-hidden transition-all ${
                  isToday ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : index)}
                  className={`w-full p-4 flex items-center gap-3 bg-gradient-to-r ${routine.color} text-white`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{routine.day}</span>
                      {isToday && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          Hoje
                        </span>
                      )}
                    </div>
                    <div className="text-sm opacity-90">{routine.focus}</div>
                  </div>
                  <div className="text-right text-sm opacity-80">
                    {routine.duration}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-slate-50 dark:bg-dark-border/50 space-y-4">
                    {/* Exercicios */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-slate-500" />
                        Exercicios
                      </div>
                      <ul className="space-y-1">
                        {routine.workout.map((exercise, i) => (
                          <li key={i} className="text-sm text-slate-600 dark:text-dark-muted flex items-start gap-2">
                            <span className="text-primary-500">•</span>
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Projeto 2k Day */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
                      <Footprints className="w-5 h-5 text-primary-500" />
                      <div>
                        <div className="text-sm font-medium">Projeto 2k Day</div>
                        <div className="text-xs text-slate-500 dark:text-dark-muted">
                          {routine.cardio}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Plano Alimentar */}
      <Card>
        <button
          onClick={() => setShowMealPlan(!showMealPlan)}
          className="w-full flex items-center gap-2"
        >
          <Utensils className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold flex-1 text-left">Plano Alimentar</h3>
          {showMealPlan ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showMealPlan && (
          <div className="mt-4 space-y-4">
            {/* Hidratacao */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Droplets className="w-6 h-6 text-blue-500" />
              <div>
                <div className="font-medium text-blue-700 dark:text-blue-300">Meta de Hidratacao</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  3,5 a 4 Litros de agua por dia - 500ml ao acordar
                </div>
              </div>
            </div>

            {/* Refeicoes */}
            {Object.entries(MEAL_PLAN).map(([key, meal]) => (
              <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{meal.icon}</span>
                  <span className="font-medium">{meal.title}</span>
                </div>
                <ul className="space-y-1 mb-2">
                  {meal.options.map((option, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-dark-muted flex items-start gap-2">
                      <span className="text-emerald-500">•</span>
                      {option}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-primary-500 italic">
                  Dica: {meal.tip}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Suplementacao */}
      <Card>
        <button
          onClick={() => setShowSupplements(!showSupplements)}
          className="w-full flex items-center gap-2"
        >
          <Pill className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold flex-1 text-left">Suplementacao</h3>
          {showSupplements ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showSupplements && (
          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                Creatina (3g a 5g/dia)
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Indispensavel. Tomar todos os dias (mesmo sem treino).
                Puxa agua para o musculo deixando-o cheio e duro.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                Whey Protein
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Pela praticidade. Ideal para o lanche da tarde quando
                nao da para comer ovo ou frango.
              </p>
            </div>

            {/* O que evitar */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="font-medium text-red-700 dark:text-red-300 mb-2">
                Evitar ao Maximo
              </div>
              <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                <li>• Bebidas acucaradas (refrigerante, suco de caixinha)</li>
                <li>• Alcool (para a queima de gordura)</li>
                <li>• Frituras em excesso</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
