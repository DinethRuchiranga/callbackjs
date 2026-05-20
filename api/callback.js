export default async function handler(req, res) {
  try {
    const data = {
      method: req.method,
      body: req.body || {},
      query: req.query || {},
      time: new Date().toISOString(),
    };

    const FIREBASE_SECRET = "ymyViyzvSwmuW97BMmYuuDmAtN1oPq6igEoutu2S";
    const BASE_URL =
      "https://vending-prefume-default-rtdb.asia-southeast1.firebasedatabase.app";

    // Save callback debug data
    await fetch(`${BASE_URL}/debug/lastCallback.json?auth=${FIREBASE_SECRET}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Unlock machine
    await fetch(`${BASE_URL}/machine001/paid.json?auth=${FIREBASE_SECRET}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(true),
    });

    // Show customer-friendly success page instead of JSON
    res.setHeader("Content-Type", "text/html");

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="8;url=/api/pay">
        <title>Payment Successful</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #111827;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .card {
            background: #1f2937;
            padding: 40px;
            border-radius: 20px;
            max-width: 420px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          .success {
            font-size: 60px;
            margin-bottom: 20px;
          }
          h1 {
            color: #22c55e;
            margin-bottom: 10px;
          }
          p {
            font-size: 18px;
            color: #d1d5db;
          }
          .small {
            margin-top: 25px;
            font-size: 14px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="success">✅</div>
          <h1>Payment Successful</h1>
          <p>Machine unlocked.</p>
          <p>Please select your perfume now.</p>
          <div class="small">Screen will refresh for the next customer...</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.setHeader("Content-Type", "text/html");

    return res.status(500).send(`
      <h1>Payment Error</h1>
      <p>${error.message}</p>
    `);
  }
}
