import { Router } from "express";
import { db } from "./db.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post("/", async (req, res) => {
  const { origem, destino, valor } = req.body;

  if (!origem || !destino || !valor)
    return res.status(400).json({ erro: "Dados incompletos" });

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const saldoOrigem = await client.query(
      "SELECT saldo FROM contas WHERE id = $1",
      [origem]
    );

    if (saldoOrigem.rows.length === 0)
      return res.status(404).json({ erro: "Conta origem não encontrada" });

    if (saldoOrigem.rows[0].saldo < valor)
      return res.status(400).json({ erro: "Saldo insuficiente" });

    await client.query(
      "UPDATE contas SET saldo = saldo - $1 WHERE id = $2",
      [valor, origem]
    );

    await client.query(
      "UPDATE contas SET saldo = saldo + $1 WHERE id = $2",
      [valor, destino]
    );

    const codigo = uuidv4();

    await client.query(
      "INSERT INTO transacoes (id, origem, destino, valor) VALUES ($1, $2, $3, $4)",
      [codigo, origem, destino, valor]
    );

    await client.query("COMMIT");

    return res.json({ sucesso: true, codigo_transacao: codigo });
  } catch (e) {
    await client.query("ROLLBACK");
    return res.status(500).json({ erro: "Falha na operação" });
  } finally {
    client.release();
  }
});

export default router;
