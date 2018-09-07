import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, IdentifierToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class AliasDirectiveSequence extends Declaration {
    static CHILD_NAMES: (keyof AliasDirectiveSequence)[] = [
        'aliasKeyword',
        'children',
    ];

    readonly kind = NodeKind.AliasDirectiveSequence;

    aliasKeyword: AliasKeywordToken;
    children: ParseContextElementArray<AliasDirectiveSequence['kind']>;
}

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'name',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    name: IdentifierToken;
    equalsSign: MissableToken<EqualsSignToken>;
    target: MissableTypeReference;
}
