// Elements
const dateInput = document.getElementById('dateInput');
const convertToUnixBtn = document.getElementById('convertToUnix');
const unixOutput = document.getElementById('unixOutput');

const unixInput = document.getElementById('unixInput');
const convertToDateBtn = document.getElementById('convertToDate');
const dateOutput = document.getElementById('dateOutput');
const dateOutputLocal = document.getElementById('dateOutputLocal');

// Convert Date to Unix Timestamp
convertToUnixBtn.addEventListener('click', () => {
  const dateValue = dateInput.value;
  if (dateValue) {
      const timestamp = Math.floor(new Date(dateValue).getTime() / 1000);
      unixOutput.textContent = `Unix Timestamp: ${timestamp}`;
  } else {
      unixOutput.textContent = 'Please select a valid date.';
  }
});

// Convert Unix Timestamp to Date
convertToDateBtn.addEventListener('click', () => {
  const unixValue = unixInput.value;
  if (unixValue) {
      const date = new Date(unixValue * 1000);
      const utcDateTime = date.toISOString().slice(0, 16).replace('T', ' ');
      dateOutput.textContent = `Date: ${utcDateTime} UTC`;

      const localDateTime = date.toString();
      dateOutputLocal.textContent = `Local: ${localDateTime}`;
  } else {
      dateOutput.textContent = 'Please enter a valid Unix timestamp.';
  }
});