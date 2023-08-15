import { DataSource } from '@scom/scom-chart-data-source-setup';

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision || precision === 0) {
    let outputStr = '';
    if (value >= 1) {
      outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
    } else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const callAPI = async (dataSource: string, queryId: string) => {
  if (!dataSource) return [];
  try {
    let apiEndpoint = '';
    switch (dataSource) {
      case DataSource.Dune:
        apiEndpoint = `/dune/query/${queryId}`;
        break;
    }
    if (!apiEndpoint) return [];
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json(); 
    return jsonData.result.rows || [];
  } catch (error) {
    console.log(error);
  }
  return [];
}