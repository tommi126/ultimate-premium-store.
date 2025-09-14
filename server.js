const express = require('express');
const path = require('path');
const app = express();

// Middleware per leggere il body in formato JSON
app.use(express.json());

// Serviamo i file statici (HTML, CSS, JS)
app.use(express.static(__dirname));

// Route principale -> carica index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API per simulare un ordine
app.post('/api/order', (req, res) => {
  console.log("📦 Nuovo ordine ricevuto:", req.body);
  res.json({ message: "✅ Ordine ricevuto correttamente!" });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Store online su http://localhost:${PORT}`);
});
