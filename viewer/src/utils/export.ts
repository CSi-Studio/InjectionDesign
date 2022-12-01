// import { TableDataType } from '../types';
// import { date2str } from './date';
//
// export const exportToCsv = (filename : string, rows: TableDataType[]) => {
//     var csvFile = '';
//     rows.forEach(function(row) {
//       csvFile += row.firstName + "," + row.lastName + "," + date2str(row.birth)+ "\r\n";
//     });
//
//     var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
//
//     var link = document.createElement("a");
//     if (link.download !== undefined) { // feature detection
//         // Browsers that support HTML5 download attribute
//         var url = URL.createObjectURL(blob);
//         link.setAttribute("href", url);
//         link.setAttribute("download", filename);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
//   }
