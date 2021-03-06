import { ReturnKeywordToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ReturnStatementChildNames: ReadonlyArray<keyof ReturnStatement> = [
    'returnKeyword',
    'expression',
    'terminator',
];

export class ReturnStatement extends Statement {
    readonly kind = NodeKind.ReturnStatement;

    returnKeyword: ReturnKeywordToken = undefined!;
    expression?: Expressions = undefined!;
}
