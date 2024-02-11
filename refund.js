const totalPriceElement = document.getElementById("totalPrice");
function updateTotalPrice() {
  const priceElements = document.querySelectorAll(
    "#serviceTable tbody td#price"
  );
  let totalPrice = 0;

  priceElements.forEach((priceElement) => {
    const priceValue = parseFloat(priceElement.textContent) || 0;
    totalPrice += priceValue;
  });
  return totalPrice;
}

// Function to calculate total price after deduction
function calculateTotalPriceAfterDeduction() {
  const lessAmount =
    parseFloat(document.getElementById("lessAmount").value) || 0;
  const totalPriceBeforeDeduction = updateTotalPrice();
  return Math.max(totalPriceBeforeDeduction - lessAmount, 0);
} // Function to update the total price

// Update total price including deduction
function updateNetPrice() {
  const totalPriceAfterDeduction = calculateTotalPriceAfterDeduction();
  console.log(totalPriceAfterDeduction);
  totalPriceElement.textContent = totalPriceAfterDeduction.toFixed(2);
}

function suggestService(cell) {
  if (document.querySelector(".suggestions-container")) {
    document.querySelector(".suggestions-container").remove();
  }

  const suggestions = [
    "X-RAY SKULL AP",
    "X-RAY SKULL LAT.",
    "X-RAY SKULL AP/LAT. VIEW",
    "X-RAY CERVICAL AP/LAT. VIEW",
    "X-RAY FACE AP/LAT VIEW",
    "X-RAY CLAVICAL AP VIEW",
    "X-RAY SHOULDER AP VIEW",
    "X-RAY HUMERUS/ARM AP/LAT. VIEW",
    "X-RAY RT.ELBOW JOINT AP/LAT VIEW",
    "X-RAY LT.ELBOW JOINT AP/LAT VIEW",
    "X-RAY RT. FOREARM AP/LAT VIEW",
    "X-RAY LT. FOREARM AP/LAT VIEW",
    "X-RAY RT. WRIST-JOINT AP/LAT VIEW",
    "X-RAY RT. HAND AP/OBLIQUE VIEW",
    "X-RAY LT. HAND AP/OBLIQUE VIEW",
    "X-RAY PELVIS AP VIEW",
    "X-RAY DL SPINE AP VIEW",
    "X-RAY DL SPINE LAT VIEW",
    "X-RAY L. SPINE AP VIEW",
    "X-RAY L. SPINE LAT VIEW",
    "X-RAY RT. FEMUR/THIGH AP/LAT VIEW",
    "X-RAY LT. FEMUR/THIGH AP/LAT VIEW",
    "X-RAY RT. KNEE JOINT AP/LAT VIEW",
    "X-RAY LT. KNEE JOINT AP/LAT VIEW",
    "X-RAY RT. LET AP/LAT VIEW",
    "X-RAY LT. LEG AP/LAT VIEW",
    "X-RAY RT. ANKLE JOINT AP/LAT VIEW",
    "X-RAY LT. ANKLE JOINT AP/LAT VIEW",
    "X-RAY RT. FOOT AP/OBLIQUE VIEW",
    "X-RAY LT. FOOT AP/OBLIQUE VIEW",
    "USG - ABDOMEN",
    "USG - BREAST",
    "USG - TVS",
    "USG - THYROID",
    "OPG",
    "ECG",
    "CONSULTANCY",
    "BLOOD TEST",
    "CBC,MPCD,WIDAL,ESR",
    "CBC",
    "HB",
    "ESR",
    "BLOOD SUGAR FASTING",
    "BLOOD SUGAR PP",
    "S URIC ACID",
    "S. CARATININE",
    "S. BLOOD UREA",
    "THYROID PROFILE",
    "T. B GROID",
    "DENGUE TEST",
    "S. BILIRUBIN",
    "LFT",
    "RFT",
    "BLOOD GROUP",
    "X-RAY CHEST AP",
    "X-RAY CHEST PA",
    "X-RAY CERVICAL AP VIEW",
    "X-RAY CERVICAL LAT VIEW",
  ];
  const suggestionsContainer = createSuggestionsContainer();
  console.log(suggestionsContainer);
  cell.parentNode.appendChild(suggestionsContainer);

  cell.addEventListener("input", function () {
    console.log("fiter kro");
  });

  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("div");
    suggestionElement.classList.add("suggestion");
    suggestionElement.innerText = suggestion;
    suggestionElement.addEventListener("click", function () {
      cell.value = this.innerText;
      const priceCell = cell.parentNode.nextElementSibling;
      priceCell.innerText = getPrice(this.innerText);
      updateNetPrice();
      suggestionsContainer.remove();
    });
    suggestionsContainer.appendChild(suggestionElement);
    // Hide suggestions on click outside the cell
    document.addEventListener("click", function (event) {
      if (!cell.contains(event.target)) {
        suggestionsContainer.remove();
      }
    });
  });

  function createSuggestionsContainer() {
    const container = document.createElement("div");
    container.classList.add("suggestions-container");

    container.style.position = "absolute";

    return container;
  }

  function filterSuggestions(value) {
    const suggestionElements =
      suggestionsContainer.querySelectorAll(".suggestion");
    suggestionElements.forEach((suggestionElement) => {
      const suggestionText = suggestionElement.innerText.toLowerCase();
      if (suggestionText.includes(value.toLowerCase())) {
        suggestionElement.style.display = "block";
      } else {
        suggestionElement.style.display = "none";
      }
    });

    suggestionsContainer.style.display = "block";
  }
  filterSuggestions(cell.value);
}

