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

    aliasKeyword: AliasKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<AliasDirectiveSequence['kind']> = undefined!;
}

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'identifier',
        'equalsSign',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    identifier: Identifier = undefined!;
    equalsSign: MissableToken<EqualsSignToken> = undefined!;
    target: MissableTypeReference = undefined!;
}
