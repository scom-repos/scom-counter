import { DataSource } from '@scom/scom-chart-data-source-setup';
import { BigNumber } from '@ijstech/eth-wallet';
import { IFormatNumberOptions } from './interfaces';

export const isNumeric = (value: string | number | BigNumber): boolean => {
  if (value instanceof BigNumber) {
      return !value.isNaN() && value.isFinite();
  } else if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) && isFinite(parsed);
  } else {
      return !isNaN(value) && isFinite(value);
  }
}

export const formatNumberWithSeparators = (value: number | string | BigNumber, options: IFormatNumberOptions): string => {
  let bigValue: BigNumber;
  if (value instanceof BigNumber) {
    bigValue = value;
  } 
  else {
    bigValue = new BigNumber(value);
  }

  if (bigValue.isNaN() || !bigValue.isFinite()) {
    return '0';
  }

  if (options.precision || options.precision === 0) {
    let outputStr = '';
    if (bigValue.gte(1)) {
      outputStr = bigValue.toFormat(options.precision, options.roundingMode || BigNumber.ROUND_HALF_CEIL);
    } 
    else {
      outputStr = bigValue.toFormat(options.precision);
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }

  return bigValue.toFormat();
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