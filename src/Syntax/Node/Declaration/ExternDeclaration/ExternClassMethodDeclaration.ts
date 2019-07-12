import { ParseContextElementSequence, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, MethodKeywordToken, OpeningParenthesisToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { isNode } from '../../Node';
import { NodeKind } from '../../NodeKind';
import { DataDeclarationSequence } from '../DataDeclarationSequence';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternClassMethodDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternClassMethodDeclaration)[] = [
        'methodKeyword',
        'identifier',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'attributes',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeDeclaration = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: ParseContextElementSequence<ParseContextKind.ClassMethodAttributes> = undefined!;

    get firstToken() {
        return this.methodKeyword;
    }

    get lastToken() {
        if (this.nativeSymbol) {
            if (isNode(this.nativeSymbol)) {
                return this.nativeSymbol.lastToken;
            }

            return this.nativeSymbol;
        }

        if (this.attributes.length !== 0) {
            return this.attributes[this.attributes.length - 1];
        }

        return this.closingParenthesis;
    }
}
