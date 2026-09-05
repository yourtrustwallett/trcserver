import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for wallet approvals
const walletApprovals = [];

// POST /api/wallets - receive wallet approval data from dapp
app.post("/api/wallets", (req, res) => {
  const { wallet, amount, txHash, status } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "wallet is required" });
  }

  const record = {
    id: walletApprovals.length + 1,
    wallet,
    amount: amount || null,
    txHash: txHash || null,
    status: status || "UNKNOWN",
    timestamp: new Date().toISOString(),
  };

  walletApprovals.push(record);

  console.log("📥 Received wallet approval:", record);
  console.log("📊 Total records:", walletApprovals.length);

  res.status(200).json({
    success: true,
    message: "Wallet approval recorded",
    record,
  });
});

// GET /api/wallets - retrieve all wallet approvals
app.get("/api/wallets", (req, res) => {
  res.status(200).json({
    success: true,
    count: walletApprovals.length,
    records: walletApprovals,
  });
});

// GET /api/wallets/:wallet - retrieve approvals for specific wallet
app.get("/api/wallets/:wallet", (req, res) => {
  const { wallet } = req.params;
  const records = walletApprovals.filter((r) => r.wallet === wallet);

  res.status(200).json({
    success: true,
    wallet,
    count: records.length,
    records,
  });
});

// DELETE /api/wallets - clear all records (for testing)
app.delete("/api/wallets", (req, res) => {
  const count = walletApprovals.length;
  walletApprovals.length = 0;
  res.status(200).json({
    success: true,
    message: `Cleared ${count} records`,
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    endpoints: {
      "POST /api/wallets": "Receive wallet approval data",
      "GET /api/wallets": "Get all wallet approvals",
      "GET /api/wallets/:wallet": "Get approvals for specific wallet",
      "DELETE /api/wallets": "Clear all records",
    },
    totalRecords: walletApprovals.length,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 POST http://localhost:${PORT}/api/wallets`);
  console.log(`📡 GET  http://localhost:${PORT}/api/wallets`);
});
