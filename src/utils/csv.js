const escapeCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const BOM = String.fromCharCode(0xfeff)

// columns: [{ header, csv: (row) => valor }]
export function exportToCsv(filename, columns, rows) {
  const exportable = columns.filter((column) => column.csv)
  const lines = [
    exportable.map((column) => escapeCell(column.header)).join(','),
    ...rows.map((row) => exportable.map((column) => escapeCell(column.csv(row))).join(',')),
  ]
  // BOM para que Excel respete las tildes
  const blob = new Blob([BOM + lines.join(String.fromCharCode(10))], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
