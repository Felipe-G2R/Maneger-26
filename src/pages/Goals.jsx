import { useState } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import { GoalCard, GoalForm } from '../components/goals'
import { useGoals } from '../hooks/useGoals'
import { getCategoryName, getCategoryColor } from '../lib/utils'

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'fisico', label: 'Fisico' },
  { value: 'intelectual', label: 'Intelectual' },
  { value: 'almatico', label: 'Almatico' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'social', label: 'Social' }
]

export function Goals() {
  const { goals } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredGoals = goals.filter(goal => {
    const matchesFilter = filter === 'all' || goal.category === filter
    const matchesSearch = goal.title.toLowerCase().includes(search.toLowerCase()) ||
      goal.description?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleEdit = (goal) => {
    setEditGoal(goal)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditGoal(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Minhas Metas</h1>
          <p className="text-slate-500 dark:text-dark-muted mt-1">
            Gerencie e acompanhe suas {goals.length} metas para 2026
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar metas..."
            className="input pl-12"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-dark-muted hover:bg-slate-200 dark:hover:bg-dark-border'
              }`}
              style={
                filter === cat.value && cat.value !== 'all'
                  ? { backgroundColor: getCategoryColor(cat.value) }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-dark-card flex items-center justify-center">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma meta encontrada</h3>
          <p className="text-slate-500 dark:text-dark-muted">
            {search
              ? 'Tente buscar por outro termo'
              : 'Crie sua primeira meta para comecar!'
            }
          </p>
        </div>
      )}

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editGoal={editGoal}
      />
    </div>
  )
}
