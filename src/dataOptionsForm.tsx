import {
    Module,
    customModule,
    ControlElement,
    customElements,
    Container,
    Form,
    Input
} from '@ijstech/components'

interface IData {
    options: any
}

interface ScomCounterDataOptionsFormElement extends ControlElement {
    jsonSchema?: any;
    counterColName?: string;
    counterLabel?: string;
    stringDecimal?: number;
    stringPrefix?: string;
    stringSuffix?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-scom-counter-data-options-form"]: ScomCounterDataOptionsFormElement;
        }
    }
}

@customModule
@customElements('i-scom-counter-data-options-form')
export default class ScomCounterDataOptionsForm extends Module {
    private formEl: Form;
    private _jsonSchema: any;
    private _data: IData;

    constructor(parent?: Container, options?: any) {
        super(parent, options)
    }

    get data() {
        return this._data
    }
    set data(value: IData) {
        this._data = value
        this.renderUI()
    }

    async refreshFormData() {
        this._data = await this.formEl.getFormData();
        return this._data;
    }

    private renderUI() {
        this.formEl.clearInnerHTML()
        this.formEl.jsonSchema = this._jsonSchema;
        this.formEl.formOptions = {
            columnWidth: '100%',
            columnsPerRow: 1,
            confirmButtonOptions: {
                hide: true
            }
        }
        this.formEl.renderForm()
        this.formEl.clearFormData()
        this.formEl.setFormData(this._data)

        const inputs = this.formEl.querySelectorAll('[scope]')
        for (let input of inputs) {
            const inputEl = input as Input
            inputEl.onChanged = this.onInputChanged
        }
    }

    private async onInputChanged() {
        const data = await this.formEl.getFormData()
        await this.onCustomInputChanged(data);
    }

    async onCustomInputChanged(data: IData) {
    }

    async init() {
        super.init()
        this.onInputChanged = this.onInputChanged.bind(this);
        const jsonSchema = this.getAttribute('jsonSchema', true);
        this._jsonSchema = jsonSchema;
        const counterColName = this.getAttribute('counterColName', true, '')
        const counterLabel = this.getAttribute('counterLabel', true, '')
        const stringDecimal = this.getAttribute('stringDecimal', true, 0)
        const stringPrefix = this.getAttribute('stringPrefix', true, '')
        const stringSuffix = this.getAttribute('stringSuffix', true, '')
        this.data = {
            options: {
                counterColName,
                counterLabel,
                stringDecimal,
                stringPrefix,
                stringSuffix
            }
        }
    }

    render() {
        return (
            <i-panel>
                <i-vstack gap='0.5rem'>
                    <i-panel id='pnlForm'>
                        <i-form id='formEl'></i-form>
                    </i-panel>
                </i-vstack>
            </i-panel>
        )
    }
}
