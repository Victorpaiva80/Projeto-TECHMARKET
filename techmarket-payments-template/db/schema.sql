CREATE TABLE IF NOT EXISTS contas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    saldo NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY,
    origem INT,
    destino INT,
    valor NUMERIC(10,2),
    data TIMESTAMP DEFAULT NOW()
);
