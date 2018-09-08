import { ParseContextElementArray, ParseContextKind } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, IdentifierToken, MethodKeywordToken, OpeningParenthesisToken } from '../../../Token/Token';
import { NodeKind } from '../../NodeKind';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternClassMethodDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternClassMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'attributes',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternClassMethodDeclaration;

    methodKeyword: MethodKeywordToken;
    name: MissableToken<IdentifierToken>;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: MissableToken<OpeningParenthesisToken>;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: MissableToken<ClosingParenthesisToken>;
    attributes: ParseContextElementArray<ParseContextKind.ClassMethodAttributes>;
}
