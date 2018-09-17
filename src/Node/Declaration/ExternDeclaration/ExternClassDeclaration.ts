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

    classKeyword: ClassKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseType?: MissableTypeReference | NullKeywordToken = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ParseContextElementArray<ExternClassDeclaration['kind']> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;

    get firstToken() {
        return this.classKeyword;
    }

    get lastToken() {
        if (this.endClassKeyword) {
            return this.endClassKeyword;
        }

        return this.endKeyword;
    }
}
