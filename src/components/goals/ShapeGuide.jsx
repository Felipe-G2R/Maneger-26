import { useState } from 'react'
import {
  X,
  Dumbbell,
  Utensils,
  Droplets,
  Calendar,
  Target,
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  Flame,
  Apple,
  Moon,
  Sun,
  Coffee,
  Pill,
  Ban,
  Camera,
  CheckCircle2
} from 'lucide-react'
import { Modal } from '../common'
import { shapeGuide, getTreinoDoDia, getRefeicaoAtual } from '../../data/shapeGuide'

const tabs = [
  { id: 'hoje', label: 'Hoje', icon: Calendar },
  { id: 'treino', label: 'Treinos', icon: Dumbbell },
  { id: 'dieta', label: 'Dieta', icon: Utensils },
  { id: 'dicas', label: 'Dicas', icon: Target }
]

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-card hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-orange-500" />}
          <span className="font-semibold">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-dark-bg">
          {children}
        </div>
      )}
    </div>
  )
}

function TreinoCard({ treino, isToday = false }) {
  return (
    <div className={`p-4 rounded-xl border ${isToday ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-dark-border'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg">{treino.dia}</h4>
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{treino.titulo}</p>
        </div>
        {isToday && (
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
            HOJE
          </span>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm text-slate-500 dark:text-dark-muted">
          <Target className="w-4 h-4 inline mr-1" />
          Foco: {treino.foco}
        </p>
        <p className="text-sm text-slate-500 dark:text-dark-muted">
          <Clock className="w-4 h-4 inline mr-1" />
          Duracao: {treino.duracao}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium mb-2">Exercicios:</p>
        <ul className="space-y-1">
          {treino.exercicios.map((ex, idx) => (
            <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              {ex}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
        <Flame className="w-4 h-4 inline text-blue-500 mr-1" />
        <span className="text-blue-700 dark:text-blue-300">{treino.cardio}</span>
      </div>
    </div>
  )
}

function RefeicaoCard({ refeicao, isAtual = false }) {
  const icons = {
    'Cafe da Manha': Coffee,
    'Almoco': Sun,
    'Lanche da Tarde': Apple,
    'Jantar': Moon,
    'Ceia': Moon
  }
  const Icon = icons[refeicao.nome] || Utensils

  return (
    <div className={`p-4 rounded-xl border ${isAtual ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-dark-border'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-green-600" />
        <h4 className="font-bold">{refeicao.nome}</h4>
        {isAtual && (
          <span className="ml-auto px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
            AGORA
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-dark-muted mb-3">{refeicao.objetivo}</p>

      {refeicao.opcoes && (
        <div className="space-y-2">
          {refeicao.opcoes.map((opcao, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-100 dark:bg-dark-card text-sm">
              <span className="text-orange-500 font-medium">Opcao {idx + 1}:</span> {opcao}
            </div>
          ))}
        </div>
      )}

      {refeicao.componentes && (
        <div className="space-y-2">
          {refeicao.componentes.map((comp, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-100 dark:bg-dark-card text-sm">
              <span className="text-orange-500 font-medium">{comp.tipo}:</span> {comp.qtd}
            </div>
          ))}
        </div>
      )}

      {refeicao.bebida && (
        <div className="mt-2 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-sm">
          <Coffee className="w-4 h-4 inline text-amber-600 mr-1" />
          {refeicao.bebida}
        </div>
      )}

      {refeicao.timing && (
        <div className="mt-2 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-sm">
          <Clock className="w-4 h-4 inline text-blue-600 mr-1" />
          {refeicao.timing}
        </div>
      )}
    </div>
  )
}

export function ShapeGuide({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('hoje')
  const treinoDoDia = getTreinoDoDia()
  const refeicaoAtual = getRefeicaoAtual()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="min-h-[70vh] max-h-[85vh] overflow-hidden flex flex-col -m-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{shapeGuide.intro.title}</h2>
              <p className="text-orange-100 text-sm">{shapeGuide.intro.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-slate-500 dark:text-dark-muted hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-dark-bg">
          {/* Tab: Hoje */}
          {activeTab === 'hoje' && (
            <div className="space-y-6">
              {/* Treino do dia */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                  Treino de Hoje
                </h3>
                {treinoDoDia && <TreinoCard treino={treinoDoDia} isToday />}
              </div>

              {/* Refeicao atual */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-green-500" />
                  Alimentacao
                </h3>
                {refeicaoAtual && (
                  <RefeicaoCard
                    refeicao={shapeGuide.dieta.semana.refeicoes.find(r => r.nome === refeicaoAtual)}
                    isAtual
                  />
                )}
              </div>

              {/* Hidratacao */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-blue-700 dark:text-blue-300">Hidratacao</h4>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">{shapeGuide.dieta.hidratacao.meta}</p>
                <p className="text-xs text-blue-500 mt-1">{shapeGuide.dieta.hidratacao.dica}</p>
              </div>

              {/* Regras 2k Day */}
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-3">
                  {shapeGuide.projeto2kDay.title}
                </h4>
                <div className="space-y-2">
                  {shapeGuide.projeto2kDay.rules.map((rule, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-orange-600">{rule.rule}</span>
                      <p className="text-slate-600 dark:text-slate-400">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Treinos */}
          {activeTab === 'treino' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 mb-4">
                <h4 className="font-bold mb-2">Divisao: ABC + Upper/Lower</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Treina cada musculo 2x por semana (otimo para naturais)
                </p>
              </div>

              {shapeGuide.rotinaSemanal.map((treino, idx) => (
                <TreinoCard
                  key={idx}
                  treino={treino}
                  isToday={treino.dia === getTreinoDoDia()?.dia}
                />
              ))}
            </div>
          )}

          {/* Tab: Dieta */}
          {activeTab === 'dieta' && (
            <div className="space-y-4">
              {/* Hidratacao */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold">Hidratacao</h4>
                </div>
                <p className="text-sm">{shapeGuide.dieta.hidratacao.meta}</p>
                <p className="text-xs text-slate-500 mt-1">{shapeGuide.dieta.hidratacao.dica}</p>
              </div>

              {/* Refeicoes da semana */}
              <AccordionItem title="Refeicoes (Seg a Sex)" icon={Calendar} defaultOpen>
                <div className="space-y-4">
                  {shapeGuide.dieta.semana.refeicoes.map((ref, idx) => (
                    <RefeicaoCard
                      key={idx}
                      refeicao={ref}
                      isAtual={ref.nome === refeicaoAtual}
                    />
                  ))}
                </div>
              </AccordionItem>

              {/* Fim de semana */}
              <AccordionItem title="Fim de Semana" icon={Sun}>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border">
                    <h4 className="font-bold mb-2">Sabado</h4>
                    <p className="text-sm mb-2">{shapeGuide.dieta.fimDeSemana.sabado.almoco}</p>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-sm">
                      <span className="font-medium text-yellow-700">Refeicao Livre:</span>
                      <span className="text-slate-600 dark:text-slate-400 ml-1">
                        {shapeGuide.dieta.fimDeSemana.sabado.refeicaoLivre}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border">
                    <h4 className="font-bold mb-2">Domingo</h4>
                    <p className="text-sm mb-2">{shapeGuide.dieta.fimDeSemana.domingo.dica}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {shapeGuide.dieta.fimDeSemana.domingo.foco}
                    </p>
                  </div>
                </div>
              </AccordionItem>

              {/* Suplementacao */}
              <AccordionItem title="Suplementacao" icon={Pill}>
                <div className="space-y-3">
                  {shapeGuide.suplementacao.map((sup, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <h5 className="font-bold text-purple-700 dark:text-purple-300">{sup.nome}</h5>
                      <p className="text-sm"><span className="font-medium">Dose:</span> {sup.dose}</p>
                      <p className="text-sm"><span className="font-medium">Frequencia:</span> {sup.frequencia}</p>
                      <p className="text-xs text-slate-500 mt-1">{sup.beneficio}</p>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              {/* O que evitar */}
              <AccordionItem title="O que Evitar" icon={Ban}>
                <div className="space-y-2">
                  {shapeGuide.evitar.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-300">{item.item}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.razao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </div>
          )}

          {/* Tab: Dicas */}
          {activeTab === 'dicas' && (
            <div className="space-y-4">
              {/* Timeline */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Expectativa de Resultados
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">3-4 meses:</span> {shapeGuide.intro.timeline.short}</p>
                  <p><span className="font-medium">6-12 meses:</span> {shapeGuide.intro.timeline.long}</p>
                </div>
              </div>

              {/* Principios da Dieta */}
              <AccordionItem title="Principios da Dieta" icon={Utensils} defaultOpen>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium">Deficit Calorico</p>
                    <p className="text-slate-600 dark:text-slate-400">{shapeGuide.principiosDieta.deficitCalorico}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium">Proteina</p>
                    <p className="text-slate-600 dark:text-slate-400">Meta: {shapeGuide.principiosDieta.proteina.meta}</p>
                    <p className="text-xs text-slate-500">Fontes: {shapeGuide.principiosDieta.proteina.fontes}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium">Carboidratos</p>
                    <p className="text-slate-600 dark:text-slate-400">{shapeGuide.principiosDieta.carboidratos}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium">Agua</p>
                    <p className="text-slate-600 dark:text-slate-400">{shapeGuide.principiosDieta.agua}</p>
                  </div>
                </div>
              </AccordionItem>

              {/* Principios do Treino */}
              <AccordionItem title="Principios do Treino" icon={Dumbbell}>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <p className="font-bold text-orange-700 dark:text-orange-300">{shapeGuide.principiosTreino.foco}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium mb-2">Exercicios Compostos (aumentam testosterona natural):</p>
                    <ul className="space-y-1">
                      {shapeGuide.principiosTreino.exerciciosCompostos.map((ex, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card">
                    <p className="font-medium">Hipertrofia</p>
                    <p className="text-slate-600 dark:text-slate-400">{shapeGuide.principiosTreino.hipertrofia}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <p className="font-medium text-yellow-700 dark:text-yellow-300">Abdomen</p>
                    <p className="text-slate-600 dark:text-slate-400">{shapeGuide.principiosTreino.abdomen.dica}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Exercicios: {shapeGuide.principiosTreino.abdomen.exercicios.join(', ')}
                    </p>
                  </div>
                </div>
              </AccordionItem>

              {/* Monitoramento */}
              <AccordionItem title="Como Monitorar Progresso" icon={Camera}>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card flex items-start gap-3">
                    <Camera className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fotos</p>
                      <p className="text-slate-600 dark:text-slate-400">{shapeGuide.monitoramento.fotos}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-dark-card flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Cargas</p>
                      <p className="text-slate-600 dark:text-slate-400">{shapeGuide.monitoramento.cargas}</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
