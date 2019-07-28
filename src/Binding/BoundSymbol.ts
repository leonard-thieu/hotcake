import { assertNever } from '../assertNever';
import { BoundNodes } from './Node/BoundNode';
import { BoundNodeKind } from './Node/BoundNodeKind';
import { BoundTypedDeclarations } from './Node/Declaration/BoundDeclarations';
import { FunctionLikeGroupType, isFunctionLike } from './Type/FunctionLikeType';
import { TypeKind } from './Type/TypeKind';
import { IntrinsicType } from './Type/Types';

export class BoundSymbol {
    constructor(
        public name: string,
        typeOrDeclaration: IntrinsicType | BoundTypedDeclarations,
    ) {
        switch (typeOrDeclaration.kind) {
            case TypeKind.Bool:
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.Array:
            case TypeKind.Void: {
                this._type = typeOrDeclaration;
                break;
            }
            default: {
                this.declarations.push(typeOrDeclaration);

                if (isFunctionLike(typeOrDeclaration)) {
                    this._type = new FunctionLikeGroupType();
                    this._type.identifier = this;

                    switch (typeOrDeclaration.kind) {
                        case BoundNodeKind.ExternFunctionDeclaration:
                        case BoundNodeKind.FunctionDeclaration: {
                            this._type.isMethod = false;
                            break;
                        }
                        case BoundNodeKind.ExternClassMethodDeclaration:
                        case BoundNodeKind.InterfaceMethodDeclaration:
                        case BoundNodeKind.ClassMethodDeclaration: {
                            this._type.isMethod = true;
                            break;
                        }
                        default: {
                            assertNever(typeOrDeclaration);
                            break;
                        }
                    }
                }
                break;
            }
        }
    }

    readonly declarations: BoundTypedDeclarations[] = [];
    readonly references: BoundNodes[] = [];

    get declaration(): BoundTypedDeclarations | undefined {
        return this.declarations[0];
    }

    private _type?: IntrinsicType | FunctionLikeGroupType;

    get type() {
        if (this._type) {
            return this._type;
        }

        return this.declaration!.type;
    }
}

export class BoundSymbolTable extends Map<string, BoundSymbol> { }
