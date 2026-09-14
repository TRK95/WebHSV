import FileSaver from 'file-saver';

export function exportFileExcel(buffer: ArrayBuffer | null, fileName: string) {
  if (!buffer) return false;
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  FileSaver.saveAs(blob, `${fileName}.xls`);
  return true;
}
