import { MissableToken } from '../../../Token/MissingToken';
import { AbstractKeywordToken, ClosingParenthesisToken, FinalKeywordToken, MethodKeywordToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { DataDeclarationSequence } from '../DataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclaration';

export const ExternClassMethodDeclarationChildNames: ReadonlyArray<keyof ExternClassMethodDeclaration> = [
    'methodKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'attributes',
    'equalsSign',
    'nativeSymbol',
];

export class ExternClassMethodDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: (AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken)[] = undefined!;
}
