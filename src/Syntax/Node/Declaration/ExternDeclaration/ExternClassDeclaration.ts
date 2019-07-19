import { ParseContextElementArray, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, NullKeywordToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { MissableTypeReference } from '../../TypeReference';
import { ExternDeclaration } from './ExternDeclaration';

export const ExternClassDeclarationChildNames: ReadonlyArray<keyof ExternClassDeclaration> = [
    'classKeyword',
    'identifier',
    'extendsKeyword',
    'baseType',
    'attribute',
    'equalsSign',
    'nativeSymbol',
    'members',
    'endKeyword',
    'endClassKeyword',
];

export class ExternClassDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternClassDeclaration;

    classKeyword: ClassKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseType?: MissableTypeReference | NullKeywordToken = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ParseContextElementArray<ParseContextKind.ExternClassDeclaration> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;
}
