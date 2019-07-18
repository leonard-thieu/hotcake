import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, EndKeywordToken, MethodKeywordToken, NewKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';

export const ClassMethodDeclarationChildNames: ReadonlyArray<keyof ClassMethodDeclaration> = [
    'methodKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'attributes',
    'statements',
    'endKeyword',
    'endMethodKeyword',
];

export class ClassMethodDeclaration extends Declaration {
    readonly kind = NodeKind.ClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: NewKeywordToken | MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: ParseContextElementSequence<ParseContextKind.ClassMethodAttributes> = undefined!;
    statements?: ParseContextElementArray<ClassMethodDeclaration['kind']> = undefined;
    endKeyword?: MissableToken<EndKeywordToken> = undefined;
    endMethodKeyword?: MethodKeywordToken = undefined;
}
