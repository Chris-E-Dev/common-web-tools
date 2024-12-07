// Initial JSON object
const jsonObject = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('json-table-body');
    const errorMessage = document.getElementById('error-message');
    const addBtn = document.getElementById('add-btn');
    const saveBtn = document.getElementById('save-btn');
    const newKeyInput = document.getElementById('new-key');
    const newValueInput = document.getElementById('new-value');
  
    // Helper to render the table
    function renderTable() {
      tableBody.innerHTML = '';
      Object.entries(jsonObject).forEach(([key, value], index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${key}</td>
          <td><input type="text" value="${value}" data-key="${key}"></td>
          <td><button class="remove-btn" data-key="${key}">Remove</button></td>
        `;
        tableBody.appendChild(row);
      });
    }

    // Add new property
    addBtn.addEventListener('click', () => {
      const newKey = newKeyInput.value.trim();
      const newValue = newValueInput.value.trim();
      if (!newKey || jsonObject.hasOwnProperty(newKey)) {
        errorMessage.textContent = 'Invalid or duplicate key.';
        return;
      }
      jsonObject[newKey] = newValue;
      newKeyInput.value = '';
      newValueInput.value = '';
      errorMessage.textContent = '';
      renderTable();
    });
  
    // Remove property
    tableBody.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-btn')) {
        const key = event.target.getAttribute('data-key');
        delete jsonObject[key];
        renderTable();
      }
    });
  
    // Save changes
    saveBtn.addEventListener('click', () => {
      try {
        const inputs = tableBody.querySelectorAll('input');
        inputs.forEach((input) => {
          const key = input.getAttribute('data-key');
          jsonObject[key] = input.value;
        });
        errorMessage.textContent = '';
        console.log('Updated JSON:', JSON.stringify(jsonObject, null, 2));
      } catch (error) {
        errorMessage.textContent = 'Error saving JSON: ' + error.message;
      }
    });
  
    // Initial render
    renderTable();
  });
  