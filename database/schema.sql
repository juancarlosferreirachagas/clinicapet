CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raca VARCHAR(50),
  nome_tutor VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  foto_url TEXT,
  data_nascimento DATE,
  sexo VARCHAR(10),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS veterinarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  crmv VARCHAR(20) UNIQUE NOT NULL,
  especialidade VARCHAR(100),
  email VARCHAR(100),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultas (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pets(id) ON DELETE RESTRICT,
  veterinario_id INTEGER REFERENCES veterinarios(id) ON DELETE SET NULL,
  data_consulta DATE NOT NULL,
  hora VARCHAR(5) NOT NULL,
  motivo VARCHAR(255),
  status VARCHAR(20) DEFAULT 'agendada',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_servico (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS consulta_itens (
  id SERIAL PRIMARY KEY,
  consulta_id INTEGER REFERENCES consultas(id) ON DELETE CASCADE,
  tipo_servico_id INTEGER REFERENCES tipos_servico(id) ON DELETE SET NULL,
  observacoes TEXT,
  resultado TEXT,
  valor DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id SERIAL PRIMARY KEY,
  consulta_id INTEGER REFERENCES consultas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pendente',
  pago_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
