import { Module, customModule, Container } from '@ijstech/components';
import ScomCounter from '@scom/scom-counter';

@customModule
export default class Module1 extends Module {
    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-scom-counter
                margin={{ left: 'auto', right: 'auto' }}
                data={{
                    apiEndpoint: "/dune/query/2030584",
                    options: {
                        title: 'Ethereum Beacon Chain Deposits',
                        counterColName: 'deposited',
                        counterLabel: 'ETH deposited'
                    }
                }}
            />
        </i-panel>
    }
}