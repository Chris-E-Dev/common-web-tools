// JavaScript for converting Unix timestamp to readable datetime
document.getElementById("convertButton").addEventListener("click", () => {
    const timestampInput = document.getElementById("timestamp").value;
    const resultElement = document.getElementById("result");
  
    if (!timestampInput || isNaN(timestampInput)) {
      resultElement.textContent = "Please enter a valid Unix timestamp in milliseconds.";
      return;
    }
  
    const timestamp = parseInt(timestampInput);
    const date = new Date(timestamp);
  
    if (isNaN(date.getTime())) {
      resultElement.textContent = "Invalid timestamp.";
    } else {
      resultElement.textContent = `Local Datetime: ${date.toLocaleString()}`;
    }
  });
  