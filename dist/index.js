var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-counter/global/interfaces.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-counter/global/utils.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callAPI = exports.formatNumberWithSeparators = void 0;
    ///<amd-module name='@scom/scom-counter/global/utils.ts'/> 
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision || precision === 0) {
            let outputStr = '';
            if (value >= 1) {
                outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            return outputStr;
        }
        return value.toLocaleString('en-US');
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    const callAPI = async (apiEndpoint) => {
        if (!apiEndpoint)
            return [];
        try {
            const response = await fetch(apiEndpoint);
            const jsonData = await response.json();
            return jsonData.result.rows || [];
        }
        catch (error) {
            console.log(error);
        }
        return [];
    };
    exports.callAPI = callAPI;
});
define("@scom/scom-counter/global/index.ts", ["require", "exports", "@scom/scom-counter/global/interfaces.ts", "@scom/scom-counter/global/utils.ts"], function (require, exports, interfaces_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(interfaces_1, exports);
    __exportStar(utils_1, exports);
});
define("@scom/scom-counter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.counterStyle = exports.containerStyle = void 0;
    exports.containerStyle = components_1.Styles.style({
        width: 'var(--layout-container-width)',
        maxWidth: 'var(--layout-container-max_width)',
        textAlign: 'var(--layout-container-text_align)',
        margin: '0 auto',
        padding: 10
    });
    exports.counterStyle = components_1.Styles.style({
        display: 'block',
    });
});
define("@scom/scom-counter/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_2.application.currentModuleDir;
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/scom-counter", ["require", "exports", "@ijstech/components", "@scom/scom-counter/global/index.ts", "@scom/scom-counter/index.css.ts", "@scom/scom-counter/assets.ts"], function (require, exports, components_3, index_1, index_css_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomCounter = class ScomCounter extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.apiEndpoint = '';
            this._oldData = { apiEndpoint: '', options: undefined };
            this._data = { apiEndpoint: '', options: undefined };
            this.oldTag = {};
            this.tag = {};
            this.defaultEdit = true;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        getData() {
            return this._data;
        }
        async setData(data) {
            this._oldData = this._data;
            this._data = data;
            this.updateCounterData();
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value || {};
            this.width = this.tag.width || 700;
            this.height = this.tag.height || 200;
            this.onUpdateBlock();
        }
        getConfigSchema() {
            return this.getThemeSchema();
        }
        onConfigSave(config) {
            this.tag = config;
            this.onUpdateBlock();
        }
        async edit() {
            // this.vStackCounter.visible = false
        }
        async confirm() {
            this.onUpdateBlock();
            // this.vStackCounter.visible = true
        }
        async discard() {
            // this.vStackCounter.visible = true
        }
        async config() { }
        getPropertiesSchema(readOnly) {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    apiEndpoint: {
                        type: 'string',
                        required: true
                    },
                    options: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string',
                                required: true
                            },
                            description: {
                                type: 'string'
                            },
                            counterColName: {
                                type: 'string',
                                required: true
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
                }
            };
            return propertiesSchema;
        }
        getThemeSchema(readOnly) {
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
                    width: {
                        type: 'string'
                    },
                    height: {
                        type: 'string'
                    }
                }
            };
            return themeSchema;
        }
        getEmbedderActions() {
            return this._getActions(this.getPropertiesSchema(true), this.getThemeSchema(true));
        }
        getActions() {
            return this._getActions(this.getPropertiesSchema(), this.getThemeSchema());
        }
        _getActions(propertiesSchema, themeSchema) {
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        return {
                            execute: async () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData) {
                                    builder.setData(userInputData);
                                }
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData) {
                                    builder.setData(this._oldData);
                                }
                                this.setData(this._oldData);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: propertiesSchema,
                },
                {
                    name: 'Theme Settings',
                    icon: 'palette',
                    command: (builder, userInputData) => {
                        return {
                            execute: async () => {
                                if (!userInputData)
                                    return;
                                this.oldTag = Object.assign({}, this.tag);
                                this.setTag(userInputData);
                                if (builder)
                                    builder.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.setTag(this.oldTag);
                                if (builder)
                                    builder.setTag(this.oldTag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: themeSchema
                }
            ];
            return actions;
        }
        updateStyle(name, value) {
            value ? this.style.setProperty(name, value) : this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c, _d, _e;
            if (this.vStackCounter) {
                this.vStackCounter.style.boxShadow = ((_a = this.tag) === null || _a === void 0 ? void 0 : _a.darkShadow) ? '0 -2px 10px rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
            }
            this.updateStyle('--text-primary', (_b = this.tag) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag) === null || _c === void 0 ? void 0 : _c.backgroundColor);
            this.updateStyle('--colors-primary-main', (_d = this.tag) === null || _d === void 0 ? void 0 : _d.counterNumberColor);
            this.updateStyle('--colors-primary-dark', (_e = this.tag) === null || _e === void 0 ? void 0 : _e.counterLabelColor);
        }
        onUpdateBlock() {
            this.renderCounter();
            this.updateTheme();
        }
        async updateCounterData() {
            if (this._data.apiEndpoint === this.apiEndpoint) {
                this.onUpdateBlock();
                return;
            }
            const apiEndpoint = this._data.apiEndpoint;
            this.apiEndpoint = apiEndpoint;
            if (apiEndpoint) {
                this.loadingElm.visible = true;
                const data = await index_1.callAPI(apiEndpoint);
                this.loadingElm.visible = false;
                if (data && this._data.apiEndpoint === apiEndpoint) {
                    this.counterData = data;
                    this.onUpdateBlock();
                    return;
                }
            }
            this.counterData = [];
            this.onUpdateBlock();
        }
        formatCounter(num, decimals) {
            return index_1.formatNumberWithSeparators(num, decimals);
        }
        renderCounter() {
            if (!this.counterElm && this._data.options)
                return;
            const { title, description, counterColName, counterLabel, stringDecimal, stringPrefix, stringSuffix, coloredNegativeValues, coloredPositiveValues } = this._data.options;
            this.lbTitle.caption = title;
            this.lbDescription.caption = description;
            this.counterElm.height = `calc(100% - ${this.hStackInfo.offsetHeight + 30}px)`;
            this.counterElm.clearInnerHTML();
            if (this.counterData && this.counterData.length) {
                const value = this.counterData[0][counterColName];
                const isNumber = typeof value === 'number';
                let _number = isNumber ? (Number(value) / 100) : 0;
                const lbValue = new components_3.Label(this.counterElm, {
                    caption: `${stringPrefix || ''}${isNumber ? 0 : value}${stringSuffix || ''}`,
                    font: {
                        size: '32px',
                        color: Theme.colors.primary.main
                    }
                });
                lbValue.wordBreak = 'break-all';
                if (isNumber) {
                    const increment = Number(value) / 20;
                    let interval = setInterval(() => {
                        _number += increment;
                        if (_number >= Number(value)) {
                            _number = Number(value);
                            clearInterval(interval);
                        }
                        lbValue.caption = `${stringPrefix || ''}${this.formatCounter(_number, stringDecimal)}${stringSuffix || ''}`;
                    }, 25);
                }
            }
            if (counterLabel) {
                new components_3.Label(this.counterElm, {
                    caption: counterLabel,
                    font: { size: '18px', color: Theme.colors.primary.dark }
                });
            }
        }
        resizeCounter() {
            this.renderCounter();
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            this.classList.add(index_css_1.counterStyle);
            const { width, height, darkShadow } = this.tag || {};
            this.width = width || 700;
            this.height = height || 200;
            this.maxWidth = '100%';
            this.vStackCounter.style.boxShadow = darkShadow ? '0 -2px 10px rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
            const data = this.getAttribute('data', true);
            if (data) {
                this.setData(data);
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
            return (this.$render("i-vstack", { id: "vStackCounter", position: "relative", background: { color: Theme.background.main }, gap: 20, height: "100%", padding: { top: 10, bottom: 10, left: 10, right: 10 }, class: index_css_1.containerStyle },
                this.$render("i-vstack", { id: "loadingElm", class: "i-loading-overlay" },
                    this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                        this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_1.default.fullPath('img/loading.svg'), width: 36, height: 36 } }))),
                this.$render("i-hstack", { id: "hStackInfo", gap: "10", width: "100%", maxWidth: "100%", margin: { left: 'auto', right: 'auto' }, verticalAlignment: "center", wrap: "wrap" },
                    this.$render("i-label", { id: "lbTitle", font: { bold: true, color: Theme.text.primary } }),
                    this.$render("i-label", { id: "lbDescription", font: { color: Theme.text.primary } })),
                this.$render("i-vstack", { id: "counterElm", margin: { top: 16, bottom: 32 }, horizontalAlignment: "center", width: "100%", height: "100%", class: "text-center" })));
        }
    };
    ScomCounter = __decorate([
        components_3.customModule,
        components_3.customElements('i-scom-counter')
    ], ScomCounter);
    exports.default = ScomCounter;
});
