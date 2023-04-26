export interface ICounterOptions {
  title: string,
  description?: string,
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
  options: ICounterOptions
}