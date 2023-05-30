export interface ICounterOptions {
  counterColName: string,
  counterLabel?: string,
  stringDecimal?: number,
  stringPrefix?: string,
  stringSuffix?: string,
  coloredPositiveValues?: boolean,
  coloredNegativeValues?: boolean
}

export interface ICounterConfig {
  apiEndpoint: string,
  title: string,
  description?: string,
  options: ICounterOptions
}