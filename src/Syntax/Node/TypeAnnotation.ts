import { ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { ColonToken, DollarSignToken, NumberSignToken, PercentSignToken, QuestionMarkToken } from '../Token/Token';
import { isNode, Node } from './Node';
import { NodeKind } from './NodeKind';
import { MissableTypeReference } from './TypeReference';

export type TypeAnnotation =
    | ShorthandTypeAnnotation
    | LonghandTypeAnnotation
    ;

export class ShorthandTypeAnnotation extends Node {
    static CHILD_NAMES: (keyof ShorthandTypeAnnotation)[] = [
        'shorthandType',
        'arrayTypeAnnotations',
    ];

    readonly kind = NodeKind.ShorthandTypeAnnotation;

    shorthandType?: ShorthandTypeToken = undefined;
    arrayTypeAnnotations: ParseContextElementSequence<ParseContextKind.ArrayTypeAnnotationList> = undefined!;

    get firstToken() {
        if (this.shorthandType) {
            return this.shorthandType;
        }

        return this.arrayTypeAnnotations[0].firstToken;
    }

    get lastToken() {
        if (this.arrayTypeAnnotations.length !== 0) {
            return this.arrayTypeAnnotations[this.arrayTypeAnnotations.length - 1].lastToken;
        }

        return this.shorthandType!;
    }
}

export type ShorthandTypeToken =
    | QuestionMarkToken
    | PercentSignToken
    | NumberSignToken
    | DollarSignToken
    ;

export class LonghandTypeAnnotation extends Node {
    static CHILD_NAMES: (keyof LonghandTypeAnnotation)[] = [
        'colon',
        'typeReference',
    ];

    readonly kind = NodeKind.LonghandTypeAnnotation;

    colon: ColonToken = undefined!;
    typeReference: MissableTypeReference = undefined!;

    get firstToken() {
        return this.colon;
    }

    get lastToken() {
        if (isNode(this.typeReference)) {
            return this.typeReference.lastToken;
        }

        return this.typeReference;
    }
}
