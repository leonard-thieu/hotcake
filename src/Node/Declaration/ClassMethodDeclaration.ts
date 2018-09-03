import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { AbstractKeywordToken, ClosingParenthesisToken, EndKeywordToken, FinalKeywordToken, IdentifierToken, MethodKeywordToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class ClassMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassMethodDeclaration)[] = [
        'methodKeyword',
        'name',
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
    returnType: TypeDeclaration | null = null;
    openingParenthesis: OpeningParenthesisToken;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: ClosingParenthesisToken;
    attributes: Array<AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken> = [];
    statements: ParseContextElementArray<ClassMethodDeclaration['kind']> | null = null;
    endKeyword: EndKeywordToken | null = null;
    endMethodKeyword: MethodKeywordToken | null = null;
}
