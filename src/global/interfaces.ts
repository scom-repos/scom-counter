import { DataSource, ModeType } from "@scom/scom-chart-data-source-setup"

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
  dataSource?: string;
  queryId?: string;
  title: string;
  description?: string;
  options: ICounterOptions;
  file?: {
    cid: string;
    name: string;
  },
  mode: ModeType;
}