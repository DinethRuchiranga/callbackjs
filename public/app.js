let selectedPerfume = null;
let isTransitioning = false;

const perfumes = {
  armani: {
    id: 1,
    name: "Stronger With You",
    brand: "GIORGIO ARMANI",
    description:
      "A warm, modern and addictive fragrance with notes of vanilla, amber and chestnut. Confident, stylish and perfect for every occasion.",
    image: "images/armani.png.webp"
  },

  dg: {
    id: 2,
    name: "The One",
    brand: "DOLCE & GABBANA",
    description:
      "A rich and elegant fragrance with warm amber, tobacco and spice notes. Smooth, masculine and luxurious.",
    image: "images/dg-the-one.png.webp"
  },

  eros: {
    id: 3,
    name: "Eros",
    brand: "VERSACE",
    description:
      "A bold fresh fragrance with mint, citrus and woody notes. Strong, energetic and memorable.",
    image: "images/eros.png.webp"
  }
};

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.remove("active");
    screen.classList.remove("screen-ready");
  });

  const nextScreen = document.getElementById(screenId);
  nextScreen.classList.add("active");

  setTimeout(() => {
    nextScreen.classList.add("screen-ready");
  }, 40);
}

// Home screen to perfume selection animation
function startExperience() {
  if (isTransitioning) return;

  isTransitioning = true;

  const idleScreen = document.getElementById("idleScreen");
  idleScreen.classList.add("idle-starting");

  setTimeout(() => {
    showScreen("selectionScreen");
    idleScreen.classList.remove("idle-starting");
    isTransitioning = false;
  }, 950);
}

document.getElementById("idleScreen").addEventListener("click", startExperience);
document.getElementById("idleScreen").addEventListener("touchstart", startExperience);

function openDetails(perfumeKey) {
  selectedPerfume = perfumes[perfumeKey];

  document.getElementById("detailName").innerText = selectedPerfume.name;
  document.getElementById("detailBrand").innerText = selectedPerfume.brand;
  document.getElementById("detailDescription").innerText =
    selectedPerfume.description;

  const detailBottle = document.getElementById("detailBottle");
  detailBottle.src = selectedPerfume.image;

  document.getElementById("qrPerfumeName").innerText = selectedPerfume.name;
  document.getElementById("qrPerfumeBrand").innerText = selectedPerfume.brand;

  document.getElementById("successPerfumeName").innerText =
    selectedPerfume.name;
  document.getElementById("successPerfumeBrand").innerText =
    selectedPerfume.brand;

  const successBottle = document.getElementById("successBottle");
  successBottle.src = selectedPerfume.image;

  showScreen("detailScreen");
}

function goToPayment() {
  if (!selectedPerfume) return;

  showScreen("qrScreen");

  // REAL PAYMENT MODE
  // Redirects to ToyyibPay through our Vercel API.
  // For now all perfume choices trigger the same one actuator after payment.
  setTimeout(() => {
    window.location.href = `/api/pay?perfume=${selectedPerfume.id}`;
  }, 1200);
}
