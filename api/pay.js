export default async function handler(req, res) {
  try {
    const TOYYIBPAY_SECRET = process.env.vfd1b6wl-r00o-hbkb-zrde-i4sllb8wh4sb;
    const CATEGORY_CODE = process.env.tvnyxom3;

    const callbackUrl = "https://callbackjs-nine.vercel.app/api/callback";

    const formData = new URLSearchParams();

    formData.append("userSecretKey", TOYYIBPAY_SECRET);
    formData.append("categoryCode", CATEGORY_CODE);

    formData.append("billName", "Perfume Spray");
    formData.append("billDescription", "One perfume spray from vending machine");

    // Fixed price
    formData.append("billPriceSetting", "1");

    // Customer info optional
    formData.append("billPayorInfo", "0");

    // RM1 = 100, RM5 = 500
    formData.append("billAmount", "100");

    formData.append("billReturnUrl", callbackUrl);
    formData.append("billCallbackUrl", callbackUrl);

    formData.append("billExternalReferenceNo", "machine001");

    // Default customer details
    formData.append("billTo", "Customer");
    formData.append("billEmail", "customer@test.com");
    formData.append("billPhone", "601160891507");

    // DuitNow QR enabled
    formData.append("enableDuitNowQR", "1");

    // 0 = bill owner pays fee, 1 = customer pays fee
    formData.append("chargeDuitNowQR", "0");

    const response = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();

    console.log("ToyyibPay createBill result:", result);

    const billCode = result?.[0]?.BillCode;

    if (!billCode) {
      return res.status(500).send(`
        <h1>Bill Creation Failed</h1>
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `);
    }

    return res.redirect(302, `https://toyyibpay.com/${billCode}`);
  } catch (error) {
    console.error("Create bill error:", error);

    return res.status(500).send(`
      <h1>Error Creating Payment</h1>
      <p>${error.message}</p>
    `);
  }
}
