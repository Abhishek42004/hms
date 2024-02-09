// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

// Function to check if the pin is stored in cookies
function checkPinCookie() {
  var pin = getCookie("admin_pin");
  return pin !== null;
}

// Function to set a pin in cookies
function setPinCookie(pin) {
  setCookie("admin_pin", pin, 365); // Set the pin cookie to expire in 1 year
}

// Function to display the pin prompt window
function displayPinPrompt() {
  var pin = prompt("Please enter your pin:");

  // If the pin is correct, redirect to the current page
  if (pin !== null && pin !== "") {
    var storedPin = getCookie("admin_pin");
    if (pin === storedPin) {
      // Redirect to the current page
      console.log("Welcome to the page");
    } else {
      // Incorrect pin, redirect to home page
      window.location.href = "./"; // Adjust the path as per your application
    }
  } else {
    // User canceled the prompt, redirect to home page
    window.location.href = "./"; // Adjust the path as per your application
  }
}

// Function to prompt user to create a new pin and save it to cookies
function createNewPin() {
  var pin = prompt("Create a new pin:");

  // If the pin is entered, save it to cookies
  if (pin !== null && pin !== "") {
    setPinCookie(pin);
    // Redirect to the current page
    console.log("Welcome");
  } else {
    // Redirect to home page if pin is not entered
    window.location.href = "./"; // Adjust the path as per your application
  }
}

// Function to display the pin input window if the pin is not stored in cookies
function showPinInputWindow() {
  if (!checkPinCookie()) {
    var createPin = confirm(
      "You need to create a pin to access this page. Do you want to create one?"
    );
    if (createPin) {
      createNewPin();
    } else {
      // Redirect to home page
      window.location.href = "./"; // Adjust the path as per your application
    }
  } else {
    displayPinPrompt();
  }
}

// Check if the user is on the particular page where pin protection is required
showPinInputWindow();
