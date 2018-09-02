import { ParseContextElementArray } from '../../ParserBase';
import { ClosingParenthesisToken, ColonToken, EndKeywordToken, FunctionKeywordToken, IdentifierToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { DataDeclarationList } from './DataDeclarationList';
import { Declaration } from './Declaration';

export class FunctionDeclaration extends Declaration {
    static CHILD_NAMES: (keyof FunctionDeclaration)[] = [
        'functionKeyword',
        'name',
        'colon',
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
    colon: ColonToken | null = null;
    returnType: TypeReference | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: DataDeclarationList;
    closingParenthesis: ClosingParenthesisToken;
    statements: ParseContextElementArray<FunctionDeclaration['kind']>;
    endKeyword: EndKeywordToken;
    endFunctionKeyword: FunctionKeywordToken | null = null;
}
