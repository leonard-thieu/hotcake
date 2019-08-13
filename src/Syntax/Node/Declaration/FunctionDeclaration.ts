import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ClosingParenthesisToken, EndKeywordToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../Token/Tokens';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { Statements } from '../Statement/Statements';
import { TypeAnnotation } from '../TypeAnnotation';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declarations';

export const FunctionDeclarationChildNames: ReadonlyArray<keyof FunctionDeclaration> = [
    'functionKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'statements',
    'endKeyword',
    'endFunctionKeyword',
];

export class FunctionDeclaration extends Declaration {
    readonly kind = NodeKind.FunctionDeclaration;

    functionKeyword: FunctionKeywordToken = undefined!;
    identifier: Identifier | MissingToken = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: OpeningParenthesisToken | MissingToken = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: ClosingParenthesisToken | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: EndKeywordToken | MissingToken = undefined!;
    endFunctionKeyword?: FunctionKeywordToken = undefined;
}
