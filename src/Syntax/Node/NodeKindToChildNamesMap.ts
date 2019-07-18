import { ArrayTypeAnnotationChildNames } from './ArrayTypeAnnotation';
import { CommaSeparatorChildNames } from './CommaSeparator';
import { ConfigurationTagChildNames } from './ConfigurationTag';
import { AccessibilityDirectiveChildNames } from './Declaration/AccessibilityDirective';
import { AliasDirectiveChildNames, AliasDirectiveSequenceChildNames } from './Declaration/AliasDirectiveSequence';
import { ClassDeclarationChildNames } from './Declaration/ClassDeclaration';
import { ClassMethodDeclarationChildNames } from './Declaration/ClassMethodDeclaration';
import { DataDeclarationChildNames, DataDeclarationSequenceChildNames } from './Declaration/DataDeclarationSequence';
import { ExternClassDeclarationChildNames } from './Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclarationChildNames } from './Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclarationChildNames, ExternDataDeclarationSequenceChildNames } from './Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclarationChildNames } from './Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FriendDirectiveChildNames } from './Declaration/FriendDirective';
import { FunctionDeclarationChildNames } from './Declaration/FunctionDeclaration';
import { ImportStatementChildNames } from './Declaration/ImportStatement';
import { InterfaceDeclarationChildNames } from './Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclarationChildNames } from './Declaration/InterfaceMethodDeclaration';
import { ModuleDeclarationChildNames } from './Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclarationChildNames } from './Declaration/PreprocessorModuleDeclaration';
import { StrictDirectiveChildNames } from './Declaration/StrictDirective';
import { TypeParameterChildNames } from './Declaration/TypeParameter';
import { AssignmentDirectiveChildNames } from './Directive/AssignmentDirective';
import { ErrorDirectiveChildNames } from './Directive/ErrorDirective';
import { ElseDirectiveChildNames, ElseIfDirectiveChildNames, IfDirectiveChildNames } from './Directive/IfDirective';
import { PrintDirectiveChildNames } from './Directive/PrintDirective';
import { RemDirectiveChildNames } from './Directive/RemDirective';
import { ArrayLiteralExpressionChildNames } from './Expression/ArrayLiteralExpression';
import { AssignmentExpressionChildNames } from './Expression/AssignmentExpression';
import { BinaryExpressionChildNames } from './Expression/BinaryExpression';
import { BooleanLiteralExpressionChildNames } from './Expression/BooleanLiteralExpression';
import { FloatLiteralExpressionChildNames } from './Expression/FloatLiteralExpression';
import { GlobalScopeExpressionChildNames } from './Expression/GlobalScopeExpression';
import { GroupingExpressionChildNames } from './Expression/GroupingExpression';
import { IdentifierExpressionChildNames } from './Expression/IdentifierExpression';
import { IndexExpressionChildNames } from './Expression/IndexExpression';
import { IntegerLiteralExpressionChildNames } from './Expression/IntegerLiteralExpression';
import { InvokeExpressionChildNames } from './Expression/InvokeExpression';
import { NewExpressionChildNames } from './Expression/NewExpression';
import { NullExpressionChildNames } from './Expression/NullExpression';
import { ScopeMemberAccessExpressionChildNames } from './Expression/ScopeMemberAccessExpression';
import { SelfExpressionChildNames } from './Expression/SelfExpression';
import { SliceExpressionChildNames } from './Expression/SliceExpression';
import { StringLiteralExpressionChildNames } from './Expression/StringLiteralExpression';
import { SuperExpressionChildNames } from './Expression/SuperExpression';
import { UnaryExpressionChildNames } from './Expression/UnaryExpression';
import { EscapedIdentifierChildNames } from './Identifier';
import { ModulePathChildNames } from './ModulePath';
import { NodeKind } from './NodeKind';
import { ContinueStatementChildNames } from './Statement/ContinueStatement';
import { DataDeclarationSequenceStatementChildNames } from './Statement/DataDeclarationSequenceStatement';
import { EmptyStatementChildNames } from './Statement/EmptyStatement';
import { ExitStatementChildNames } from './Statement/ExitStatement';
import { ExpressionStatementChildNames } from './Statement/ExpressionStatement';
import { ForLoopChildNames, NumericForLoopHeaderChildNames } from './Statement/ForLoop';
import { ElseClauseChildNames, ElseIfClauseChildNames, IfStatementChildNames } from './Statement/IfStatement';
import { RepeatLoopChildNames } from './Statement/RepeatLoop';
import { ReturnStatementChildNames } from './Statement/ReturnStatement';
import { CaseClauseChildNames, DefaultClauseChildNames, SelectStatementChildNames } from './Statement/SelectStatement';
import { ThrowStatementChildNames } from './Statement/ThrowStatement';
import { CatchClauseChildNames, TryStatementChildNames } from './Statement/TryStatement';
import { WhileLoopChildNames } from './Statement/WhileLoop';
import { LonghandTypeAnnotationChildNames, ShorthandTypeAnnotationChildNames } from './TypeAnnotation';
import { TypeReferenceChildNames } from './TypeReference';

