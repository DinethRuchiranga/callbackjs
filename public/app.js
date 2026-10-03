let selectedPerfume = null;

const perfumes = {
  armani: {
    id: 1,
    name: "Stronger With You",
    brand: "GIORGIO ARMANI",
    description:
      "A warm, modern and addictive fragrance with notes of vanilla, amber and chestnut. Confident, stylish and perfect for every occasion.",
    bottleClass: "armani-bottle"
  },

  dg: {
    id: 2,
    name: "The One",
    brand: "DOLCE & GABBANA",
    description:
      "A rich and elegant fragrance with warm amber, tobacco and spice notes. Smooth, masculine and luxurious.",
    bottleClass: "dg-bottle"
  },

  eros: {
    id: 3,
    name: "Eros",
    brand: "VERSACE",
    description:
      "A bold fresh fragrance with mint, citrus and woody notes. Strong, energetic and memorable.",
    bottleClass: "eros-bottle"
  }
};

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

document.getElementById("idleScreen").addEventListener("click", () => {
  showScreen("selectionScreen");
});

function openDetails(perfumeKey) {
  selectedPerfume = perfumes[perfumeKey];

  document.getElementById("detailName").innerText = selectedPerfume.name;
  document.getElementById("detailBrand").innerText = selectedPerfume.brand;
  document.getElementById("detailDescription").innerText =
    selectedPerfume.description;

  const detailBottle = document.getElementById("detailBottle");
  detailBottle.className = "detail-bottle";
  detailBottle.classList.add(selectedPerfume.bottleClass);

  document.getElementById("qrPerfumeName").innerText = selectedPerfume.name;
  document.getElementById("qrPerfumeBrand").innerText = selectedPerfume.brand;

  document.getElementById("successPerfumeName").innerText =
    selectedPerfume.name;
  document.getElementById("successPerfumeBrand").innerText =
    selectedPerfume.brand;

  const successBottle = document.getElementById("successBottle");
  successBottle.className = "success-bottle";
  successBottle.classList.add(selectedPerfume.bottleClass);

  showScreen("detailScreen");
}

function goToPayment() {
  if (!selectedPerfume) return;

  showScreen("qrScreen");

  // PREVIEW MODE ONLY
  // Later we replace this with real ToyyibPay redirect:
  // window.location.href = `/api/pay?perfume=${selectedPerfume.id}`;

  setTimeout(() => {
    showScreen("successScreen");

    setTimeout(() => {
      showScreen("thankYouScreen");

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    }, 8000);
  }, 6000);
}
