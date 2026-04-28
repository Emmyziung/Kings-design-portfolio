const items = [
    { description: "", quantity: "", rate: "" } // amount is computed, not stored
  ];
  let currentIndex = 0;

  // ====== Elements ======
  const navBar = document.getElementById("navBar");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const entryIndicator = document.getElementById("entryIndicator");
  const clientName = document.getElementById("clientName")
  const descEl = document.getElementById("desc");
  const qtyEl = document.getElementById("qty");
  const rateEl = document.getElementById("rate");
  const amountPreview = document.getElementById("amountPreview");

  const addMoreBtn = document.getElementById("addMoreBtn");
  const form = document.getElementById("itemsForm");

  // ====== Helpers ======
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoney = (n) =>
    `₦${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money = (n) => `₦${Number(n).toLocaleString()}`;

function renderInvoice(data) {

  document.getElementById("invDate").textContent = data.date;
  document.getElementById("invName").textContent = data.clientName;


  const itemsBody = document.getElementById("itemsBody");
  itemsBody.innerHTML = "";

  let total = 0;

  data.items.forEach((it) => {
    
    total += it.amount;

    const tr = document.createElement("tr");
    tr.className = "border-b border-[#e2e8f0]";
    tr.innerHTML = `
      <td class="text-left py-3 pl-4  pdf-blue-soft"><ul><li>${it.description}</li><ul></td>
      <td class="text-center py-3   pdf-blue-soft">${it.quantity}</td>
      <td class="text-center py-3   pdf-blue-soft">${money(it.rate)}</td>
      <td class="text-center py-3   pdf-blue-soft">${money(it.amount)}</td>
    `;
    itemsBody.appendChild(tr);
  });

  const tr = document.createElement("tr");
    tr.className = "border-b border-[#e2e8f0]";
    tr.innerHTML = `
      <td class="text-left py-3 pl-4 font-medium  pdf-blue-soft"> Total </td>
      <td class="text-center py-3   pdf-blue-soft"></td>
      <td class="text-center py-3   pdf-blue-soft"></td>
      <td class="text-center py-3  font-medium pdf-blue-soft">${money(total)}</td>
    `;
    itemsBody.appendChild(tr);


}
  function computeAmount(item) {
    return toNumber(item.quantity) * toNumber(item.rate);
  }

  function saveCurrentToState() {
    items[currentIndex] = {
      description: descEl.value.trim(),
      quantity: qtyEl.value,
      rate: rateEl.value
    };
  }

  function loadCurrentFromState() {
    const item = items[currentIndex];
    descEl.value = item.description ?? "";
    qtyEl.value = item.quantity ?? "";
    rateEl.value = item.rate ?? "";
    updateAmountPreview();
  }

  function updateAmountPreview() {
    const temp = {
      description: descEl.value,
      quantity: qtyEl.value,
      rate: rateEl.value
    };
    amountPreview.textContent = formatMoney(computeAmount(temp));
  }

  function updateNavUI() {
    // show nav only if multiple entries exist
    if (items.length > 1) {
        navBar.classList.remove("hidden");
        navBar.classList.add("flex");
    }
    else{
        navBar.classList.remove("flex")
     navBar.classList.add("hidden");
    }
    entryIndicator.textContent = `Entry ${currentIndex + 1} of ${items.length}`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === items.length - 1;

    // disabled style (simple)
    prevBtn.classList.toggle("opacity-50", prevBtn.disabled);
    prevBtn.classList.toggle("cursor-not-allowed", prevBtn.disabled);

    nextBtn.classList.toggle("opacity-50", nextBtn.disabled);
    nextBtn.classList.toggle("cursor-not-allowed", nextBtn.disabled);
  }

  function goTo(index) {
    saveCurrentToState();
    currentIndex = index;
    loadCurrentFromState();
    updateNavUI();
  }

  // ====== Events ======
  descEl.addEventListener("input", updateAmountPreview);
  qtyEl.addEventListener("input", updateAmountPreview);
  rateEl.addEventListener("input", updateAmountPreview);

  addMoreBtn.addEventListener("click", () => {
    // Save current entry first
    saveCurrentToState();

    // Add a new blank item and jump to it
    items.push({ description: "", quantity: "", rate: "" });
    currentIndex = items.length - 1;
    loadCurrentFromState();
    updateNavUI();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < items.length - 1) goTo(currentIndex + 1);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveCurrentToState();

    // This is what you access in JS:
    // amount is computed as quantity * rate
    const allItems = items.map((it) => ({
      description: it.description,
      quantity: toNumber(it.quantity),
      rate: toNumber(it.rate),
      amount: toNumber(it.quantity) * toNumber(it.rate)
    }));
    const d = new Date(), n = d.getDate();
const o = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";


const date = `${n}${o} ${d.toLocaleString("en-GB",{month:"long"})}, ${d.getFullYear()}`;

    const payload = {
        clientName: clientName.value,
        date: date,
        items: allItems
    }
    console.log("Invoice items payload:", payload);

form.classList.add("hidden");

await new Promise(resolve => setTimeout(resolve, 300));

const el = document.getElementById("invoicePreview");

 renderInvoice(payload)
    // You can now pass `payload` to your invoice generator / PDF logic
    // Example:
    // generateInvoicePdf(payload);
   

    

  const options = {
    
    filename: `Invoice-${clientName.value}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(el).save();
  });

  // ====== Init ======
  loadCurrentFromState();
  updateNavUI();
