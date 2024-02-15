// Example dynamic content population
document.addEventListener("DOMContentLoaded", function () {
  let data;
  // Function to calculate the total amount
  function calculateTotalAmount(servicesData) {
    return servicesData.reduce(
      (total, service) => total + service.quantity * service.price,
      0
    );
  }
  // Function to generate bill content
  function generateBillContent(userData) {
    const {
      serialNo,
      patientName,
      age,
      relationship,
      name,
      gender,
      lessAmount,
      totalAmount,
      netAmount,
      contactNo,
      referred,
      consultancy,
      medicalCertificateStart,
      medicalCertificateEnd,
      admitDate,
      dischargeDate,
      date,
      servicesData,
      cashPayment,
      onlinePayment,
      staffName,
      address
    } = userData;

    // Get the current time
    const currentTime = new Date();
    const hours = currentTime.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    const ampm = currentTime.getHours() >= 12 ? "PM" : "AM";

    const servicesTableRows = servicesData
      .filter((service) => service.service != "")
      .map(
        (service) => `
                <tr>
                    <td>${service.service}</td>
                    
                    <td>₹${service.price}</td>
                </tr>
            `
      )
      .join("");

    // const totalAmount = calculateTotalAmount(servicesData);

    let totalSection;
    if (netAmount >= 0) {
      totalSection = `
            <div class="invoice-total" style="line-height:12px">
            <p style="font-weight:normal">Payment Mode: cash -  ${cashPayment} online - ${onlinePayment}
            </p>
                <p style="font-weight:normal">Total Amount: ₹ ${totalAmount.toFixed(
                  2
                )}</p>
                <p style="font-weight:normal">Less: ₹ ${lessAmount.toFixed(
                  2
                )}</p>
                <p>Net Amount: ₹ ${netAmount.toFixed(2)}</p>
            </div>
        `;
    } else {
      totalSection = `
            <div class="invoice-total">
            <p>Net Amount: NO PAID</p>
            </div>
        `;
    }

    return `
        <div class="invoice-container" style="border: 1px solid black;">
            <div class="invoice-header">
                <img  src="./logo3.png"></img>
            </div>

            <div class="invoice-details">
                <!-- Your dynamic content goes here -->
                <div style="display:flex;justify-content:space-between">
                
                <p> <b>${hours}:${minutes}:${seconds} ${ampm} </b></p>
            </div>
            <br>
                <p>Staff : ${staffName}</p>
                <p style="margin-top:0px"><b>Serial No:  ${serialNo} </b></p>
                <p>Date: ${date} </p>
                <p style="line-height:14px"><b>PATIENT'S NAME : ${patientName}</b></p>
                <p><b>Age: ${age}</b></p>
                <p>Gender : ${gender}</p>
                <p style="line-height:16px">${relationship} : ${name}</p>
                <p style="line-height:16px">Referred: ${referred}</p>
                <p>Contact No: ${contactNo}</p>
            </div>

            <table class="invoice-table" style="line-height:5px">
                <thead>
                    <tr>
                        <th>Service</th>
                        
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicesTableRows}
                </tbody>
            </table>

            ${totalSection}
        </div>

        <div class="verification-token">
        <div class="invoice-header">
                <img  src="./logo3.png"></img>
            </div>
        <div style="display:flex;justify-content:space-between">
        <p> <b>${date}</b> </p>
        
    </div>
            <p style="margin-top:0px"><b>Serial No:</b>  ${serialNo} </p>

            <p style="margin-top:0px;line-height:14px"><b>Patient Name:</b>  ${patientName} </p>
            
            <p><b>Age:</b>  ${age} </p>
            <p><b>Gender :</b>  ${gender} </p>
            <p style="line-height:16px"><b>Address :</b>  ${address} </p>

            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicesTableRows}
                </tbody>
            </table>

            ${totalSection}
        </div>
    `;
  }

  // Implement other necessary functions as needed
  // Function to print the bill
  window.printBill = function () {
    window.print();
  };

  // Event listener for Enter key press
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      printBill();
    }
  });

  var formDataString = localStorage.getItem("formData");
  if (formDataString) {
    data = JSON.parse(formDataString);
    // Generate bill content
    const billContent = generateBillContent(data);
    // Display bill content on the page
    document.getElementById("billContent").innerHTML = billContent;
  } else {
    console.log("Form data not found.");
  }
});
