import { BoundNodes } from './Node/BoundNode';
import { BoundTypedDeclarations } from './Node/Declaration/BoundDeclarations';
import { FunctionLikeGroupType, isFunctionLike } from './Type/FunctionLikeType';

export class BoundSymbol {
    constructor(
        public name: string,
        declaration: BoundTypedDeclarations,
    ) {
        this.declarations.push(declaration);

        if (isFunctionLike(declaration)) {
            this.functionLikeGroupType = new FunctionLikeGroupType(this);
        }
    }

    readonly declarations: BoundTypedDeclarations[] = [];
    readonly references: BoundNodes[] = [];

    get declaration(): BoundTypedDeclarations {
        return this.declarations[0];
    }

    private functionLikeGroupType?: FunctionLikeGroupType;

    get type() {
        if (this.functionLikeGroupType) {
            return this.functionLikeGroupType;
        }

        return this.declaration.type;
    }
}

export class BoundSymbolTable extends Map<string, BoundSymbol> { }
