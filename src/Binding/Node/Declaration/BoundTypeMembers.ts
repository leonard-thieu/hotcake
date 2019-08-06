import { BoundIdentifiableDeclaration } from '../../BoundSymbol';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundTypeMembers<TMember extends BoundIdentifiableDeclaration> extends Map<string, TMember> {
    get(key: string, ...kinds: BoundNodeKind[]): TMember | undefined {
        const value = super.get(key);

        if (value &&
            kinds.length &&
            !kinds.includes(value.kind)
        ) {
            throw new Error(`Member is not expected kind (expected: '${kinds.join(', ')}', got: '${value.kind}').`);
        }

        return value;
    }

    set(value: TMember): this;
    set(key: string, value: TMember): this;
    set(key_value: string | TMember, value?: TMember): this {
        let key: string;

        if (typeof key_value !== 'string') {
            key = key_value.identifier.name;
            value = key_value;
        } else {
            key = key_value;
            value = value!;
        }

        const existingValue = this.get(key);
        if (existingValue &&
            existingValue !== value
        ) {
            throw new Error(`Member already exists.`);
        }

        return super.set(key, value);
    }

    toJSON() {
        return Array.from(this.values());
    }
}
