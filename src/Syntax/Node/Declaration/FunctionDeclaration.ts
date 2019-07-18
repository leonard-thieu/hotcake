import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, EndKeywordToken, FunctionKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';

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
    statements: ParseContextElementArray<FunctionDeclaration['kind']> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endFunctionKeyword?: FunctionKeywordToken = undefined;
}
