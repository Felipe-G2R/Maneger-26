import { useState, useEffect } from 'react'
import { Modal } from '../common'
import { useGoalStore } from '../../store/useGoalStore'

const categories = [
  { value: 'fisico', label: 'Fisico', color: '#EF4444' },
  { value: 'intelectual', label: 'Intelectual', color: '#3B82F6' },
  { value: 'almatico', label: 'Almatico', color: '#A855F7' },
  { value: 'financeiro', label: 'Financeiro', color: '#10B981' },
  { value: 'social', label: 'Social', color: '#F59E0B' }
]

const defaultUnits = ['%', 'kg', 'km', 'horas', 'pessoas', 'R$', 'unidades']

export function GoalForm({ isOpen, onClose, editGoal = null }) {
  const { addGoal, updateGoal } = useGoalStore()

  const [formData, setFormData] = useState({
    category: 'fisico',
    title: '',
    description: '',
    target_value: '',
    unit: '%',
    deadline: '2026-12-31'
  })

  useEffect(() => {
    if (editGoal) {
      setFormData({
        category: editGoal.category,
        title: editGoal.title,
        description: editGoal.description,
        target_value: editGoal.target_value.toString(),
        unit: editGoal.unit,
        deadline: editGoal.deadline
      })
    } else {
      setFormData({
        category: 'fisico',
        title: '',
        description: '',
        target_value: '',
        unit: '%',
        deadline: '2026-12-31'
      })
    }
  }, [editGoal, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    const goalData = {
      ...formData,
      target_value: parseFloat(formData.target_value)
    }

    if (editGoal) {
      updateGoal(editGoal.id, goalData)
    } else {
      addGoal(goalData)
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editGoal ? 'Editar Meta' : 'Nova Meta'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="label">Categoria</label>
          <div className="grid grid-cols-5 gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`p-3 rounded-xl text-center transition-all ${
                  formData.category === cat.value
                    ? 'ring-2 ring-offset-2 dark:ring-offset-dark-card'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: cat.color + '20',
                  color: cat.color,
                  ringColor: cat.color
                }}
              >
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label">Titulo da Meta</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="Ex: Emagrecer 10kg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Descricao</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input min-h-[80px] resize-none"
            placeholder="Descreva sua meta..."
          />
        </div>

        {/* Target Value and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Valor Alvo</label>
            <input
              type="number"
              value={formData.target_value}
              onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
              className="input"
              placeholder="100"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="label">Unidade</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="input"
            >
              {defaultUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="label">Prazo</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
          >
            {editGoal ? 'Salvar Alteracoes' : 'Criar Meta'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
