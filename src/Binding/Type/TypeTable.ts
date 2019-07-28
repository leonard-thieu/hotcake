import { Types } from './Types';

export class TypeTable extends Map<string, Types> {
    get(key: string): Types | undefined {
        if (isReservedIdentifier(key)) {
            return super.get(key.toLowerCase());
        }

        return super.get(key);
    }

    set(key: string, value: Types): this {
        if (this.has(key)) {
            console.error(`A member named '${key}' has already been added.`);
        }

        if (isReservedIdentifier(key)) {
            return super.set(key.toLowerCase(), value);
        }

        return super.set(key, value);
    }
}

function isReservedIdentifier(key: string) {
    switch (key.toLowerCase()) {
        case 'new': {
            return true;
        }
    }

    return false;
}
