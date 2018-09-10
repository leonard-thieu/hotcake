import { ParseContextElementArray } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, NullKeywordToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { MissableTypeReference } from '../../TypeReference';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternClassDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternClassDeclaration)[] = [
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

    readonly kind = NodeKind.ExternClassDeclaration;

    classKeyword: ClassKeywordToken;
    identifier: MissableIdentifier;

    // Extends
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseType: MissableTypeReference | NullKeywordToken | null = null;

    attribute: AbstractKeywordToken | FinalKeywordToken | null = null;

    members: ParseContextElementArray<ExternClassDeclaration['kind']>;
    endKeyword: MissableToken<EndKeywordToken>;
    endClassKeyword: ClassKeywordToken | null = null;
}
