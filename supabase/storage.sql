-- =====================================================
-- MANEGER 26 - CONFIGURACAO DE STORAGE (SUPABASE)
-- Sistema de armazenamento de imagens e arquivos
-- =====================================================

-- IMPORTANTE: Execute este arquivo DEPOIS do schema.sql
-- O Storage do Supabase usa a tabela storage.buckets e storage.objects

-- =====================================================
-- 1. CRIACAO DOS BUCKETS
-- =====================================================

-- Bucket para fotos do Mural de Evolucao (fisico, progresso)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evolution-photos',
    'evolution-photos',
    false,
    5242880, -- 5MB limite por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Bucket para fotos de refeicoes (Dieta/Treino)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'meal-photos',
    'meal-photos',
    false,
    5242880, -- 5MB limite por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Bucket para avatares dos usuarios (publico)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true, -- Publico para facilitar exibicao
    2097152, -- 2MB limite por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Bucket para audios do Diario e Almatico
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'audio-recordings',
    'audio-recordings',
    false,
    10485760, -- 10MB limite por arquivo
    ARRAY['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];

-- Bucket para anexos gerais (documentos, PDFs, etc)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'attachments',
    'attachments',
    false,
    10485760, -- 10MB limite por arquivo
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'];

-- Bucket para fotos de metas (comprovantes, conquistas)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'goal-photos',
    'goal-photos',
    false,
    5242880, -- 5MB limite por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- 2. REMOVER POLICIES EXISTENTES (LIMPEZA)
-- =====================================================

-- Evolution Photos
DROP POLICY IF EXISTS "Users can upload evolution photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own evolution photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own evolution photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own evolution photos" ON storage.objects;

-- Meal Photos
DROP POLICY IF EXISTS "Users can upload meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own meal photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own meal photos" ON storage.objects;

-- Avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Audio Recordings
DROP POLICY IF EXISTS "Users can upload audio recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own audio recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own audio recordings" ON storage.objects;

-- Attachments
DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;

-- Goal Photos
DROP POLICY IF EXISTS "Users can upload goal photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own goal photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own goal photos" ON storage.objects;

-- =====================================================
-- 3. POLICIES PARA EVOLUTION-PHOTOS
-- =====================================================

-- Upload: usuario so pode fazer upload na sua propria pasta
CREATE POLICY "Users can upload evolution photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'evolution-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Visualizar: usuario so ve suas proprias fotos
CREATE POLICY "Users can view own evolution photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'evolution-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Atualizar: usuario so atualiza suas proprias fotos
CREATE POLICY "Users can update own evolution photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'evolution-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Deletar: usuario so deleta suas proprias fotos
CREATE POLICY "Users can delete own evolution photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'evolution-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 4. POLICIES PARA MEAL-PHOTOS
-- =====================================================

CREATE POLICY "Users can upload meal photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own meal photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own meal photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own meal photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'meal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 5. POLICIES PARA AVATARS (PUBLICO)
-- =====================================================

-- Qualquer pessoa pode ver avatares (publico)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Usuarios autenticados podem fazer upload do proprio avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuarios podem atualizar seu proprio avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Usuarios podem deletar seu proprio avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 6. POLICIES PARA AUDIO-RECORDINGS
-- =====================================================

CREATE POLICY "Users can upload audio recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'audio-recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own audio recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'audio-recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own audio recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'audio-recordings' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 7. POLICIES PARA ATTACHMENTS
-- =====================================================

CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 8. POLICIES PARA GOAL-PHOTOS
-- =====================================================

CREATE POLICY "Users can upload goal photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'goal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own goal photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'goal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own goal photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'goal-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 9. FUNCOES AUXILIARES PARA STORAGE
-- =====================================================

-- Funcao para gerar path de upload padronizado
CREATE OR REPLACE FUNCTION generate_storage_path(
    p_bucket TEXT,
    p_user_id UUID,
    p_filename TEXT,
    p_subfolder TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    v_path TEXT;
    v_timestamp TEXT;
    v_extension TEXT;
BEGIN
    -- Gerar timestamp para unicidade
    v_timestamp := to_char(NOW(), 'YYYYMMDD_HH24MISS');

    -- Extrair extensao do arquivo
    v_extension := COALESCE(
        NULLIF(substring(p_filename from '\.([^.]+)$'), ''),
        'jpg'
    );

    -- Montar path
    IF p_subfolder IS NOT NULL THEN
        v_path := p_user_id::text || '/' || p_subfolder || '/' || v_timestamp || '.' || v_extension;
    ELSE
        v_path := p_user_id::text || '/' || v_timestamp || '.' || v_extension;
    END IF;

    RETURN v_path;
END;
$$ LANGUAGE plpgsql;

-- Funcao para obter URL publica de um arquivo
CREATE OR REPLACE FUNCTION get_public_url(
    p_bucket TEXT,
    p_path TEXT
)
RETURNS TEXT AS $$
BEGIN
    -- Retorna o path para ser usado com supabase.storage.from().getPublicUrl()
    RETURN p_bucket || '/' || p_path;
END;
$$ LANGUAGE plpgsql;

-- Funcao para limpar arquivos orfaos (sem referencia no banco)
-- CUIDADO: Execute com cautela
CREATE OR REPLACE FUNCTION cleanup_orphan_files(p_bucket TEXT, p_dry_run BOOLEAN DEFAULT TRUE)
RETURNS TABLE (
    file_path TEXT,
    action TEXT
) AS $$
DECLARE
    v_file RECORD;
BEGIN
    -- Esta funcao lista arquivos que podem ser orfaos
    -- Implementacao real dependeria da estrutura especifica do app

    RETURN QUERY
    SELECT
        o.name as file_path,
        CASE WHEN p_dry_run THEN 'WOULD DELETE' ELSE 'DELETED' END as action
    FROM storage.objects o
    WHERE o.bucket_id = p_bucket
    AND o.created_at < NOW() - INTERVAL '30 days'
    -- Adicione condicoes especificas para identificar orfaos
    LIMIT 100;

    -- Se nao for dry run, deletar os arquivos
    -- IF NOT p_dry_run THEN
    --     DELETE FROM storage.objects WHERE ...
    -- END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. TABELA DE METADADOS DE ARQUIVOS (OPCIONAL)
-- =====================================================

-- Tabela para rastrear arquivos com metadados adicionais
CREATE TABLE IF NOT EXISTS file_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    bucket TEXT NOT NULL,
    path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    size_bytes BIGINT,
    width INTEGER, -- Para imagens
    height INTEGER, -- Para imagens
    duration_seconds INTEGER, -- Para audios
    entity_type TEXT, -- 'evolution', 'meal', 'goal', 'diary', 'almatico'
    entity_id UUID, -- ID da entidade relacionada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bucket, path)
);