function getPrice(serviceInput) {
  const service = serviceInput.trim().toUpperCase(); // Convert to uppercase for case-insensitivity
  // Mapping of starting letters to prices
  const serviceMappings = {
    X: 400,
    U: 1000, // Assuming "USG" or services starting with "U" have a price of 1000
    O: 500,
    E: 400,
    C: 200,
    L: 0, // Default price for Lab Tests or services starting with "L"
  };

  // Extract the starting letter
  const startingLetter = service.charAt(0);

  // Check if the starting letter is in the mappings
  if (serviceMappings.hasOwnProperty(startingLetter)) {
    return serviceMappings[startingLetter];
  }

  return 0; // Default price for unknown services
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientRegistrationForm");
  const checkboxes = document.querySelectorAll('input[name="services"]');
  const quantityFields = document.querySelectorAll(".quantity-field");

  function serializeFormData() {
    // Retrieve values from the form elements

    // Serialize services data
    const servicesTableRows = document.querySelectorAll(
      "#serviceTable tbody tr"
    );
    const servicesData = [];

    servicesTableRows.forEach((row) => {
      const serviceInput = row.querySelector("td:first-child input");
      const service = serviceInput.value.trim();
      const priceCell = row.querySelector("td:last-child");
      const price = priceCell.textContent.trim() || 0;

      servicesData.push({ service, price });
    });

    // Retrieve the value of the "Less" input field
    const lessAmount =
      parseFloat(document.getElementById("lessAmount").value.trim()) || 0;

    // Calculate total amount
    const totalAmount = parseFloat(updateTotalPrice());

    // Calculate Net amount
    const netAmountElement = document.getElementById("totalPrice");
    const netAmount =
      netAmountElement.innerText.trim().toLowerCase() === "no paid"
        ? "NO PAID"
        : parseFloat(netAmountElement.innerText.trim());

    // Retrieve or initialize patient number

    let time = getCurrentTime();

    // Return the serialized data
    return {
      servicesData,
      totalAmount,
      lessAmount,
      netAmount,
      time,
    };
  }

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // Function to set total price to "No Paid"
  function setTotalPriceToNoPaid() {
    totalPriceElement.textContent = "NO PAID";
  }

  // Attach the updateTotalPrice function to the change event of checkboxes and quantity fields
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateTotalPrice);
  });

  quantityFields.forEach(function (quantityField) {
    quantityField.addEventListener("input", updateTotalPrice);
  });

  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission

      const inputs = Array.from(
        form.querySelectorAll("input, select, textarea")
      );
      const currentInput = document.activeElement;

      const currentIndex = inputs.indexOf(currentInput);
      const nextIndex = (currentIndex + 1) % inputs.length;

      inputs[nextIndex].focus();
    }
  });
  const burgerMenu = document.querySelector(".burger-menu");
  const navList = document.querySelector(".nav-list");

  burgerMenu.addEventListener("click", function () {
    navList.classList.toggle("show");
  });

  // Attach a submit event listener to the form
  document
    .getElementById("patientRegistrationForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      localStorage.removeItem("formData");
      let serialNo = document.getElementById("serialNo").value;
      // Serialize form data
      const formData = serializeFormData();
      // Store the form data in localStorage
      if (formData) {
        processRefund(formData);
        // Add the patient record to IndexedDB
        // Update the patient record in IndexedDB
        hospitalDB
          .updatePatient(serialNo, formData)
          .then(() => {
            console.log("Patient record updated successfully");
          })
          .catch((error) => {
            console.error("Error updating patient record:", error);
            alert("Failed to update patient record. Please try again.");
          });
        event.target.reset();
        window.location.href = "./bill.html";
      }
    });

  // Function to update patient data in local storage after refund
  function processRefund(data) {
    console.log(data);
    let serialNo = document.getElementById("serialNo").value;
    let currentDate = new Date().toISOString().split("T")[0];
    let patientDataArray = JSON.parse(localStorage.getItem(currentDate)) || [];

    // Find patient in local storage and update data
    for (let i = 0; i < patientDataArray.length; i++) {
      if (patientDataArray[i].serialNo === serialNo) {
        // Update patient data with form values

        patientDataArray[i].servicesData = data.servicesData;
        patientDataArray[i].netAmount = data.netAmount;
        patientDataArray[i].totalAmount = data.totalAmount;
        patientDataArray[i].lessAmount = data.lessAmount;
        localStorage.setItem("formData", JSON.stringify(patientDataArray[i]));

        // // Update local storage with modified patient data
        localStorage.setItem(currentDate, JSON.stringify(patientDataArray));

        return; // Exit loop once patient is found and updated
      }
    }

    // If patient with given serial number is not found
    alert("Patient not found in local storage!");
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12' in 12-hour format

    // Add leading zero for single-digit minutes and seconds
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    return currentTime;
  }

  // Attach a click event listener to the "No Paid" button
  document
    .getElementById("noPaidButton")
    .addEventListener("click", function () {
      setTotalPriceToNoPaid();
    });
  // Attach input event listener to the "Less" amount field
  document.getElementById("lessAmount").addEventListener("input", function () {
    updateNetPrice(); // Update total price when the "Less" amount changes
  });

  const tableBody = document.querySelector("#serviceTable tbody");

  function addRow() {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td style="padding:0px;position:relative" ><input oninput="suggestService(this)"  type="text">
</td>
      <td id="price" oninput="updateNetPrice()" contenteditable="true"></td>
    `;
    tableBody.appendChild(newRow);
  }

  document.getElementById("addRowBtn").addEventListener("click", addRow);
});
