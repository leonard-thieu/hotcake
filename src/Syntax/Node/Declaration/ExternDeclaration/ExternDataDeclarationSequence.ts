import { ParseContextElementDelimitedSequence } from '../../../ParserBase';
import { FieldKeywordToken, GlobalKeywordToken } from '../../../Token/Token';
import { Identifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { Declaration } from '../Declaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternDataDeclarationSequence extends Declaration {
    readonly kind = NodeKind.ExternDataDeclarationSequence;

    dataDeclarationKeyword: ExternDataDeclarationKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<ExternDataDeclarationSequence['kind']> = undefined!;
}

export type ExternDataDeclarationKeywordToken =
    | GlobalKeywordToken
    | FieldKeywordToken
    ;

export class ExternDataDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternDataDeclaration;

    identifier: Identifier = undefined!;
    type?: TypeAnnotation = undefined;
}
