/**
 * Utility to export data to CSV format and trigger a download in the browser.
 * @param {Array} data - The array of objects to export.
 * @param {Array} headers - Array of objects with { label, key } representing CSV columns.
 * @param {string} filename - The name of the file to download (without extension).
 */
export const exportToCSV = (data, headers, filename = 'report') => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Create CSV header row
  const headerRow = headers.map(h => h.label).join(',');

  // Create CSV data rows
  const rows = data.map(item => {
    return headers.map(h => {
      let value = item[h.key] || '';
      // Escape commas and wrap in quotes if necessary
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      return value;
    }).join(',');
  });

  // Combine header and rows
  const csvContent = [headerRow, ...rows].join('\n');

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
