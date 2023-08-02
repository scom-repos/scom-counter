import {
  Module,
  customModule,
  ControlElement,
  customElements,
  Container,
  IDataSchema,
  HStack,
  Label,
  VStack,
  Styles,
  Panel,
  Button
} from '@ijstech/components';
import { ICounterConfig, formatNumberWithSeparators, callAPI, ICounterOptions } from './global/index';
import { containerStyle, counterStyle } from './index.css';
import assets from './assets';
import dataJson from './data.json';
import ScomChartDataSourceSetup, { ModeType, fetchContentByCID } from '@scom/scom-chart-data-source-setup';

const Theme = Styles.Theme.ThemeVars;
const currentTheme = Styles.Theme.currentTheme;

const options = {
  type: 'object',
  required: ['counterColName'],
  properties: {
    counterColName: {
      type: 'string'
    },
    counterLabel: {
      type: 'string'
    },
    stringDecimal: {
      type: 'number'
    },
    stringPrefix: {
      type: 'string'
    },
    stringSuffix: {
      type: 'string'
    }
  }
}

interface ScomCounterElement extends ControlElement {
  lazyLoad?: boolean;
  data: ICounterConfig
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-counter']: ScomCounterElement;
    }
  }
}

@customModule
@customElements('i-scom-counter')
export default class ScomCounter extends Module {
  private vStackCounter: VStack;
  private vStackInfo: HStack;
  private loadingElm: Panel;
  private lbTitle: Label;
  private lbDescription: Label;
  private counterElm: VStack;
  private counterData: { [key: string]: string | number }[];
  private apiEndpoint = '';

  private _data: ICounterConfig = { apiEndpoint: '', title: '', options: undefined, mode: ModeType.LIVE };
  tag: any = {};
  defaultEdit: boolean = true;
  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  static async create(options?: ScomCounterElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: ScomCounterElement) {
    super(parent, options);
  }

  private getData() {
    return this._data;
  }

  private async setData(data: ICounterConfig) {
    this._data = data;
    this.updateCounterData();
  }

