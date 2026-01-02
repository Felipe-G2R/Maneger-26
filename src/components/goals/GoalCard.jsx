import { useState } from 'react'
import {
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Target,
  Dumbbell,
  Brain,
  Heart,
  DollarSign,
  Users,
  BookOpen
} from 'lucide-react'
import { Card, ProgressBar, Modal } from '../common'
import { ShapeGuide } from './ShapeGuide'
import { useGoalStore } from '../../store/useGoalStore'
import {
  calculateProgress,
  getCategoryColor,
  getCategoryName,
  formatNumber,
  formatCurrency
} from '../../lib/utils'

const categoryIcons = {
  fisico: Dumbbell,
  intelectual: Brain,
  almatico: Heart,
  financeiro: DollarSign,
  social: Users
}

export function GoalCard({ goal, onEdit }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showShapeGuide, setShowShapeGuide] = useState(false)
  const [progressValue, setProgressValue] = useState('')
  const [progressNotes, setProgressNotes] = useState('')

  const { deleteGoal, logProgress } = useGoalStore()
  const isFisico = goal.category === 'fisico'

  const progress = calculateProgress(goal.current_value, goal.target_value)
  const color = getCategoryColor(goal.category)
  const Icon = categoryIcons[goal.category] || Target

  const formatValue = (value) => {
    if (goal.unit === 'R$') return formatCurrency(value)
    return `${formatNumber(value)} ${goal.unit}`
  }

  const handleLogProgress = () => {
    const value = parseFloat(progressValue)
    if (!isNaN(value) && value > 0) {
      logProgress(goal.id, value, progressNotes)
      setProgressValue('')
      setProgressNotes('')
      setShowProgressModal(false)
    }
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteGoal(goal.id)
    }
    setShowMenu(false)
  }

  return (
    <>
      <Card hover className="relative group">
        {/* Category Badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: color }}
        >
          {getCategoryName(goal.category)}
        </div>

        {/* Menu Button */}
        <div className="absolute top-4 right-28">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 py-2 rounded-xl bg-white dark:bg-dark-card shadow-xl border border-slate-200 dark:border-dark-border z-10">
              <button
                onClick={() => {
                  onEdit?.(goal)
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-dark-border"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4 pr-24">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
            <p className="text-sm text-slate-500 dark:text-dark-muted line-clamp-2">
              {goal.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-slate-500 dark:text-dark-muted">Progresso</span>
            <span className="font-medium" style={{ color }}>
              {formatValue(goal.current_value)} / {formatValue(goal.target_value)}
            </span>
          </div>
          <ProgressBar
            value={goal.current_value}
            max={goal.target_value}
            color={color}
            showLabel={false}
          />
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="text-3xl font-bold"
              style={{ color: progress >= 100 ? '#10B981' : color }}
            >
              {progress.toFixed(0)}%
            </div>
            {progress >= 100 && (
              <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                Concluida!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFisico && (
              <button
                onClick={() => setShowShapeGuide(true)}
                className="btn btn-secondary py-2 px-4 text-sm"
                title="Ver guia de treino e alimentacao"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Guia</span>
              </button>
            )}
            <button
              onClick={() => setShowProgressModal(true)}
              className="btn btn-primary py-2 px-4 text-sm"
              disabled={progress >= 100}
            >
              <Plus className="w-4 h-4" />
              Progresso
            </button>
          </div>
        </div>
      </Card>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title="Registrar Progresso"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Meta</label>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-border">
              <span className="font-medium">{goal.title}</span>
              <span className="text-sm text-slate-500 dark:text-dark-muted ml-2">
                ({formatValue(goal.current_value)} / {formatValue(goal.target_value)})
              </span>
            </div>
          </div>

          <div>
            <label className="label">Valor a adicionar ({goal.unit})</label>
            <input
              type="number"
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              className="input"
              placeholder={`Ex: 1 ${goal.unit}`}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="label">Notas (opcional)</label>
            <textarea
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Descreva o que voce fez..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowProgressModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogProgress}
              className="btn btn-primary flex-1"
              disabled={!progressValue}
            >
              Registrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Shape Guide Modal */}
      {isFisico && (
        <ShapeGuide
          isOpen={showShapeGuide}
          onClose={() => setShowShapeGuide(false)}
        />
      )}
    </>
  )
}
