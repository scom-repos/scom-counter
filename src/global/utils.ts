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

export const callAPI = async (apiEndpoint: string) => {
  if (!apiEndpoint) return [];
  try {
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json(); 
    return jsonData.result.rows || [];
  } catch (error) {
    console.log(error);
  }
  return [];
}