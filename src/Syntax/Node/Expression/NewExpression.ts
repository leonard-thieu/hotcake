import { MissingToken } from '../../Token/MissingToken';
import { NewKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { TypeReference } from '../TypeReference';
import { Expression } from './Expressions';

export const NewExpressionChildNames: ReadonlyArray<keyof NewExpression> = [
    'newlines',
    'newKeyword',
    'type',
];

export class NewExpression extends Expression {
    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken = undefined!;
    type: TypeReference | MissingToken = undefined!;
}
