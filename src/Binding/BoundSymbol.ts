import { BoundNode } from './Node/BoundNode';
import { BoundDeclarations } from './Node/Declaration/BoundDeclarations';

export class BoundSymbol {
    constructor(
        public name: string,
        public declaration: BoundDeclarations,
    ) { }

    readonly references: BoundNode[] = [];
}

export class BoundSymbolTable extends Map<string, BoundSymbol> { }
