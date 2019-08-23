import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';
import { BoundDeclarations } from './Node/Declaration/BoundDeclarations';

export class BoundSymbol {
    constructor(
        public name: string,
        readonly declaration: BoundDeclarations,
    ) { }

    readonly references: BoundNodes[] = [];
}

export const ANONYMOUS_NAME = '';

export class BoundSymbolTable {
    private readonly _values = new Set<BoundSymbol>();
    private anonymousSymbolCount = 0;

    set(value: BoundSymbol): void {
        let key = value.name;

        if (key === ANONYMOUS_NAME) {
            this.anonymousSymbolCount++;

            if (this.anonymousSymbolCount > 1) {
                key += this.anonymousSymbolCount;
            }

            value.name = key;
        }

        this._values.add(value);
    }

    get<TKind extends BoundSymbol['declaration']['kind']>(
        key: string,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        const vals = Array.from(this._values).filter((value) =>
            areIdentifiersSame(key, value.name)
        );

        if (!vals.length) {
            return;
        }

        if (vals.length > 1) {
            throw new Error(`Multiple declarations found for '${key}'.`);
        }

        let value = vals[0];
        while (value.declaration.kind === BoundNodeKind.AliasDirective) {
            value = value.declaration.target.identifier;
        }

        if (kinds.length) {
            for (const kind of kinds) {
                if (value.declaration.kind === kind) {
                    return value.declaration;
                }
            }

            throw new Error(`Expected '${key}' to be '${kinds.join(', ')}' but got '${value.declaration.kind}'.`);
        }

        return value.declaration;
    }

    [Symbol.iterator]() {
        return this._values[Symbol.iterator]();
    }
}

export function normalizeIdentifier(key: string) {
    switch (key.toLowerCase()) {
        case 'new': { return 'New'; }
    }

    return key;
}

export function areIdentifiersSame(identifier1: string, identifier2: string) {
    return normalizeIdentifier(identifier1) === normalizeIdentifier(identifier2);
}
