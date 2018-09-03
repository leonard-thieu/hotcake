import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ClosingParenthesisToken, ColonToken, IdentifierToken, MethodKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class InterfaceMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: MethodKeywordToken;
    name: IdentifierToken;
    colon: ColonToken | null = null;
    returnType: TypeReference | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: ClosingParenthesisToken;
}
