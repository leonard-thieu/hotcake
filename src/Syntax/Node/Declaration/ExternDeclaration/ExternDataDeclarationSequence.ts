import { FieldKeywordToken, GlobalKeywordToken } from '../../../Token/Token';
import { CommaSeparator } from '../../CommaSeparator';
import { Identifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { Declaration } from '../Declaration';
import { ExternDeclaration } from './ExternDeclaration';

// #region Extern data declaration sequence

export const ExternDataDeclarationSequenceChildNames: ReadonlyArray<keyof ExternDataDeclarationSequence> = [
    'dataDeclarationKeyword',
    'children',
];

export class ExternDataDeclarationSequence extends Declaration {
    readonly kind = NodeKind.ExternDataDeclarationSequence;

    dataDeclarationKeyword: ExternDataDeclarationKeywordToken = undefined!;
    children: (ExternDataDeclaration | CommaSeparator)[] = undefined!;
}

export type ExternDataDeclarationKeywordToken =
    | GlobalKeywordToken
    | FieldKeywordToken
    ;

// #endregion

// #region Extern data declaration

export const ExternDataDeclarationChildNames: ReadonlyArray<keyof ExternDataDeclaration> = [
    'identifier',
    'typeAnnotation',
    'equalsSign',
    'nativeSymbol',
];

export class ExternDataDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternDataDeclaration;

    identifier: Identifier = undefined!;
    typeAnnotation?: TypeAnnotation = undefined;
}

// #endregion
