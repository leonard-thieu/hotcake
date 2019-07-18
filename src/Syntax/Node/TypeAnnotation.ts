import { ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { ColonToken, DollarSignToken, NumberSignToken, PercentSignToken, QuestionMarkToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';
import { MissableTypeReference } from './TypeReference';

export type TypeAnnotation =
    | ShorthandTypeAnnotation
    | LonghandTypeAnnotation
    ;

export class ShorthandTypeAnnotation extends Node {
    readonly kind = NodeKind.ShorthandTypeAnnotation;

    shorthandType?: ShorthandTypeToken = undefined;
    arrayTypeAnnotations: ParseContextElementSequence<ParseContextKind.ArrayTypeAnnotationList> = undefined!;
}

export type ShorthandTypeToken =
    | QuestionMarkToken
    | PercentSignToken
    | NumberSignToken
    | DollarSignToken
    ;

export class LonghandTypeAnnotation extends Node {
    readonly kind = NodeKind.LonghandTypeAnnotation;

    colon: ColonToken = undefined!;
    typeReference: MissableTypeReference = undefined!;
}
