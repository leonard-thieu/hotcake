import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { isNode } from '../../Node';
import { NodeKind } from '../../NodeKind';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternFunctionDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternFunctionDeclaration)[] = [
        'functionKeyword',
        'identifier',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternFunctionDeclaration;

    functionKeyword: FunctionKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeDeclaration = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: ParseContextElementDelimitedSequence<ParseContextKind.DataDeclarationSequence> = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;

    get firstToken() {
        return this.functionKeyword;
    }

    get lastToken() {
        if (this.nativeSymbol) {
            if (isNode(this.nativeSymbol)) {
                return this.nativeSymbol.lastToken;
            }

            return this.nativeSymbol;
        }

        return this.closingParenthesis;
    }
}