  private getTag() {
    return this.tag;
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        this.tag[prop] = newValue[prop];
      }
    }
    this.width = this.tag.width || 700;
    this.height = this.tag.height || 200;
    this.onUpdateBlock();
  }

  private getPropertiesSchema() {
    const propertiesSchema = {
      type: 'object',
      required: ['apiEndpoint', 'title'],
      properties: {
        // apiEndpoint: {
        //   type: 'string'
        // },
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        options
      }
    }
    return propertiesSchema as IDataSchema;
  }

  private getGeneralSchema() {
    const propertiesSchema = {
      type: 'object',
      required: ['title'],
      properties: {
        // apiEndpoint: {
        //   type: 'string'
        // },
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      }
    }
    return propertiesSchema as IDataSchema;
  }

  private getAdvanceSchema() {
    const propertiesSchema = {
      type: 'object',
      properties: {
        options
      }
    };
    return propertiesSchema as IDataSchema;
  }

  private getThemeSchema() {
    const themeSchema = {
      type: 'object',
      properties: {
        darkShadow: {
          type: 'boolean'
        },
        fontColor: {
          type: 'string',
          format: 'color'
        },
        backgroundColor: {
          type: 'string',
          format: 'color'
        },
        counterNumberColor: {
          type: 'string',
          format: 'color'
        },
        counterLabelColor: {
          type: 'string',
          format: 'color'
        },
        // width: {
        //   type: 'string'
        // },
        height: {
          type: 'string'
        }
      }
    }
    return themeSchema as IDataSchema;
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema, advancedSchema?: IDataSchema) {
    const actions = [
      {
        name: 'Data Source',
        icon: 'database',
        command: (builder: any, userInputData: any) => {
          let _oldData: ICounterConfig = { apiEndpoint: '', title: '', options: undefined,  mode: ModeType.LIVE };
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData?.mode) this._data.mode = userInputData?.mode;
              if (userInputData?.file) this._data.file = userInputData?.file;
              if (userInputData?.apiEndpoint) this._data.apiEndpoint = userInputData?.apiEndpoint;
              if (builder?.setData) builder.setData(this._data);
              this.setData(this._data);
            },
            undo: () => {
              if (builder?.setData) builder.setData(_oldData);
              this.setData(_oldData);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack(null, {gap: '1rem'});
            const config = new ScomChartDataSourceSetup(null, {...this._data, chartData: JSON.stringify(this.counterData)});
            const hstack = new HStack(null, {
              verticalAlignment: 'center',
              horizontalAlignment: 'end'
            });
            const button = new Button(null, {
              caption: 'Confirm',
              width: 'auto',
              height: 40,
              font: {color: Theme.colors.primary.contrastText}
            });
            hstack.append(button);
            vstack.append(config);
            vstack.append(hstack);
            button.onClick = async () => {
              const { apiEndpoint, file, mode } = config.data;
              if (mode === 'Live') {
                if (!apiEndpoint) return;
                this._data.apiEndpoint = apiEndpoint;
                this.updateCounterData();
              } else {
                if (!file?.cid) return;
                this.counterData = config.data.chartData ? JSON.parse(config.data.chartData) : []
                this.onUpdateBlock();
              }
              if (onConfirm) {
                onConfirm(true, {...this._data, apiEndpoint, file, mode});
              }
            }
            return vstack;
          }
        }
      },
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let _oldData: ICounterConfig = { apiEndpoint: '', title: '', options: undefined, mode: ModeType.LIVE };
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData) {
                if (advancedSchema) {
                  this._data = { ...this._data, ...userInputData };
                } else {
                  this._data = { ...userInputData };
                }
              }
              if (builder?.setData) builder.setData(this._data);
              this.setData(this._data);
            },
            undo: () => {
              if (advancedSchema) _oldData = { ..._oldData, options: this._data.options };
              if (builder?.setData) builder.setData(_oldData);
              this.setData(_oldData);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema,
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder?.setTag) builder.setTag(userInputData);
              else this.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder?.setTag) builder.setTag(this.tag);
              else this.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    if (advancedSchema) {
      const advanced = {
        name: 'Advanced',
        icon: 'sliders-h',
        command: (builder: any, userInputData: any) => {
          let _oldData: ICounterOptions = { counterColName: '' };
          return {
            execute: async () => {
              _oldData = { ...this._data?.options };
              if (userInputData?.options !== undefined) this._data.options = userInputData.options;
              if (builder?.setData) builder.setData(this._data);
              this.setData(this._data);
            },
            undo: () => {
              this._data.options = { ..._oldData };
              if (builder?.setData) builder.setData(this._data);
              this.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: advancedSchema,
      }
      actions.push(advanced);
    }
    return actions
  }

  getConfigurators() {
    const self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions(this.getGeneralSchema(), this.getThemeSchema(), this.getAdvanceSchema());
        },
        getData: this.getData.bind(this),
        setData: async (data: ICounterConfig) => {
          const defaultData = dataJson.defaultBuilderData;
          await this.setData({ ...defaultData, ...data });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: () => {
          return this._getActions(this.getPropertiesSchema(), this.getThemeSchema())
        },
        getLinkParams: () => {
          const data = this._data || {};
          return {
            data: window.btoa(JSON.stringify(data))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const utf8String = decodeURIComponent(params.data);
            const decodedString = window.atob(utf8String);
            const newData = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              ...newData
            };
            await this.setData(resultingData);
          }
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private updateStyle(name: string, value: any) {
    value ? this.style.setProperty(name, value) : this.style.removeProperty(name);
  }

  private updateTheme() {
    if (this.vStackCounter) {
      this.vStackCounter.style.boxShadow = this.tag?.darkShadow ? '0 -2px 10px rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
    }
    this.updateStyle('--text-primary', this.tag?.fontColor);
    this.updateStyle('--background-main', this.tag?.backgroundColor);
    this.updateStyle('--colors-primary-main', this.tag?.counterNumberColor);
    this.updateStyle('--colors-primary-dark', this.tag?.counterLabelColor);
  }

  private onUpdateBlock() {
    this.renderCounter();
    this.updateTheme();
  }

  private async updateCounterData() {
    this.loadingElm.visible = true;
    if (this._data?.mode === ModeType.SNAPSHOT)
      await this.renderSnapshotData();
    else
      await this.renderLiveData();
    this.loadingElm.visible = false;
  }

  private async renderSnapshotData() {
    if (this._data.file?.cid) {
      const data = await fetchContentByCID(this._data.file.cid);
      if (data) {
        this.counterData = data;
        this.onUpdateBlock();
        return;
      }
    }
    this.counterData = [];
    this.onUpdateBlock();
  }

  private async renderLiveData() {
    if (this._data.apiEndpoint === this.apiEndpoint) {
      this.onUpdateBlock();
      return;
    }
    const apiEndpoint = this._data.apiEndpoint;
    this.apiEndpoint = apiEndpoint;
    if (apiEndpoint) {
      let data = null
      try {
        data = await callAPI(apiEndpoint);
        if (data && this._data.apiEndpoint === apiEndpoint) {
          this.counterData = data;
          this.onUpdateBlock();
          return;
        }
      } catch {}
    }
    this.counterData = [];
    this.onUpdateBlock();
  }

  private formatCounter(num: number, decimals?: number) {
    return formatNumberWithSeparators(num, decimals);
  }

  private async renderCounter(resize?: boolean) {
    if (!this.counterElm && this._data.options) return;
    const { title, description } = this._data;
    const { counterColName, counterLabel, stringDecimal, stringPrefix, stringSuffix, coloredNegativeValues, coloredPositiveValues } = this._data?.options || {};
    this.lbTitle.caption = title;
    this.lbDescription.caption = description;
    this.lbDescription.visible = !!description;
    this.counterElm.height = `calc(100% - ${this.vStackInfo.offsetHeight + 10}px)`;
    if (resize) return;
    this.counterElm.clearInnerHTML();
    if (this.counterData && this.counterData.length) {
      const value = this.counterData[0][counterColName];
      const isNumber = typeof value === 'number';
      let _number = isNumber ? (Number(value) / 100) : 0;
      const lbValue = new Label(this.counterElm, {
        caption: `${stringPrefix || ''}${isNumber ? 0 : value}${stringSuffix || ''}`,
        font: {
          size: '32px',
          color: Theme.colors.primary.main
        }
      });
      lbValue.wordBreak = 'break-all';
      if (isNumber) {
        if (!lbValue.isConnected) await lbValue.ready();
        const increment = Number(value) / 20;
        let interval = setInterval(() => {
          _number += increment;
          if (_number >= Number(value)) {
            _number = Number(value);
            clearInterval(interval);
          }
          lbValue.caption = `${stringPrefix || ''}${this.formatCounter(_number, stringDecimal)}${stringSuffix || ''}`
        }, 25);
      }
    }
    if (counterLabel) {
      new Label(this.counterElm, {
        caption: counterLabel,
        font: { size: '18px', color: Theme.colors.primary.dark }
      });
    }
  }

  private resizeCounter() {
    this.renderCounter(true);
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.setTag({
      fontColor: currentTheme.text.primary,
      backgroundColor: currentTheme.background.main,
      counterNumberColor: currentTheme.colors.primary.main,
      counterLabelColor: currentTheme.colors.primary.dark,
      height: 200,
      darkShadow: false
    })
    // const { width, height, darkShadow } = this.tag || {};
    // this.width = width || 700;
    // this.height = height || 200;
    this.maxWidth = '100%';
    this.vStackCounter.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
    this.classList.add(counterStyle);
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const data = this.getAttribute('data', true);
      if (data) {
        this.setData(data);
      }
    }
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.resizeCounter();
      }, 300);
    });
  }

  render() {
    return (
      <i-vstack
        id="vStackCounter"
        position="relative"
        background={{ color: Theme.background.main }}
        height="100%"
        padding={{ top: 10, bottom: 10, left: 10, right: 10 }}
        class={containerStyle}
      >
        <i-vstack id="loadingElm" class="i-loading-overlay">
          <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
            <i-icon
              class="i-loading-spinner_icon"
              image={{ url: assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
            />
          </i-vstack>
        </i-vstack>
        <i-vstack
          id="vStackInfo"
          width="100%"
          maxWidth="100%"
          margin={{ left: 'auto', right: 'auto', bottom: 10 }}
          verticalAlignment="center"
        >
          <i-label id="lbTitle" font={{ bold: true, color: Theme.text.primary }} />
          <i-label id="lbDescription" margin={{ top: 5 }} font={{ color: Theme.text.primary }} />
        </i-vstack>
        <i-vstack id="counterElm" margin={{ top: 16, bottom: 32 }} horizontalAlignment="center" width="100%" height="100%" class="text-center" />
      </i-vstack>
    )
  }
}