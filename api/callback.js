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

    // Save debug data
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

    return res.status(200).json({
      success: true,
      message: "Callback received. Firebase updated.",
      received: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
