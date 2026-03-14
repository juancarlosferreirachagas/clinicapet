-- Adiciona data_nascimento e sexo à tabela pets
-- Execute no Supabase SQL Editor ou via npm run migrate
ALTER TABLE pets ADD COLUMN IF NOT EXISTS data_nascimento DATE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS sexo VARCHAR(10);
