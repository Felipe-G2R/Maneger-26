import { useState, useEffect, useMemo } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Plus,
  Minus,
  Trash2,
  Edit2,
  X,
  Check,
  Calendar,
  CreditCard,
  Wallet,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Smartphone,
  Heart,
  GraduationCap,
  Plane,
  Gift,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  PieChart,
  Loader2
} from 'lucide-react'
import { Card } from '../components/common/Card'
import { useFinanceiroStore } from '../store/useFinanceiroStore'

// Categorias de despesas
const categoriasDespesas = [
  { id: 'moradia', nome: 'Moradia', icon: Home, color: '#3b82f6' },
  { id: 'alimentacao', nome: 'Alimentacao', icon: Utensils, color: '#22c55e' },
  { id: 'transporte', nome: 'Transporte', icon: Car, color: '#f97316' },
  { id: 'saude', nome: 'Saude', icon: Heart, color: '#ef4444' },
  { id: 'educacao', nome: 'Educacao', icon: GraduationCap, color: '#8b5cf6' },
  { id: 'lazer', nome: 'Lazer', icon: Plane, color: '#ec4899' },
  { id: 'compras', nome: 'Compras', icon: ShoppingCart, color: '#14b8a6' },
  { id: 'tecnologia', nome: 'Tecnologia', icon: Smartphone, color: '#6366f1' },
  { id: 'presentes', nome: 'Presentes', icon: Gift, color: '#f43f5e' },
  { id: 'outros_despesa', nome: 'Outros', icon: MoreHorizontal, color: '#64748b' }
]

// Categorias de receitas
const categoriasReceitas = [
  { id: 'salario', nome: 'Salario', icon: Wallet, color: '#22c55e' },
  { id: 'freelance', nome: 'Freelance', icon: CreditCard, color: '#3b82f6' },
  { id: 'investimentos', nome: 'Investimentos', icon: TrendingUp, color: '#8b5cf6' },
  { id: 'outros_receita', nome: 'Outros', icon: MoreHorizontal, color: '#64748b' }
]

// Helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

