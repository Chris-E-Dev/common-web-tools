function flattenJSON(data, parentKey = '', result = {}) {
    for (const key in data) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
        flattenJSON(data[key], newKey, result);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            flattenJSON(item, `${newKey}[${index}]`, result);
          } else {
            result[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        result[newKey] = data[key];
      }
    }
    return result;
  }

  document.getElementById('flattenButton').addEventListener('click', () => {
    const input = document.getElementById('inputJSON').value;
    const outputElement = document.getElementById('outputJSON');
    try {
      const jsonData = JSON.parse(input);
      const flattened = flattenJSON(jsonData);
      outputElement.textContent = JSON.stringify(flattened, null, 2);
    } catch (error) {
      outputElement.textContent = 'Invalid JSON: ' + error.message;
    }
  });