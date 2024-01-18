

const totalPriceElement = document.getElementById('totalPrice');
function updateTotalPrice() {
    const priceElements = document.querySelectorAll('#serviceTable tbody td#price');
    let totalPrice = 0;

    priceElements.forEach(priceElement => {
        const priceValue = parseFloat(priceElement.textContent) || 0;
        totalPrice += priceValue;
    });

    return totalPrice
}

// Function to calculate total price after deduction
function calculateTotalPriceAfterDeduction() {
    const lessAmount = parseFloat(document.getElementById('lessAmount').value) || 0;
    const totalPriceBeforeDeduction = updateTotalPrice();
    return Math.max(totalPriceBeforeDeduction - lessAmount, 0);
}// Function to update the total price

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

    console.log(cell);
    const suggestions = [
        "X-Ray",
        "USG - abdomen",
        "USG - breast",
        "USG - TVS",
        "USG - thyroid",
        "OPG",
        "ECG",
        "Consultancy",
        "Lab Tests",
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
            updateNetPrice()
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
        "X": 400,
        "U": 1000, // Assuming "USG" or services starting with "U" have a price of 1000
        "O": 500,
        "E": 400,
        "C": 200,
        "L": 0, // Default price for Lab Tests or services starting with "L"
    };

    // Extract the starting letter
    const startingLetter = service.charAt(0);

    // Check if the starting letter is in the mappings
    if (serviceMappings.hasOwnProperty(startingLetter)) {
        return serviceMappings[startingLetter];
    }

    return 0; // Default price for unknown services
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('patientRegistrationForm');
    const checkboxes = document.querySelectorAll('input[name="services"]');
    const quantityFields = document.querySelectorAll('.quantity-field');





    // function to set serial number 
    function generatePatientSerialNumber() {
        // Get the current date
        const currentDate = new Date();

        // Extract last two digits of the year
        const year = (currentDate.getFullYear() % 100).toString().padStart(2, '0');

        // Extract month and day
        const month = getAlphabeticRepresentation(currentDate.getMonth() + 1); // E.g., 'A' for January
        const day = currentDate.getDate()


        // Combine formatted date (YYMMD)
        const formattedDate = day + month + year;

        // Check if the patient number needs to reset for the day
        if (localStorage.getItem('lastGeneratedDate') !== formattedDate) {
            localStorage.setItem('lastGeneratedDate', formattedDate);
            localStorage.setItem('patientNumber', 1);
        }

        // Retrieve or initialize patient number
        let patientNumber = parseInt(localStorage.getItem('patientNumber')) || 1;

        // Generate serial number by combining formatted date and padded patient number
        const serialNumber = formattedDate + "S" + padNumber(patientNumber, 3);

        // Update the input field with the serial number
        document.getElementById("serialNo").value = serialNumber;



    }

    // Convert numerical representation to corresponding alphabet (1 -> A, 2 -> B, etc.)
    function getAlphabeticRepresentation(number) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[number - 1] || ''; // Return empty string for out-of-bounds values
    }

    // Pad a number to a specified width with leading zeros
    function padNumber(number, width) {
        const paddedNumber = number.toString().padStart(width, '0');
        return paddedNumber.length > width ? paddedNumber.slice(-width) : paddedNumber;
    }

    // Example Usage:
    const serialNumber = generatePatientSerialNumber();



    function serializeFormData() {
        // Retrieve values from the form elements
        const serialNo = document.getElementById('serialNo').value.trim();
        const date = getCurrentDate();
        const patientName = document.getElementById('patientName').value.trim();
        const age = document.getElementById('age').value.trim();
        const ageUnit = document.getElementById('ageUnit').value.trim();
        const relationship = document.querySelector('input[name="relationship"]:checked').value.trim();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const contactNo = document.getElementById('contactNo').value.trim();
        const referred = document.getElementById('referred').value.trim();
        const consultancy = document.getElementById('consultancy').value.trim();
        const gender = document.getElementById("gender").value.trim();
        const admitDate = document.getElementById('admitDate').value.trim();
      
        // Serialize services data
        const servicesTableRows = document.querySelectorAll('#serviceTable tbody tr');
        const servicesData = [];
        servicesTableRows.forEach(row => {
          const serviceInput = row.querySelector('td:first-child input');
          const service = serviceInput.value.trim();
          const priceCell = row.querySelector('td:last-child');
          const price = priceCell.textContent.trim() || 0;
          servicesData.push({ service, price });
        });
      
        // Retrieve the value of the "Less" input field
        const lessAmount = parseFloat(document.getElementById('lessAmount').value.trim()) || 0;
      
        // Calculate total amount 
        const totalAmount = parseFloat(updateTotalPrice());
      
        // Calculate Net amount
        const netAmountElement = document.getElementById('totalPrice');
        const netAmount = netAmountElement.innerText.trim().toLowerCase() === 'no paid' ? "NO PAID" : parseFloat(netAmountElement.innerText.trim());
      
        // Retrieve or initialize patient number
        let patientNumber = parseInt(localStorage.getItem('patientNumber')) || 1;
      
        // Increment and update patient number for the next registration
        localStorage.setItem('patientNumber', patientNumber + 1);
      
        // Return the serialized data
        return {
          serialNo,
          date,
          patientName,
          age: `${age} ${ageUnit}`,
          relationship,
          name,
          address,
          contactNo,
          referred,
          consultancy,
          gender,
          admitDate,
          servicesData,
          totalAmount,
          lessAmount,
          netAmount
        };
      }
      

    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // Function to set total price to "No Paid"
    function setTotalPriceToNoPaid() {
        totalPriceElement.textContent = 'NO PAID';
    }




    // Attach the updateTotalPrice function to the change event of checkboxes and quantity fields
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', updateTotalPrice);
    });

    quantityFields.forEach(function (quantityField) {
        quantityField.addEventListener('input', updateTotalPrice);
    });

    form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission

            const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
            const currentInput = document.activeElement;

            const currentIndex = inputs.indexOf(currentInput);
            const nextIndex = (currentIndex + 1) % inputs.length;

            inputs[nextIndex].focus();
        }
    });
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');

    burgerMenu.addEventListener('click', function () {
        navList.classList.toggle('show');
    });

    // Attach a submit event listener to the form
    document.getElementById('patientRegistrationForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        localStorage.removeItem('formData')
        // Serialize form data
        const formData = serializeFormData();
        // Generate bill content
        // Store the form data in localStorage
        if (formData) {
            // Fetch API to send patient data to the backend
            fetch('http://localhost:3000/api/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message); // Display success message
                    localStorage.setItem('formData', JSON.stringify(formData));
                    event.target.reset()
                    window.location.href = "./bill.html"
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to save patient data. Please try again.');
                    localStorage.setItem('formData', JSON.stringify(formData));
                    event.target.reset()
                    window.location.href = "./bill.html"
                });


        }
    });

    // Attach a click event listener to the "No Paid" button
    document.getElementById('noPaidButton').addEventListener('click', function () {
        setTotalPriceToNoPaid();
    });
    // Attach input event listener to the "Less" amount field
    document.getElementById('lessAmount').addEventListener('input', function () {
        updateNetPrice(); // Update total price when the "Less" amount changes
    });
    generatePatientSerialNumber()


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

    function callFunctionNTimes(n) {
        if (n > 0) {
            addRow();
            callFunctionNTimes(n - 1);
        }
    }

    callFunctionNTimes(8);

    document
        .getElementById("addRowBtn")
        .addEventListener("click", addRow);



});