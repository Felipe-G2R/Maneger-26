import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

// Registrar Service Worker
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versao disponivel! Atualizar agora?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline!')
  },
  onRegistered(r) {
    console.log('Service Worker registrado:', r)
  },
  onRegisterError(error) {
    console.error('Erro ao registrar Service Worker:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
