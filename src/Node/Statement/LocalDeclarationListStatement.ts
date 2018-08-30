import { DataDeclarationList } from '../Declaration/DataDeclarationList';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class LocalDeclarationListStatement extends Statement {
    static CHILD_NAMES: (keyof LocalDeclarationListStatement)[] = [
        'localDeclarationList',
        'terminator',
    ];

    readonly kind = NodeKind.LocalDeclarationListStatement;

    localDeclarationList: DataDeclarationList;
}
