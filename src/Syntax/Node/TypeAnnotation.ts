import { ColonToken, DollarSignToken, NumberSignToken, PercentSignToken, QuestionMarkToken } from '../Token/Tokens';
import { ArrayTypeAnnotation } from './ArrayTypeAnnotation';
import { Node } from './Node';
import { NodeKind } from './NodeKind';
import { MissableTypeReference } from './TypeReference';

export type TypeAnnotation =
    | ShorthandTypeAnnotation
    | LonghandTypeAnnotation
    ;

// #region Shorthand type annotation

export const ShorthandTypeAnnotationChildNames: ReadonlyArray<keyof ShorthandTypeAnnotation> = [
    'shorthandType',
    'arrayTypeAnnotations',
];

export class ShorthandTypeAnnotation extends Node {
    readonly kind = NodeKind.ShorthandTypeAnnotation;

    shorthandType?: ShorthandTypeToken = undefined;
    arrayTypeAnnotations: ArrayTypeAnnotation[] = undefined!;
}

export type ShorthandTypeToken =
    | QuestionMarkToken
    | PercentSignToken
    | NumberSignToken
    | DollarSignToken
    ;

// #endregion

// #region Longhand type annotation

export const LonghandTypeAnnotationChildNames: ReadonlyArray<keyof LonghandTypeAnnotation> = [
    'colon',
    'typeReference',
];

export class LonghandTypeAnnotation extends Node {
    readonly kind = NodeKind.LonghandTypeAnnotation;

    colon: ColonToken = undefined!;
    typeReference: MissableTypeReference = undefined!;
}

// #endregion
