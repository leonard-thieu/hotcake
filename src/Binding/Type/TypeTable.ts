import { normalizeIdentifier } from '../BoundSymbol';
import { Types } from './Types';

export class TypeTable extends Map<string, Types> {
    get(key: string): Types | undefined {
        key = normalizeIdentifier(key);

        return super.get(key);
    }

    set(key: string, value: Types): this {
        if (this.has(key)) {
            console.error(`A member named '${key}' has already been added.`);
        }

        key = normalizeIdentifier(key);

        return super.set(key, value);
    }
}
