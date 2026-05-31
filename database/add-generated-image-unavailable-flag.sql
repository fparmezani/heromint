ALTER TABLE generated_images
  ADD COLUMN IF NOT EXISTS indisponivel BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN generated_images.indisponivel IS
  'Indica imagens quebradas que não devem ser exibidas';
