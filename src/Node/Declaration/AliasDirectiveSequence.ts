import { ParseContextElementDelimitedSequence } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken } from '../../Token/Token';
import { Identifier } from '../Identifier';
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
    children: ParseContextElementDelimitedSequence<AliasDirectiveSequence['kind']>;
}

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'identifier',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    identifier: Identifier;
    equalsSign: MissableToken<EqualsSignToken>;
    target: MissableTypeReference;
}
