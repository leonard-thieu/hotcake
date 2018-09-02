import { AliasKeywordToken, EqualsSignToken, IdentifierToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'aliasKeyword',
        'name',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    aliasKeyword: AliasKeywordToken;
    name: IdentifierToken;
    equalsSign: EqualsSignToken;
    target: TypeReference;
}
