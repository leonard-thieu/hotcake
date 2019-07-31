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

export class BoundSymbolTable extends Map<string, BoundSymbol> { }

export function areIdentifiersSame(identifier1: string, identifier2: string) {
    const identifier1Lower = identifier1.toLowerCase();
    switch (identifier1Lower) {
        case 'new': {
            const identifier2Lower = identifier2.toLowerCase();

            return identifier1Lower === identifier2Lower;
        }
    }

    return identifier1 === identifier2;
}
