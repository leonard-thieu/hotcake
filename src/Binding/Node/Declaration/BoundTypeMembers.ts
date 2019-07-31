import { BoundNodes } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundTypeMembers<TBoundNode extends BoundNodes> extends Map<string, TBoundNode> {
    get(key: string, ...kinds: BoundNodeKind[]): TBoundNode | undefined {
        const value = super.get(key);

        if (value &&
            kinds.length &&
            !kinds.includes(value.kind)
        ) {
            throw new Error(`Member is not expected kind (expected: '${kinds.join(', ')}', got: '${value.kind}').`);
        }

        return value;
    }

    set(key: string, value: TBoundNode): this {
        const existingValue = this.get(key);
        if (existingValue &&
            existingValue !== value
        ) {
            throw new Error(`Member already exists.`);
        }

        return super.set(key, value);
    }
}
