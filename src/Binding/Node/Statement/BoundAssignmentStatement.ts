import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundAssignmentStatement extends BoundNode {
    readonly kind = BoundNodeKind.AssignmentStatement;

    leftOperand: BoundExpressions = undefined!;
    operator: BoundAssignmentStatementOperator = undefined!;
    rightOperand: BoundExpressions = undefined!;
}

export enum BoundAssignmentStatementOperator {
    BitwiseOrUpdateAssignment = 'BitwiseOrUpdateAssignment',
    BitwiseXorUpdateAssignment = 'BitwiseXorUpdateAssignment',
    BitwiseAndUpdateAssignment = 'BitwiseAndUpdateAssignment',
    SubtractionUpdateAssignment = 'SubtractionUpdateAssignment',
    AdditionUpdateAssignment = 'AdditionUpdateAssignment',
    BitwiseShiftRightUpdateAssignment = 'BitwiseShiftRightUpdateAssignment',
    BitwiseShiftLeftUpdateAssignment = 'BitwiseShiftLeftUpdateAssignment',
    ModulusUpdateAssignment = 'ModulusUpdateAssignment',
    DivisionUpdateAssignment = 'DivisionUpdateAssignment',
    MultiplicationUpdateAssignment = 'MultiplicationUpdateAssignment',
    Assignment = 'Assignment',
}

export type UpdateAssignmentOperator =
    | BoundAssignmentStatementOperator.BitwiseOrUpdateAssignment
    | BoundAssignmentStatementOperator.BitwiseXorUpdateAssignment
    | BoundAssignmentStatementOperator.BitwiseAndUpdateAssignment
    | BoundAssignmentStatementOperator.SubtractionUpdateAssignment
    | BoundAssignmentStatementOperator.AdditionUpdateAssignment
    | BoundAssignmentStatementOperator.BitwiseShiftRightUpdateAssignment
    | BoundAssignmentStatementOperator.BitwiseShiftLeftUpdateAssignment
    | BoundAssignmentStatementOperator.ModulusUpdateAssignment
    | BoundAssignmentStatementOperator.DivisionUpdateAssignment
    | BoundAssignmentStatementOperator.MultiplicationUpdateAssignment
    ;
