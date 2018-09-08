import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, EndKeywordToken, IdentifierToken, MethodKeywordToken, NewKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
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
    name: MissableToken<IdentifierToken | NewKeywordToken>;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: MissableToken<OpeningParenthesisToken>;
    parameters: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: MissableToken<ClosingParenthesisToken>;
    attributes: ParseContextElementArray<ParseContextKind.ClassMethodAttributes>;
    statements: ParseContextElementArray<ClassMethodDeclaration['kind']> | null = null;
    endKeyword: MissableToken<EndKeywordToken> | null = null;
    endMethodKeyword: MethodKeywordToken | null = null;
}
