import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ClosingParenthesisToken, EndKeywordToken, FunctionKeywordToken, IdentifierToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class FunctionDeclaration extends Declaration {
    static CHILD_NAMES: (keyof FunctionDeclaration)[] = [
        'functionKeyword',
        'name',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'statements',
        'endKeyword',
        'endFunctionKeyword',
    ];

    readonly kind = NodeKind.FunctionDeclaration;

    functionKeyword: FunctionKeywordToken;
    name: IdentifierToken;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: ClosingParenthesisToken;
    statements: ParseContextElementArray<FunctionDeclaration['kind']>;
    endKeyword: EndKeywordToken;
    endFunctionKeyword: FunctionKeywordToken | null = null;
}