export const NodeKindToChildNamesMap: {
    [kind: string]: ReadonlyArray<string>;
} = {
    [NodeKind.PreprocessorModuleDeclaration]: PreprocessorModuleDeclarationChildNames,
    [NodeKind.IfDirective]: IfDirectiveChildNames,
    [NodeKind.ElseIfDirective]: ElseIfDirectiveChildNames,
    [NodeKind.ElseDirective]: ElseDirectiveChildNames,
    [NodeKind.RemDirective]: RemDirectiveChildNames,
    [NodeKind.PrintDirective]: PrintDirectiveChildNames,
    [NodeKind.ErrorDirective]: ErrorDirectiveChildNames,
    [NodeKind.AssignmentDirective]: AssignmentDirectiveChildNames,
    [NodeKind.ModuleDeclaration]: ModuleDeclarationChildNames,
    [NodeKind.ExternDataDeclarationSequence]: ExternDataDeclarationSequenceChildNames,
    [NodeKind.ExternDataDeclaration]: ExternDataDeclarationChildNames,
    [NodeKind.ExternFunctionDeclaration]: ExternFunctionDeclarationChildNames,
    [NodeKind.ExternClassDeclaration]: ExternClassDeclarationChildNames,
    [NodeKind.ExternClassMethodDeclaration]: ExternClassMethodDeclarationChildNames,
    [NodeKind.StrictDirective]: StrictDirectiveChildNames,
    [NodeKind.ImportStatement]: ImportStatementChildNames,
    [NodeKind.FriendDirective]: FriendDirectiveChildNames,
    [NodeKind.AccessibilityDirective]: AccessibilityDirectiveChildNames,
    [NodeKind.AliasDirectiveSequence]: AliasDirectiveSequenceChildNames,
    [NodeKind.AliasDirective]: AliasDirectiveChildNames,
    [NodeKind.DataDeclarationSequence]: DataDeclarationSequenceChildNames,
    [NodeKind.DataDeclaration]: DataDeclarationChildNames,
    [NodeKind.FunctionDeclaration]: FunctionDeclarationChildNames,
    [NodeKind.InterfaceDeclaration]: InterfaceDeclarationChildNames,
    [NodeKind.InterfaceMethodDeclaration]: InterfaceMethodDeclarationChildNames,
    [NodeKind.ClassDeclaration]: ClassDeclarationChildNames,
    [NodeKind.ClassMethodDeclaration]: ClassMethodDeclarationChildNames,
    [NodeKind.DataDeclarationSequenceStatement]: DataDeclarationSequenceStatementChildNames,
    [NodeKind.ReturnStatement]: ReturnStatementChildNames,
    [NodeKind.IfStatement]: IfStatementChildNames,
    [NodeKind.ElseIfClause]: ElseIfClauseChildNames,
    [NodeKind.ElseClause]: ElseClauseChildNames,
    [NodeKind.SelectStatement]: SelectStatementChildNames,
    [NodeKind.CaseClause]: CaseClauseChildNames,
    [NodeKind.DefaultClause]: DefaultClauseChildNames,
    [NodeKind.WhileLoop]: WhileLoopChildNames,
    [NodeKind.RepeatLoop]: RepeatLoopChildNames,
    [NodeKind.ForLoop]: ForLoopChildNames,
    [NodeKind.NumericForLoopHeader]: NumericForLoopHeaderChildNames,
    [NodeKind.ContinueStatement]: ContinueStatementChildNames,
    [NodeKind.ExitStatement]: ExitStatementChildNames,
    [NodeKind.ThrowStatement]: ThrowStatementChildNames,
    [NodeKind.TryStatement]: TryStatementChildNames,
    [NodeKind.CatchClause]: CatchClauseChildNames,
    [NodeKind.ExpressionStatement]: ExpressionStatementChildNames,
    [NodeKind.EmptyStatement]: EmptyStatementChildNames,
    [NodeKind.NewExpression]: NewExpressionChildNames,
    [NodeKind.NullExpression]: NullExpressionChildNames,
    [NodeKind.BooleanLiteralExpression]: BooleanLiteralExpressionChildNames,
    [NodeKind.SelfExpression]: SelfExpressionChildNames,
    [NodeKind.SuperExpression]: SuperExpressionChildNames,
    [NodeKind.IntegerLiteralExpression]: IntegerLiteralExpressionChildNames,
    [NodeKind.FloatLiteralExpression]: FloatLiteralExpressionChildNames,
    [NodeKind.StringLiteralExpression]: StringLiteralExpressionChildNames,
    [NodeKind.ConfigurationTag]: ConfigurationTagChildNames,
    [NodeKind.ArrayLiteralExpression]: ArrayLiteralExpressionChildNames,
    [NodeKind.IdentifierExpression]: IdentifierExpressionChildNames,
    [NodeKind.ScopeMemberAccessExpression]: ScopeMemberAccessExpressionChildNames,
    [NodeKind.InvokeExpression]: InvokeExpressionChildNames,
    [NodeKind.IndexExpression]: IndexExpressionChildNames,
    [NodeKind.SliceExpression]: SliceExpressionChildNames,
    [NodeKind.GroupingExpression]: GroupingExpressionChildNames,
    [NodeKind.UnaryExpression]: UnaryExpressionChildNames,
    [NodeKind.BinaryExpression]: BinaryExpressionChildNames,
    [NodeKind.AssignmentExpression]: AssignmentExpressionChildNames,
    [NodeKind.GlobalScopeExpression]: GlobalScopeExpressionChildNames,
    [NodeKind.ModulePath]: ModulePathChildNames,
    [NodeKind.ArrayTypeAnnotation]: ArrayTypeAnnotationChildNames,
    [NodeKind.ShorthandTypeAnnotation]: ShorthandTypeAnnotationChildNames,
    [NodeKind.LonghandTypeAnnotation]: LonghandTypeAnnotationChildNames,
    [NodeKind.TypeReference]: TypeReferenceChildNames,
    [NodeKind.TypeParameter]: TypeParameterChildNames,
    [NodeKind.EscapedIdentifier]: EscapedIdentifierChildNames,
    [NodeKind.CommaSeparator]: CommaSeparatorChildNames,
};
