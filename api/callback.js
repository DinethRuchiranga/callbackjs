export default async function handler(req, res) {
  try {
    console.log("ToyyibPay callback received:", req.body);

    const data = req.body;

    // ToyyibPay usually sends payment status data here.
    // status_id = 1 normally means successful payment.
    const statusId = data.status_id || data.status || data.payment_status;

    if (statusId && String(statusId) !== "1") {
      return res.status(200).json({
        success: false,
        message: "Payment not successful",
        receivedStatus: statusId
      });
    }

    const firebaseUrl =
      "https://vending-prefume-default-rtdb.asia-southeast1.firebasedatabase.app/machine001/paid.json?auth=ymyViyzvSwmuW97BMmYuuDmAtN1oPq6igEoutu2S";

    const firebaseResponse = await fetch(firebaseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(true)
    });

    const firebaseResult = await firebaseResponse.json();

    return res.status(200).json({
      success: true,
      message: "Machine unlocked",
      firebase: firebaseResult
    });

  } catch (error) {
    console.error("Callback error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}