const getMonthYear = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const getCurrentMonthYear = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function Financeiro() {
  const {
    transacoes,
    metas,
    loading,
    fetchAll,
    addTransacao,
    deleteTransacao,
    addMeta,
    updateMeta,
    deleteMeta,
    addToMeta
  } = useFinanceiroStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showMetaModal, setShowMetaModal] = useState(false)
  const [modalType, setModalType] = useState('despesa')
  const [mesAtual, setMesAtual] = useState(getCurrentMonthYear())
  const [editingMeta, setEditingMeta] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    data: new Date().toISOString().split('T')[0]
  })

  const [metaForm, setMetaForm] = useState({
    nome: '',
    valorMeta: '',
    valorAtual: '',
    prazo: '',
    cor: '#3b82f6'
  })

  // Carregar dados ao montar
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Calculos
  const transacoesMes = useMemo(() => {
    return transacoes.filter(t => getMonthYear(t.date) === mesAtual)
  }, [transacoes, mesAtual])

  const receitasMes = useMemo(() => {
    return transacoesMes
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => acc + parseFloat(t.value || 0), 0)
  }, [transacoesMes])

  const despesasMes = useMemo(() => {
    return transacoesMes
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => acc + parseFloat(t.value || 0), 0)
  }, [transacoesMes])

  const saldoMes = receitasMes - despesasMes

  const saldoTotal = useMemo(() => {
    return transacoes.reduce((acc, t) =>
      t.type === 'receita' ? acc + parseFloat(t.value || 0) : acc - parseFloat(t.value || 0), 0)
  }, [transacoes])

  // Gastos por categoria
  const gastosPorCategoria = useMemo(() => {
    return categoriasDespesas.map(cat => {
      const total = transacoesMes
        .filter(t => t.type === 'despesa' && t.category_id === cat.id)
        .reduce((acc, t) => acc + parseFloat(t.value || 0), 0)
      return { ...cat, total }
    }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)
  }, [transacoesMes])

  // Handlers
  const openAddModal = (type) => {
    setModalType(type)
    setFormData({
      descricao: '',
      valor: '',
      categoria: type === 'despesa' ? 'outros_despesa' : 'salario',
      data: new Date().toISOString().split('T')[0]
    })
    setShowAddModal(true)
  }

  const handleAddTransacao = async () => {
    if (!formData.descricao || !formData.valor || !formData.categoria) return

    await addTransacao({
      tipo: modalType,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria,
      data: formData.data
    })

    setShowAddModal(false)
  }

  const handleDeleteTransacao = async (id) => {
    await deleteTransacao(id)
  }

  const handleAddMeta = async () => {
    if (!metaForm.nome || !metaForm.valorMeta) return

    if (editingMeta) {
      await updateMeta(editingMeta.id, {
        nome: metaForm.nome,
        valorMeta: parseFloat(metaForm.valorMeta),
        valorAtual: parseFloat(metaForm.valorAtual) || 0,
        prazo: metaForm.prazo,
        cor: metaForm.cor
      })
    } else {
      await addMeta({
        nome: metaForm.nome,
        valorMeta: parseFloat(metaForm.valorMeta),
        valorAtual: parseFloat(metaForm.valorAtual) || 0,
        prazo: metaForm.prazo,
        cor: metaForm.cor
      })
    }

    setShowMetaModal(false)
    setEditingMeta(null)
    setMetaForm({ nome: '', valorMeta: '', valorAtual: '', prazo: '', cor: '#3b82f6' })
  }

  const handleEditMeta = (meta) => {
    setEditingMeta(meta)
    setMetaForm({
      nome: meta.name,
      valorMeta: meta.target_value.toString(),
      valorAtual: (meta.current_value || 0).toString(),
      prazo: meta.deadline || '',
      cor: meta.color
    })
    setShowMetaModal(true)
  }

  const handleDeleteMeta = async (id) => {
    await deleteMeta(id)
  }

  const handleAddToMeta = async (metaId, valor) => {
    await addToMeta(metaId, valor)
  }

  // Navegar entre meses
  const navigateMonth = (direction) => {
    const [year, month] = mesAtual.split('-').map(Number)
    let newMonth = month + direction
    let newYear = year

    if (newMonth > 12) {
      newMonth = 1
      newYear++
    } else if (newMonth < 1) {
      newMonth = 12
      newYear--
    }

    setMesAtual(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const getMesNome = (mesAno) => {
    const [year, month] = mesAno.split('-')
    const meses = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${meses[parseInt(month) - 1]} ${year}`
  }

  const getCategoriaInfo = (categoriaId, tipo) => {
    const lista = tipo === 'despesa' ? categoriasDespesas : categoriasReceitas
    return lista.find(c => c.id === categoriaId) || lista[lista.length - 1]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="gradient-text">Financeiro</span>
          </h1>
          <p className="text-slate-600 dark:text-dark-muted">
            Gerencie suas financas e metas
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openAddModal('receita')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Receita</span>
          </button>
          <button
            onClick={() => openAddModal('despesa')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            <Minus className="w-4 h-4" />
            <span className="hidden sm:inline">Despesa</span>
          </button>
        </div>
      </div>

      {/* Navegacao de Mes */}
      <Card className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg transition-colors"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </button>
        <div className="text-center">
          <p className="font-bold text-lg">{getMesNome(mesAtual)}</p>
          <p className="text-xs text-slate-500 dark:text-dark-muted">
            {transacoesMes.length} transacoes
          </p>
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg transition-colors"
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-dark-muted">Saldo Total</p>
              <p className={`text-lg font-bold ${saldoTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(saldoTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-dark-muted">Receitas</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(receitasMes)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-dark-muted">Despesas</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(despesasMes)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-dark-muted">Balanco Mes</p>
              <p className={`text-lg font-bold ${saldoMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldoMes)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Metas Financeiras */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary-500" />
            Metas Financeiras
          </h2>
          <button
            onClick={() => {
              setEditingMeta(null)
              setMetaForm({ nome: '', valorMeta: '', valorAtual: '', prazo: '', cor: '#3b82f6' })
              setShowMetaModal(true)
            }}
            className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Meta
          </button>
        </div>

        {metas.length === 0 ? (
          <Card className="text-center py-8">
            <PiggyBank className="w-12 h-12 text-slate-300 dark:text-dark-muted mx-auto mb-3" />
            <p className="text-slate-500 dark:text-dark-muted">Nenhuma meta cadastrada</p>
            <p className="text-sm text-slate-400">Clique em "Nova Meta" para comecar</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {metas.map(meta => {
              const progresso = (meta.current_value / meta.target_value) * 100
              const concluida = progresso >= 100
              return (
                <Card key={meta.id} className="overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: meta.color + '20' }}
                      >
                        {concluida ? (
                          <CheckCircle2 className="w-5 h-5" style={{ color: meta.color }} />
                        ) : (
                          <Target className="w-5 h-5" style={{ color: meta.color }} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">{meta.name}</h4>
                        {meta.deadline && (
                          <p className="text-xs text-slate-500">Prazo: {formatDate(meta.deadline)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditMeta(meta)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteMeta(meta.id)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-dark-muted">
                        {formatCurrency(meta.current_value)}
                      </span>
                      <span className="font-bold" style={{ color: meta.color }}>
                        {formatCurrency(meta.target_value)}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(progresso, 100)}%`,
                          backgroundColor: meta.color
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1" style={{ color: meta.color }}>
                      {progresso.toFixed(1)}% concluido
                    </p>
                  </div>

                  {!concluida && (
                    <div className="flex gap-2">
                      {[50, 100, 200].map(valor => (
                        <button
                          key={valor}
                          onClick={() => handleAddToMeta(meta.id, valor)}
                          className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-border transition-colors"
                        >
                          +R${valor}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Gastos por Categoria */}
      {gastosPorCategoria.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-orange-500" />
            Gastos por Categoria
          </h2>
          <Card>
            <div className="space-y-3">
              {gastosPorCategoria.map(cat => {
                const percentual = despesasMes > 0 ? (cat.total / despesasMes) * 100 : 0
                const Icon = cat.icon
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: cat.color + '20' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: cat.color }} />
                        </div>
                        <span className="font-medium text-sm">{cat.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(cat.total)}</p>
                        <p className="text-xs text-slate-500">{percentual.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentual}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Lista de Transacoes */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Transacoes do Mes
        </h2>

        {transacoesMes.length === 0 ? (
          <Card className="text-center py-8">
            <CreditCard className="w-12 h-12 text-slate-300 dark:text-dark-muted mx-auto mb-3" />
            <p className="text-slate-500 dark:text-dark-muted">Nenhuma transacao neste mes</p>
            <p className="text-sm text-slate-400">Adicione receitas ou despesas para comecar</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {transacoesMes.map(transacao => {
              const catInfo = getCategoriaInfo(transacao.category_id, transacao.type)
              const Icon = catInfo.icon
              const isReceita = transacao.type === 'receita'

              return (
                <Card key={transacao.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: catInfo.color + '20' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: catInfo.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{transacao.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{catInfo.nome}</span>
                        <span>•</span>
                        <span>{formatDate(transacao.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-bold ${isReceita ? 'text-green-600' : 'text-red-600'}`}>
                      {isReceita ? '+' : '-'}{formatCurrency(transacao.value)}
                    </p>
                    <button
                      onClick={() => handleDeleteTransacao(transacao.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Adicionar Transacao */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                {modalType === 'receita' ? 'Nova Receita' : 'Nova Despesa'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descricao</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Salario, Aluguel, Mercado..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {(modalType === 'despesa' ? categoriasDespesas : categoriasReceitas).map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-dark-card text-slate-900 dark:text-white">{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                onClick={handleAddTransacao}
                className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
                  modalType === 'receita'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {modalType === 'receita' ? 'Adicionar Receita' : 'Adicionar Despesa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Meta */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                {editingMeta ? 'Editar Meta' : 'Nova Meta Financeira'}
              </h3>
              <button
                onClick={() => {
                  setShowMetaModal(false)
                  setEditingMeta(null)
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-dark-border rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Meta</label>
                <input
                  type="text"
                  value={metaForm.nome}
                  onChange={(e) => setMetaForm({ ...metaForm, nome: e.target.value })}
                  placeholder="Ex: Reserva de Emergencia, Viagem..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor da Meta (R$)</label>
                <input
                  type="number"
                  value={metaForm.valorMeta}
                  onChange={(e) => setMetaForm({ ...metaForm, valorMeta: e.target.value })}
                  placeholder="10000"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Atual (R$)</label>
                <input
                  type="number"
                  value={metaForm.valorAtual}
                  onChange={(e) => setMetaForm({ ...metaForm, valorAtual: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prazo (opcional)</label>
                <input
                  type="date"
                  value={metaForm.prazo}
                  onChange={(e) => setMetaForm({ ...metaForm, prazo: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cor</label>
                <div className="flex gap-2">
                  {['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6'].map(cor => (
                    <button
                      key={cor}
                      onClick={() => setMetaForm({ ...metaForm, cor })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        metaForm.cor === cor ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddMeta}
                className="w-full py-3 rounded-xl font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                {editingMeta ? 'Salvar Alteracoes' : 'Criar Meta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