CREATE INDEX idx_file_metadata_user_id ON file_metadata(user_id);
CREATE INDEX idx_file_metadata_entity ON file_metadata(entity_type, entity_id);

-- RLS para file_metadata
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own file_metadata"
ON file_metadata FOR ALL
USING (auth.uid() = user_id);

-- =====================================================
-- 11. TRIGGER PARA LIMPAR METADADOS QUANDO ARQUIVO E DELETADO
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_file_metadata()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM file_metadata
    WHERE bucket = OLD.bucket_id AND path = OLD.name;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger na tabela storage.objects
DROP TRIGGER IF EXISTS trigger_cleanup_file_metadata ON storage.objects;
CREATE TRIGGER trigger_cleanup_file_metadata
    AFTER DELETE ON storage.objects
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_file_metadata();

-- =====================================================
-- INSTRUCOES DE USO NO FRONTEND
-- =====================================================

/*
EXEMPLO DE USO NO REACT/JAVASCRIPT:

1. UPLOAD DE IMAGEM:
-------------------
import { supabase } from './lib/supabase'

async function uploadEvolutionPhoto(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('evolution-photos')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw error

    // Obter URL para exibir
    const { data: { publicUrl } } = supabase.storage
        .from('evolution-photos')
        .getPublicUrl(fileName)

    return publicUrl
}

2. LISTAR ARQUIVOS:
------------------
async function listUserPhotos(userId) {
    const { data, error } = await supabase.storage
        .from('evolution-photos')
        .list(userId, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
        })

    return data
}

3. DELETAR ARQUIVO:
------------------
async function deletePhoto(path) {
    const { error } = await supabase.storage
        .from('evolution-photos')
        .remove([path])

    if (error) throw error
}

4. DOWNLOAD DE ARQUIVO:
----------------------
async function downloadPhoto(path) {
    const { data, error } = await supabase.storage
        .from('evolution-photos')
        .download(path)

    return data // Blob
}

5. OBTER URL ASSINADA (TEMPORARIA):
----------------------------------
async function getSignedUrl(path) {
    const { data, error } = await supabase.storage
        .from('evolution-photos')
        .createSignedUrl(path, 3600) // 1 hora

    return data.signedUrl
}
*/

-- =====================================================
-- MENSAGEM DE CONCLUSAO
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'MANEGER 26 - Storage configurado com sucesso!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Buckets criados:';
    RAISE NOTICE '  - evolution-photos (5MB, imagens)';
    RAISE NOTICE '  - meal-photos (5MB, imagens)';
    RAISE NOTICE '  - avatars (2MB, publico)';
    RAISE NOTICE '  - audio-recordings (10MB, audio)';
    RAISE NOTICE '  - attachments (10MB, docs)';
    RAISE NOTICE '  - goal-photos (5MB, imagens)';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Estrutura de pastas recomendada:';
    RAISE NOTICE '  {bucket}/{user_id}/{timestamp}.{ext}';
    RAISE NOTICE '  Ex: evolution-photos/abc123/20240115_143022.jpg';
    RAISE NOTICE '=====================================================';
END $$;
