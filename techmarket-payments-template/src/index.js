import express from "express";
import transferRouter from "./transfer.js";

const app = express();
app.use(express.json());
app.use("/transfer", transferRouter);
app.listen(3000, () => console.log("API rodando na porta 3000"));
