/// <amd-module name="@scom/scom-counter/global/interfaces.ts" />
declare module "@scom/scom-counter/global/interfaces.ts" {
    export interface ICounterOptions {
        title: string;
        description?: string;
        counterColName: string;
        counterLabel?: string;
        stringDecimal?: number;
        stringPrefix?: string;
        stringSuffix?: string;
        coloredPositiveValues?: boolean;
        coloredNegativeValues?: boolean;
    }
    export interface ICounterConfig {
        apiEndpoint: string;
        options: ICounterOptions;
    }
}
/// <amd-module name="@scom/scom-counter/global/utils.ts" />
declare module "@scom/scom-counter/global/utils.ts" {
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const callAPI: (apiEndpoint: string) => Promise<any>;
}
/// <amd-module name="@scom/scom-counter/global/index.ts" />
declare module "@scom/scom-counter/global/index.ts" {
    export interface PageBlock {
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        validate?: () => boolean;
        defaultEdit?: boolean;
        tag?: any;
        readonly onEdit: () => Promise<void>;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
        config: () => Promise<void>;
    }
    export * from "@scom/scom-counter/global/interfaces.ts";
    export * from "@scom/scom-counter/global/utils.ts";
}
/// <amd-module name="@scom/scom-counter/index.css.ts" />
declare module "@scom/scom-counter/index.css.ts" {
    export const containerStyle: string;
    export const counterStyle: string;
}
/// <amd-module name="@scom/scom-counter/assets.ts" />
declare module "@scom/scom-counter/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-counter" />
declare module "@scom/scom-counter" {
    import { Module, ControlElement, Container, IDataSchema } from '@ijstech/components';
    import { PageBlock, ICounterConfig } from "@scom/scom-counter/global/index.ts";
    interface ScomCounterElement extends ControlElement {
        data: ICounterConfig;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-counter']: ScomCounterElement;
            }
        }
    }
    export default class ScomCounter extends Module implements PageBlock {
        private vStackCounter;
        private vStackInfo;
        private loadingElm;
        private lbTitle;
        private lbDescription;
        private counterElm;
        private counterData;
        private apiEndpoint;
        private _oldData;
        private _data;
        private oldTag;
        tag: any;
        defaultEdit: boolean;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        readonly onEdit: () => Promise<void>;
        static create(options?: ScomCounterElement, parent?: Container): Promise<ScomCounter>;
        constructor(parent?: Container, options?: ScomCounterElement);
        getData(): ICounterConfig;
        setData(data: ICounterConfig): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        getConfigSchema(): IDataSchema;
        onConfigSave(config: any): void;
        edit(): Promise<void>;
        confirm(): Promise<void>;
        discard(): Promise<void>;
        config(): Promise<void>;
        private getPropertiesSchema;
        private getThemeSchema;
        getEmbedderActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        getActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        private updateStyle;
        private updateTheme;
        private onUpdateBlock;
        private updateCounterData;
        private formatCounter;
        private renderCounter;
        private resizeCounter;
        init(): Promise<void>;
        render(): any;
    }
}
