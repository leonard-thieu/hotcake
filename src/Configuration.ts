export interface ConfigurationVariables {
    HOST: string;
    LANG: string;
    TARGET: string;
    CONFIG: string;

    [key: string]: any;
}

export class ConfigurationVariableMap extends Map<string, any> {
    get(key: string): any {
        let value = super.get(key);
        if (typeof value === 'undefined') {
            value = '';
        }

        return value;
    }
}
