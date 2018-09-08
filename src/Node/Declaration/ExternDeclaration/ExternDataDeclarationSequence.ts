import { ParseContextElementArray } from '../../../ParserBase';
import { FieldKeywordToken, GlobalKeywordToken, IdentifierToken } from '../../../Token/Token';
import { NodeKind } from '../../NodeKind';
import { Declaration } from '../Declaration';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternDataDeclarationSequence extends Declaration {
    static CHILD_NAMES: (keyof ExternDataDeclarationSequence)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.ExternDataDeclarationSequence;

    dataDeclarationKeyword: ExternDataDeclarationKeywordToken;
    children: ParseContextElementArray<ExternDataDeclarationSequence['kind']>;
}

export type ExternDataDeclarationKeywordToken =
    GlobalKeywordToken |
    FieldKeywordToken
    ;

export class ExternDataDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternDataDeclaration)[] = [
        'name',
        'type',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternDataDeclaration;

    name: IdentifierToken;
    type: TypeDeclaration | null = null;
}
