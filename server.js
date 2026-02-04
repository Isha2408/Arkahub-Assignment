// server.js
import express from 'express';
import CryptoJS from 'crypto-js';

const app = express();
const PORT = 3000;
const API_URL = "http://127.0.0.1:3000/device/real/query";
const TOKEN = "interview_token_123";

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Energy Grid Data Aggregator</title>
</head>
<body>
  <h1>Aggregating data...</h1>
  <pre id="output"></pre>
  <script type="module">
    import { generateSerialNumbers } from './utils.js';
    import { aggregateDeviceData } from './aggregator.js';

    async function main() {
      try {
        const serialNumbers = generateSerialNumbers(10);
        document.querySelector('h1').textContent = 'Starting data aggregation...';
        const aggregatedData = await aggregateDeviceData(serialNumbers);
        document.querySelector('h1').textContent = 'Aggregation complete!';
        const report = {
          timestamp: new Date().toISOString(),
          totalDevices: aggregatedData.length,
          data: aggregatedData
        };
        document.getElementById('output').textContent = JSON.stringify(report, null, 2);
      } catch (err) {
        document.querySelector('h1').textContent = 'Fatal error: ' + err.message;
      }
    }
    main();
  </script>
</body>
</html>
  `);
});

function generateSignature(url, token, timestamp) {
  const raw = url + token + timestamp;
  return CryptoJS.MD5(raw).toString();
}

app.post('/device/real/query', (req, res) => {
  const Signature = req.headers.signature;
  const Timestamp = req.headers.timestamp;
  const Token = req.headers.token;

  if (Token !== TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const expectedSignature = generateSignature(API_URL, TOKEN, Timestamp);
  if (Signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { serialNumbers } = req.body;
  if (!Array.isArray(serialNumbers)) {
    return res.status(400).json({ error: 'serialNumbers must be an array' });
  }

  // Mock data
  const data = serialNumbers.map(sn => ({
    serialNumber: sn,
    power: Math.random() * 1000,
    voltage: 220 + Math.random() * 20,
    current: Math.random() * 10,
    timestamp: new Date().toISOString()
  }));

  res.json(data);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});