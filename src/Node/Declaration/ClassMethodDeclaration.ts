import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { AbstractKeywordToken, ClosingParenthesisToken, ColonToken, EndKeywordToken, FinalKeywordToken, IdentifierToken, MethodKeywordToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class ClassMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
        'attributes',
        'statements',
        'endKeyword',
        'endMethodKeyword',
    ];

    readonly kind = NodeKind.ClassMethodDeclaration;

    methodKeyword: MethodKeywordToken;
    name: IdentifierToken;
    colon: ColonToken | null = null;
    returnType: TypeReference | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: ClosingParenthesisToken;
    attributes: Array<AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken> = [];
    statements: ParseContextElementArray<ClassMethodDeclaration['kind']> | null = null;
    endKeyword: EndKeywordToken | null = null;
    endMethodKeyword: MethodKeywordToken | null = null;
}
