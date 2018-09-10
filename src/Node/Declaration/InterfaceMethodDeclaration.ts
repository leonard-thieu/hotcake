import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, MethodKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class InterfaceMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'identifier',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: MethodKeywordToken;
    identifier: MissableIdentifier;
    returnType: TypeDeclaration | null = null;
    openingParenthesis: MissableToken<OpeningParenthesisToken>;
    parameters: ParseContextElementDelimitedSequence<ParseContextKind.DataDeclarationSequence>;
    closingParenthesis: MissableToken<ClosingParenthesisToken>;
}
