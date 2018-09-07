import { MissableToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, IdentifierToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
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
    name: MissableToken<IdentifierToken>;
    equalsSign: MissableToken<EqualsSignToken>;
    target: MissableTypeReference;
}
