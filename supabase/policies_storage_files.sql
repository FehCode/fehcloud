-- Supabase Storage: Permissões para bucket 'user-files'
-- Permitir upload, download e delete apenas para usuários autenticados

-- Policy: Permitir upload/download/delete apenas para o próprio usuário
-- Vá em Storage > user-files > Policies > New Policy e use:
--
-- Name: Only authenticated users can access their files
-- Definition:
-- (auth.role() = 'authenticated')

-- Policy para tabela 'files':
-- Permitir INSERT, SELECT, UPDATE, DELETE apenas para o próprio usuário

-- Exemplo para tabela 'files':
-- Vá em Table Editor > files > RLS > Enable RLS
-- Adicione as policies abaixo:

-- 1. SELECT: Somente o dono pode ver
CREATE POLICY "Users can view their own files"
  ON public.files
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. INSERT: Somente o dono pode inserir
CREATE POLICY "Users can insert their own files"
  ON public.files
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE: Somente o dono pode atualizar
CREATE POLICY "Users can update their own files"
  ON public.files
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. DELETE: Somente o dono pode deletar
CREATE POLICY "Users can delete their own files"
  ON public.files
  FOR DELETE
  USING (auth.uid() = user_id);

-- Certifique-se de que o bucket 'user-files' existe em Storage.
-- Se não existir, crie pelo painel do Supabase.

-- Após aplicar, teste o upload e veja se os arquivos aparecem no Storage e na tabela 'files'.
