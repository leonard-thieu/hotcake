import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { QualifiedIdentifier } from '../QualifiedIdentifier';
import { Declaration } from './Declaration';

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'aliasKeyword',
        'name',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    aliasKeyword: Token;
    name: Token;
    equalsSign: Token;
    target: QualifiedIdentifier;
}
