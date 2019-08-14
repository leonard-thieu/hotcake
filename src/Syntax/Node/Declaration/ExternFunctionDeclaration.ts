import { MissingToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../Token/Tokens';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeAnnotation } from '../TypeAnnotation';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclarations';

export const ExternFunctionDeclarationChildNames: ReadonlyArray<keyof ExternFunctionDeclaration> = [
    'functionKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'equalsSign',
    'nativeSymbol',
];

export class ExternFunctionDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternFunctionDeclaration;

    functionKeyword: FunctionKeywordToken = undefined!;
    identifier: Identifier | MissingToken = undefined!;
    returnType?: TypeAnnotation = undefined!;
    openingParenthesis: OpeningParenthesisToken | MissingToken = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: ClosingParenthesisToken | MissingToken = undefined!;
}
