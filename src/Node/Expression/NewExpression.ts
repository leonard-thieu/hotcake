import { ParseContextElementArray } from '../../Parser';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { QualifiedIdentifier } from '../QualifiedIdentifier';
import { Expression } from './Expression';

export class NewExpression extends Expression {
    static CHILD_NAMES: (keyof NewExpression)[] = [
        'newKeyword',
        'type',
        'openingParenthesis',
        'arguments',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.NewExpression;

    newKeyword: Token;
    type: QualifiedIdentifier;
    openingParenthesis: Token | null;
    arguments: ParseContextElementArray<any>;
    closingParenthesis: Token | null;
}
