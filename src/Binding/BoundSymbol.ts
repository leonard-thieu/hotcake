import { BoundNodes } from './Node/BoundNode';
import { BoundDeclarations } from './Node/Declaration/BoundDeclarations';

export class BoundSymbol {
    constructor(
        public name: string,
        readonly declaration: BoundIdentifiableDeclaration,
    ) { }

    readonly references: BoundNodes[] = [];
}

export type BoundIdentifiableDeclaration = Extract<BoundDeclarations, { identifier: BoundSymbol; }>;

export const ANONYMOUS_NAME = '';

export class BoundSymbolTable extends Map<string, BoundSymbol> {
    get(key: string): BoundSymbol | undefined {
        key = normalizeIdentifier(key);

        return super.get(key);
    }

    private anonymousSymbolCount = 0;

    set(value: BoundSymbol): this;
    set(key: string, value: BoundSymbol): this;
    set(key_value: string | BoundSymbol, value?: BoundSymbol): this {
        let key: string;

        if (typeof key_value === 'string') {
            key = key_value;
            value = value as BoundSymbol;
        } else {
            key = key_value.name;
            value = key_value;
        }

        if (key === ANONYMOUS_NAME) {
            this.anonymousSymbolCount++;

            if (this.anonymousSymbolCount > 1) {
                key += this.anonymousSymbolCount;
            }
        } else {
            key = normalizeIdentifier(key);

            const existingSymbol = this.get(key);
            if (existingSymbol) {
                throw new Error(`Duplicate symbol '${key}'.`);
            }
        }

        value.name = key;

        return super.set(key, value);
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
