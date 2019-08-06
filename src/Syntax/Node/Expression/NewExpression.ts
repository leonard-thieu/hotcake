import { NewKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Expression } from './Expression';

export const NewExpressionChildNames: ReadonlyArray<keyof NewExpression> = [
    'newlines',
    'newKeyword',
    'type',
];

export class NewExpression extends Expression {
    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken = undefined!;
    type: MissableTypeReference = undefined!;
}
