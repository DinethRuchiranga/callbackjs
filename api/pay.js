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

    // Get selected perfume from URL:
    // /api/pay?perfume=1
    // /api/pay?perfume=2
    // /api/pay?perfume=3
    const perfumeId = req.query.perfume || "1";

    const perfumes = {
      "1": {
        name: "Armani Stronger With You",
        shortName: "Armani",
        description: "Desaint's RM1 test payment - Armani Stronger With You"
      },
      "2": {
        name: "Dolce & Gabbana The One",
        shortName: "D&G",
        description: "Desaint's RM1 test payment - Dolce & Gabbana The One"
      },
      "3": {
        name: "Versace Eros",
        shortName: "Eros",
        description: "Desaint's RM1 test payment - Versace Eros"
      }
    };

    const selectedPerfume = perfumes[perfumeId] || perfumes["1"];

    const callbackUrl = "https://callbackjs-nine.vercel.app/api/callback";

    const formData = new URLSearchParams();

    formData.append("userSecretKey", TOYYIBPAY_SECRET);
    formData.append("categoryCode", CATEGORY_CODE);

    // IMPORTANT:
    // ToyyibPay billName max length is 30 characters.
    // Keep this short.
    formData.append("billName", `Desaint P${perfumeId}`);

    // Longer text can go in billDescription
    formData.append("billDescription", selectedPerfume.description);

    // 1 = fixed price
    formData.append("billPriceSetting", "1");

    // 1 worked better for your ToyyibPay checkout details
    formData.append("billPayorInfo", "1");

    // RM1 testing mode
    // ToyyibPay amount is in sen:
    // RM1 = 100
    // RM5 = 500
    // RM10 = 1000
    formData.append("billAmount", "100");

    formData.append("billReturnUrl", callbackUrl);
    formData.append("billCallbackUrl", callbackUrl);

    // Store selected perfume in external reference for tracking
    formData.append("billExternalReferenceNo", `machine001_perfume_${perfumeId}`);

    formData.append("billTo", "Customer");
    formData.append("billEmail", "customer@test.com");
    formData.append("billPhone", "601160891507");

    // Enable DuitNow QR
    formData.append("enableDuitNowQR", "1");

    // 0 = bill owner pays DuitNow QR fee
    // 1 = customer pays DuitNow QR fee
    formData.append("chargeDuitNowQR", "0");

    const response = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const result = await response.json();
    const billCode = result?.[0]?.BillCode;

    if (!billCode) {
      return res.status(500).send(`
        <h1>Bill Creation Failed</h1>
        <p>Selected perfume: ${selectedPerfume.name}</p>
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
