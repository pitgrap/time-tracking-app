import React from 'react';

type ExportCSVProps = {
  data: Array<Array<string | number>>;
  fileName?: string;
};

export const ExportCSV: React.FC<ExportCSVProps> = ({ data, fileName = "download.csv" }) => {
  const downloadCSV = () => {
    const csvString = data
      .map(row => row.join(";"))
      .join("\n");

    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadCSV}>Download (.csv)</button>;
};
