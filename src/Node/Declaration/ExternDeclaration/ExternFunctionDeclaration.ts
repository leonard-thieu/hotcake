import { ParseContextElementArray, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, FunctionKeywordToken, IdentifierToken, OpeningParenthesisToken } from '../../../Token/Token';
import { NodeKind } from '../../NodeKind';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternFunctionDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternFunctionDeclaration)[] = [
        'functionKeyword',
        'name',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternFunctionDeclaration;

    functionKeyword: FunctionKeywordToken;
    name: MissableToken<IdentifierToken>;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: MissableToken<OpeningParenthesisToken>;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: MissableToken<ClosingParenthesisToken>;
}
