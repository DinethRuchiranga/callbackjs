import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const TOYYIBPAY_SECRET = process.env.TOYYIBPAY_SECRET;
    const FIREBASE_SECRET = process.env.FIREBASE_SECRET;

    const BASE_URL =
      "https://vending-prefume-default-rtdb.asia-southeast1.firebasedatabase.app";

    if (!TOYYIBPAY_SECRET || !FIREBASE_SECRET) {
      return res.status(500).send(`
        <h1>Missing Environment Variables</h1>
        <p>Please add TOYYIBPAY_SECRET and FIREBASE_SECRET in Vercel.</p>
      `);
    }

    const data = {
      method: req.method,
      body: req.body || {},
      query: req.query || {},
      time: new Date().toISOString()
    };

    const status =
      req.body?.status ||
      req.body?.status_id ||
      req.query?.status ||
      req.query?.status_id ||
      "";

    const refno = req.body?.refno || req.query?.refno || "";
    const order_id = req.body?.order_id || req.query?.order_id || "";
    const receivedHash = req.body?.hash || req.query?.hash || "";

    const isSuccess = String(status) === "1";

    // Save debug data
    await fetch(`${BASE_URL}/debug/lastCallback.json?auth=${FIREBASE_SECRET}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // If payment failed, cancelled, or pending
    if (!isSuccess) {
      await fetch(`${BASE_URL}/machine001/paid.json?auth=${FIREBASE_SECRET}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(false)
      });

      await fetch(`${BASE_URL}/machine001/paymentStatus.json?auth=${FIREBASE_SECRET}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify("failed_or_cancelled")
      });

      return res.redirect(302, "/?failed=true");
    }

    // Only POST callback should unlock the machine
    if (req.method === "POST" && isSuccess) {
      let hashValid = true;

      if (receivedHash) {
        const expectedHash = crypto
          .createHash("md5")
          .update(TOYYIBPAY_SECRET + status + order_id + refno + "ok")
          .digest("hex");

        hashValid = receivedHash === expectedHash;
      }

      if (!hashValid) {
        await fetch(`${BASE_URL}/machine001/paid.json?auth=${FIREBASE_SECRET}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(false)
        });

        await fetch(`${BASE_URL}/machine001/paymentStatus.json?auth=${FIREBASE_SECRET}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify("hash_failed")
        });

        return res.redirect(302, "/?failed=true");
      }

      // SUCCESS: unlock machine
      await fetch(`${BASE_URL}/machine001/paid.json?auth=${FIREBASE_SECRET}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(true)
      });

      await fetch(`${BASE_URL}/machine001/paymentStatus.json?auth=${FIREBASE_SECRET}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify("success")
      });

      return res.redirect(302, "/?success=true");
    }

    // Browser return success page
    // This shows luxury success screen, but machine unlock happens only from POST callback
    return res.redirect(302, "/?success=true");
  } catch (error) {
    return res.status(500).send(`
      <h1>Callback Error</h1>
      <p>${error.message}</p>
    `);
  }
}
