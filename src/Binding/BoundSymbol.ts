import { BoundNodes } from './Node/BoundNode';
import { BoundDeclarations } from './Node/Declaration/BoundDeclarations';

export class BoundSymbol {
    constructor(
        public name: string,
        readonly declaration: BoundDeclarations,
    ) { }

    readonly references: BoundNodes[] = [];
}

export class BoundSymbolTable extends Map<string, BoundSymbol> { }
