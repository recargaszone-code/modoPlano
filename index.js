const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ======================= ENDPOINT PARA MODO PLANO =======================
app.post('/set-chat-mode', async (req, res) => {
  const { token, projectId, chat_mode_enabled } = req.body;

  if (!token || !projectId || typeof chat_mode_enabled !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'token, projectId e chat_mode_enabled (true/false) são obrigatórios'
    });
  }

  const url = `https://api.lovable.dev/projects/${projectId}`;

  const headers = {
    'Host': 'api.lovable.dev',
    'Connection': 'keep-alive',
    'sec-ch-ua-platform': '"Windows"',
    'Authorization': `Bearer ${token}`,
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    'sec-ch-ua-mobile': '?0',
    'X-Client-Git-SHA': '3b82dab2db6707d85451d5eb8936d8307ece3eac',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Origin': 'https://lovable.dev',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://lovable.dev/',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,pt;q=0.7'
  };

  const body = JSON.stringify({ chat_mode_enabled });

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body
    });

    const data = await response.text();

    if (response.ok) {
      res.json({
        success: true,
        message: '✅ Modo Plano atualizado com sucesso!',
        chat_mode_enabled: chat_mode_enabled,
        lovableResponse: data
      });
    } else {
      res.status(response.status).json({
        success: false,
        error: 'Erro ao atualizar no Lovable',
        statusCode: response.status,
        details: data
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Falha na conexão: ' + err.message
    });
  }
});

// ======================= DOCUMENTAÇÃO =======================
app.get('/docs', (req, res) => {
  res.send(`
    <h1>API - Toggle Modo Plano (Chat Mode)</h1>
    <p><strong>URL:</strong> https://lovableimageuploadtest.onrender.com/set-chat-mode</p>
    <h3>Body:</h3>
    <pre>
{
  "token": "SEU_TOKEN_COMPLETO",
  "projectId": "3b04712b-ca2f-41b7-8b2a-b244d18b3660",
  "chat_mode_enabled": true   // ou false
}
    </pre>
  `);
});

app.get('/', (req, res) => res.redirect('/docs'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Modo Plano rodando em https://lovableimageuploadtest.onrender.com`);
});
