let jsonObject = {};
let filteredObject = {}; // Stores the filtered object during search

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('json-table-body');
  const searchInput = document.getElementById('search-input');
  const errorMessage = document.getElementById('error-message');
  const addBtn = document.getElementById('add-btn');
  const saveBtn = document.getElementById('save-btn');
  const newKeyInput = document.getElementById('new-key');
  const newValueInput = document.getElementById('new-value');
  const fileInput = document.getElementById('file-input');
  const uploadFileBtn = document.getElementById('upload-file-btn');
  const textarea = document.getElementById('json-textarea');
  const uploadTextareaBtn = document.getElementById('upload-textarea-btn');
  const expandAllCheckbox = document.getElementById('expand-all-checkbox');
  const showAllCheckbox = document.getElementById('show-all-checkbox');
  let expanded = false; // Tracks expand/collapse state
  let showAll = false; // Tracks show-all state

  // Recursively filter JSON object
function filterJSON(data, searchTerm) {
    const result = {};
  
    Object.entries(data).forEach(([key, value]) => {
      const isKeyMatch = key.toLowerCase().includes(searchTerm.toLowerCase());
      const isValueMatch =
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase());
      const isNestedMatch =
        typeof value === 'object' && value !== null
          ? Object.keys(filterJSON(value, searchTerm)).length > 0
          : false;
  
      // Add the entry if key, value, or any nested value matches
      if (isKeyMatch || isValueMatch || isNestedMatch) {
        result[key] = typeof value === 'object' && value !== null && isNestedMatch
          ? filterJSON(value, searchTerm) // Only include matching nested entries
          : value;
      }
    });
  
    return result;
  }
  

  // Render table recursively
  function renderTable(data, parentKey = '', parentElement = tableBody) {
    parentElement.innerHTML = ''; // Clear existing rows
    Object.entries(data).forEach(([key, value]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          ${
            typeof value === 'object' && value !== null && !showAll
              ? `<span class="collapse-toggle">${expanded ? '▼' : '▶'}</span>`
              : ''
          }
          ${parentKey ? `${parentKey}.${key}` : key}
        </td>
        <td>
          ${
            typeof value === 'object' && value !== null
              ? '<span>(nested object/array)</span>'
              : `<input type="text" value="${value}" data-key="${key}" data-parent="${parentKey}">`
          }
        </td>
        <td>
          <button class="remove-btn" data-key="${key}" data-parent="${parentKey}">Remove</button>
        </td>
      `;

      // Append the row
      parentElement.appendChild(row);

      // Handle nested objects/arrays
      if (typeof value === 'object' && value !== null) {
        const nestedContainer = document.createElement('tbody');
        nestedContainer.classList.add('nested', expanded ? '' : 'hidden');
        parentElement.appendChild(nestedContainer);

        renderTable(value, parentKey ? `${parentKey}.${key}` : key, nestedContainer);

        if (!showAll) {
          // Collapse/Expand functionality
          const toggle = row.querySelector('.collapse-toggle');
          toggle.addEventListener('click', () => {
            const isHidden = nestedContainer.classList.contains('hidden');
            nestedContainer.classList.toggle('hidden');
            toggle.textContent = isHidden ? '▼' : '▶';
          });
        }
      }
    });
  }

  // Expand All Checkbox
  expandAllCheckbox.addEventListener('change', (event) => {
    expanded = event.target.checked;
    renderTable(filteredObject);
  });

  // Show All Checkbox
  showAllCheckbox.addEventListener('change', (event) => {
    showAll = event.target.checked;
    renderTable(filteredObject);
  });

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
    renderTable(jsonObject);
  });

  // Remove property
  tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
      const key = event.target.getAttribute('data-key');
      const parentKey = event.target.getAttribute('data-parent');
      const target = parentKey ? parentKey.split('.').reduce((o, k) => o[k], jsonObject) : jsonObject;
      delete target[key];
      renderTable(jsonObject);
    }
  });

  // Save changes
  saveBtn.addEventListener('click', () => {
    try {
      const inputs = tableBody.querySelectorAll('input');
      inputs.forEach((input) => {
        const key = input.getAttribute('data-key');
        const parentKey = input.getAttribute('data-parent');
        const target = parentKey ? parentKey.split('.').reduce((o, k) => o[k], jsonObject) : jsonObject;
        target[key] = input.value;
      });
      errorMessage.textContent = '';
      console.log('Updated JSON:', JSON.stringify(jsonObject, null, 2));
    } catch (error) {
      errorMessage.textContent = 'Error saving JSON: ' + error.message;
    }
  });

  // Upload JSON File
  uploadFileBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      errorMessage.textContent = 'Please select a JSON file.';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        jsonObject = JSON.parse(event.target.result);
        errorMessage.textContent = '';
        renderTable(jsonObject);
      } catch (error) {
        errorMessage.textContent = 'Invalid JSON file.';
      }
    };
    reader.readAsText(file);
  });

  // Load JSON from Textarea
  uploadTextareaBtn.addEventListener('click', () => {
    try {
      jsonObject = JSON.parse(textarea.value);
      errorMessage.textContent = '';
      renderTable(jsonObject);
    } catch (error) {
      errorMessage.textContent = 'Invalid JSON input.';
    }
  });

  // Filter JSON on search
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    filteredObject = searchTerm ? filterJSON(jsonObject, searchTerm) : jsonObject;
    renderTable(filteredObject);
  });

  // Initial render
  renderTable(jsonObject);
});