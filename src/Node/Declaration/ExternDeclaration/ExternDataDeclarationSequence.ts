import { ParseContextElementArray } from '../../../ParserBase';
import { FieldKeywordToken, GlobalKeywordToken } from '../../../Token/Token';
import { Identifier } from '../../Identifier';
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
        'identifier',
        'type',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternDataDeclaration;

    identifier: Identifier;
    type: TypeDeclaration | null = null;
}
