import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ClosingParenthesisToken, EndKeywordToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../Token/Tokens';
import { MissableIdentifier } from '../Identifier';
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
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endFunctionKeyword?: FunctionKeywordToken = undefined;
}
