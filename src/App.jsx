import { Routes, Route } from 'react-router-dom'
import { Header, Sidebar, BottomNav, MobileHeader, InstallPrompt } from './components/common'
import { Home } from './pages/Home'
import { Goals } from './pages/Goals'
import { Evolution } from './pages/Evolution'
import { Diary } from './pages/Diary'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { DietaTreino } from './pages/DietaTreino'
import { Financeiro } from './pages/Financeiro'
import { Almatico } from './pages/Almatico'
import { Login } from './pages/Login'
import { useAppStore } from './store/useAppStore'
import { useAuth } from './hooks/useAuth'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

// Componente de Loading
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Carregando...</p>
      </div>
    </div>
  )
}

// Layout principal da aplicacao
function AppLayout() {
  const { sidebarOpen } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {isMobile ? (
        // Layout Mobile
        <div className="flex flex-col min-h-screen pb-20">
          <MobileHeader />
          <main className="flex-1 p-4 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/metas" element={<Goals />} />
              <Route path="/evolucao" element={<Evolution />} />
              <Route path="/diario" element={<Diary />} />
              <Route path="/dieta-treino" element={<DietaTreino />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/almatico" element={<Almatico />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Routes>
          </main>
          <BottomNav />
          <InstallPrompt />
        </div>
      ) : (
        // Layout Desktop
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/metas" element={<Goals />} />
                <Route path="/evolucao" element={<Evolution />} />
                <Route path="/diario" element={<Diary />} />
                <Route path="/dieta-treino" element={<DietaTreino />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/almatico" element={<Almatico />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const { user, loading, initialized, initialize } = useAuth()

  // Inicializar autenticacao ao carregar
  useEffect(() => {
    initialize()
  }, [initialize])

  // Mostrar loading enquanto verifica autenticacao
  if (!initialized || loading) {
    return <LoadingScreen />
  }

  // Se nao estiver autenticado, mostrar login
  if (!user) {
    return <Login />
  }

  // Usuario autenticado - mostrar aplicacao
  return <AppLayout />
}

export default App
