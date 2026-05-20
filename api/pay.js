export default async function handler(req, res) {
  try {
    const TOYYIBPAY_SECRET = process.env.TOYYIBPAY_SECRET;
    const CATEGORY_CODE = process.env.TOYYIBPAY_CATEGORY_CODE;

    if (!TOYYIBPAY_SECRET || !CATEGORY_CODE) {
      return res.status(500).send(`
        <h1>Missing Environment Variables</h1>
        <p>Please add TOYYIBPAY_SECRET and TOYYIBPAY_CATEGORY_CODE in Vercel.</p>
      `);
    }

    const callbackUrl = "https://callbackjs-nine.vercel.app/api/callback";

    const formData = new URLSearchParams();

    formData.append("userSecretKey", TOYYIBPAY_SECRET);
    formData.append("categoryCode", CATEGORY_CODE);
    formData.append("billName", "Perfume Spray");
    formData.append("billDescription", "One perfume spray from vending machine");
    formData.append("billPriceSetting", "1");
    formData.append("billPayorInfo", "0");
    formData.append("billAmount", "100");

    formData.append("billReturnUrl", callbackUrl);
    formData.append("billCallbackUrl", callbackUrl);

    formData.append("billExternalReferenceNo", "machine001");
    formData.append("billTo", "Customer");
    formData.append("billEmail", "customer@test.com");
    formData.append("billPhone", "601160891507");

    formData.append("enableDuitNowQR", "1");
    formData.append("chargeDuitNowQR", "0");

    const response = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();
    const billCode = result?.[0]?.BillCode;

    if (!billCode) {
      return res.status(500).send(`
        <h1>Bill Creation Failed</h1>
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `);
    }

    return res.redirect(302, `https://toyyibpay.com/${billCode}`);
  } catch (error) {
    return res.status(500).send(`
      <h1>Error Creating Payment</h1>
      <p>${error.message}</p>
    `);
  }
}
