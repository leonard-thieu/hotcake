import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ClosingParenthesisToken, IdentifierToken, MethodKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class InterfaceMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: MethodKeywordToken;
    name: IdentifierToken;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: ClosingParenthesisToken;
}
