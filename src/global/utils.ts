import { BigNumber } from '@ijstech/eth-wallet';

export const isNumeric = (value: string | number | BigNumber): boolean => {
  if (value instanceof BigNumber) {
    return !value.isNaN() && value.isFinite();
  }
  if (typeof value === 'string') {
    const parsed = new BigNumber(value);
    return !parsed.isNaN() && parsed.isFinite();
  }
  return !isNaN(value) && isFinite(value);
}

export const groupDataByField = (arr: { [key: string]: any }[], field: string, key: string) => {
  const groups: Record<string, any[]> = {};
  for (const item of arr) {
    const val = item[field];
    if (!groups.hasOwnProperty(val)) {
      groups[val] = [];
    }
    groups[val].push(item);
  }
  return groups[key] || [];
}

export const getAverageValue = (arr: { [key: string]: any }[], key: string) => {
  if (arr.length === 0) {
    return 0;
  }
  const sum = arr.reduce((total: number, item: any) => total + item[key], 0);
  return sum / arr.length;
}