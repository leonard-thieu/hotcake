import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IdentifierExpression extends Expression {
    static CHILD_NAMES: (keyof IdentifierExpression)[] = [
        'newlines',
        'globalScopeMemberAccessOperator',
        'name',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
    ];

    readonly kind = NodeKind.IdentifierExpression;

    globalScopeMemberAccessOperator: Token | null = null;
    name: Token;

    // Generic type arguments
    lessThanSign: Token | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: Token | null = null;
}
