# Maneger 26 - Setup Completo

Seu projeto foi totalmente conectado ao Supabase **Maneger 26**.

## Status da Conexão
- **Projeto**: Maneger 26 (qgcqjeffpjgtydukmoyq)
- **Banco de Dados**: Configurado e com as tabelas necessárias (`goals`, `diary_entries`, `progress_logs`, etc.)
- **Storage**: Buckets de armazenamento de mídia configurados e prontos para uso.
- **Autenticação**: Pronta para uso (Login/Cadastro).

## Como Rodar
Para garantir que as novas configurações sejam carregadas corretamente, siga os passos abaixo:

1. **Reinicie o servidor de desenvolvimento** (se estiver rodando):
   Pare o processo atual (Ctrl+C) e execute novamente:
   ```bash
   npm run dev
   ```

2. **Acesse a aplicação**:
   Abra o link fornecido no terminal (geralmente `http://localhost:5173`).

3. **Teste**:
   - Tente criar uma conta ou fazer login.
   - Adicione uma meta ou entrada no diário.
   - Verifique se os dados persistem ao recarregar a página.

A conexão é **100% funcional** e todos os dados serão salvos automaticamente no seu banco de dados Supabase na nuvem.

> **Nota**: As credenciais foram configuradas em `.env.development`. Este arquivo é carregado automaticamente pelo Vite em modo de desenvolvimento.
