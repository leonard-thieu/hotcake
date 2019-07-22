import { BoundSymbolTable } from '../../../../Binding/BoundSymbol';
import { MissableToken } from '../../../Token/MissingToken';
import { ClosingParenthesisToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { DataDeclarationSequence } from '../DataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclaration';

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
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;

    locals = new BoundSymbolTable();
}
