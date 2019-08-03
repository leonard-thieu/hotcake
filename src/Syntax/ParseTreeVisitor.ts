import { assertNever } from '../util';
import { ArrayTypeAnnotationChildNames } from './Node/ArrayTypeAnnotation';
import { CommaSeparatorChildNames } from './Node/CommaSeparator';
import { ConfigurationTagChildNames } from './Node/ConfigurationTag';
import { AccessibilityDirectiveChildNames } from './Node/Declaration/AccessibilityDirective';
import { AliasDirectiveChildNames, AliasDirectiveSequenceChildNames } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclarationChildNames } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclarationChildNames } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclarationChildNames, DataDeclarationSequenceChildNames } from './Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclarationChildNames } from './Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclarationChildNames } from './Node/Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclarationChildNames, ExternDataDeclarationSequenceChildNames } from './Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclarationChildNames } from './Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FriendDirectiveChildNames } from './Node/Declaration/FriendDirective';
import { FunctionDeclarationChildNames } from './Node/Declaration/FunctionDeclaration';
import { ImportStatementChildNames } from './Node/Declaration/ImportStatement';
import { InterfaceDeclarationChildNames } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclarationChildNames } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclarationChildNames } from './Node/Declaration/ModuleDeclaration';
import { PreprocessorModuleDeclarationChildNames } from './Node/Declaration/PreprocessorModuleDeclaration';
import { StrictDirectiveChildNames } from './Node/Declaration/StrictDirective';
import { TypeParameterChildNames } from './Node/Declaration/TypeParameter';
import { AssignmentDirectiveChildNames } from './Node/Directive/AssignmentDirective';
import { ErrorDirectiveChildNames } from './Node/Directive/ErrorDirective';
import { ElseDirectiveChildNames, ElseIfDirectiveChildNames, IfDirectiveChildNames } from './Node/Directive/IfDirective';
import { PrintDirectiveChildNames } from './Node/Directive/PrintDirective';
import { RemDirectiveChildNames } from './Node/Directive/RemDirective';
import { ArrayLiteralExpressionChildNames } from './Node/Expression/ArrayLiteralExpression';
import { BinaryExpressionChildNames } from './Node/Expression/BinaryExpression';
import { BooleanLiteralExpressionChildNames } from './Node/Expression/BooleanLiteralExpression';
import { FloatLiteralExpressionChildNames } from './Node/Expression/FloatLiteralExpression';
import { GlobalScopeExpressionChildNames } from './Node/Expression/GlobalScopeExpression';
import { GroupingExpressionChildNames } from './Node/Expression/GroupingExpression';
import { IdentifierExpressionChildNames } from './Node/Expression/IdentifierExpression';
import { IndexExpressionChildNames } from './Node/Expression/IndexExpression';
import { IntegerLiteralExpressionChildNames } from './Node/Expression/IntegerLiteralExpression';
import { InvokeExpressionChildNames } from './Node/Expression/InvokeExpression';
import { NewExpressionChildNames } from './Node/Expression/NewExpression';
import { NullExpressionChildNames } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpressionChildNames } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpressionChildNames } from './Node/Expression/SelfExpression';
import { SliceExpressionChildNames } from './Node/Expression/SliceExpression';
import { StringLiteralExpressionChildNames } from './Node/Expression/StringLiteralExpression';
import { SuperExpressionChildNames } from './Node/Expression/SuperExpression';
import { UnaryExpressionChildNames } from './Node/Expression/UnaryExpression';
import { EscapedIdentifierChildNames } from './Node/Identifier';
import { ModulePathChildNames } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { AssignmentStatementChildNames } from './Node/Statement/AssignmentStatement';
import { ContinueStatementChildNames } from './Node/Statement/ContinueStatement';
import { DataDeclarationSequenceStatementChildNames } from './Node/Statement/DataDeclarationSequenceStatement';
import { EmptyStatementChildNames } from './Node/Statement/EmptyStatement';
import { ExitStatementChildNames } from './Node/Statement/ExitStatement';
import { ExpressionStatementChildNames } from './Node/Statement/ExpressionStatement';
import { ForEachInLoopChildNames, NumericForLoopChildNames } from './Node/Statement/ForLoop';
import { ElseClauseChildNames, ElseIfClauseChildNames, IfStatementChildNames } from './Node/Statement/IfStatement';
import { RepeatLoopChildNames } from './Node/Statement/RepeatLoop';
import { ReturnStatementChildNames } from './Node/Statement/ReturnStatement';
import { CaseClauseChildNames, DefaultClauseChildNames, SelectStatementChildNames } from './Node/Statement/SelectStatement';
import { ThrowStatementChildNames } from './Node/Statement/ThrowStatement';
import { CatchClauseChildNames, TryStatementChildNames } from './Node/Statement/TryStatement';
import { WhileLoopChildNames } from './Node/Statement/WhileLoop';
import { LonghandTypeAnnotationChildNames, ShorthandTypeAnnotationChildNames } from './Node/TypeAnnotation';
import { TypeReferenceChildNames } from './Node/TypeReference';
import { ErrorableToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export namespace ParseTreeVisitor {
    export function getNearestAncestor(node: Nodes, kind: NodeKind, ...kinds: NodeKind[]) {
        let ancestor = node.parent;

        while (ancestor) {
            if (ancestor.kind === kind ||
                kinds.includes(ancestor.kind)
            ) {
                return ancestor;
            }

            ancestor = ancestor.parent;
        }
    }

    // #region Nodes

    export function getNodeAt(node: Nodes, offset: number) {
        while (true) {
            const childNode = getChildNodeAt(node, offset);
            if (!childNode) {
                break;
            }

            node = childNode;
        }

        return node;
    }

    export function getChildNodeAt(node: Nodes, offset: number) {
        for (const child of getChildNodes(node)) {
            const childFullStart = getNodeFullStart(child);
            const childEnd = getNodeEnd(child);
            if (childFullStart <= offset && offset < childEnd) {
                return child;
            }
        }
    }

    export function* getChildNodes(node: Nodes): IterableIterator<Nodes> {
        const childNames = getChildNames(node.kind);
        for (const childName of childNames) {
            const child = (node as any)[childName];
            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const c of child) {
                    if (isNode(c)) {
                        yield c;
                    }
                }
            } else {
                const c = child;
                if (isNode(c)) {
                    yield c;
                }
            }
        }
    }

    export function getNodeFullStart(node: Nodes) {
        const firstToken = getNodeFirstToken(node)!;

        return firstToken.fullStart;
    }

    export function getNodeEnd(node: Nodes) {
        const lastToken = getNodeLastToken(node);

        return lastToken.end;
    }

    function getNodeFirstToken(node: Nodes) {
        for (const token of getDescendentTokens(node)) {
            return token;
        }
    }

    function getNodeLastToken(node: Nodes) {
        let lastToken: ErrorableToken;

        for (const token of getDescendentTokens(node)) {
            lastToken = token;
        }

        return lastToken!;
    }

    // #endregion

    // #region Tokens

    export function getChildTokenAt(node: Nodes, offset: number) {
        for (const child of getChildTokens(node)) {
            if (child.fullStart <= offset && offset < child.end) {
                return child;
            }
        }
    }

    export function* getChildTokens(node: Nodes): IterableIterator<ErrorableToken> {
        const childNames = getChildNames(node.kind);
        for (const childName of childNames) {
            const child = (node as any)[childName];
            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const c of child) {
                    if (!isNode(c)) {
                        yield c;
                    }
                }
            } else {
                const c = child;
                if (!isNode(c)) {
                    yield c;
                }
            }
        }
    }

    export function* getDescendentTokens(node: Nodes): IterableIterator<ErrorableToken> {
        const childNames = getChildNames(node.kind);
        for (const childName of childNames) {
            const child = (node as any)[childName];
            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const c of child) {
                    if (!isNode(c)) {
                        yield c;
                    } else {
                        yield* getDescendentTokens(c);
                    }
                }
            } else {
                const c = child;
                if (!isNode(c)) {
                    yield c;
                } else {
                    yield* getDescendentTokens(c);
                }
            }
        }
    }

    // #endregion

    function getChildNames(kind: NodeKind) {
        switch (kind) {
            case NodeKind.PreprocessorModuleDeclaration: { return PreprocessorModuleDeclarationChildNames; }

            case NodeKind.IfDirective: { return IfDirectiveChildNames; }
            case NodeKind.ElseIfDirective: { return ElseIfDirectiveChildNames; }
            case NodeKind.ElseDirective: { return ElseDirectiveChildNames; }
            case NodeKind.RemDirective: { return RemDirectiveChildNames; }
            case NodeKind.PrintDirective: { return PrintDirectiveChildNames; }
            case NodeKind.ErrorDirective: { return ErrorDirectiveChildNames; }
            case NodeKind.AssignmentDirective: { return AssignmentDirectiveChildNames; }

            case NodeKind.ModuleDeclaration: { return ModuleDeclarationChildNames; }

            case NodeKind.ExternDataDeclarationSequence: { return ExternDataDeclarationSequenceChildNames; }
            case NodeKind.ExternDataDeclaration: { return ExternDataDeclarationChildNames; }
            case NodeKind.ExternFunctionDeclaration: { return ExternFunctionDeclarationChildNames; }
            case NodeKind.ExternClassDeclaration: { return ExternClassDeclarationChildNames; }
            case NodeKind.ExternClassMethodDeclaration: { return ExternClassMethodDeclarationChildNames; }

            case NodeKind.StrictDirective: { return StrictDirectiveChildNames; }
            case NodeKind.ImportStatement: { return ImportStatementChildNames; }
            case NodeKind.FriendDirective: { return FriendDirectiveChildNames; }
            case NodeKind.AccessibilityDirective: { return AccessibilityDirectiveChildNames; }
            case NodeKind.AliasDirectiveSequence: { return AliasDirectiveSequenceChildNames; }
            case NodeKind.AliasDirective: { return AliasDirectiveChildNames; }
            case NodeKind.DataDeclarationSequence: { return DataDeclarationSequenceChildNames; }
            case NodeKind.DataDeclaration: { return DataDeclarationChildNames; }
            case NodeKind.FunctionDeclaration: { return FunctionDeclarationChildNames; }
            case NodeKind.InterfaceDeclaration: { return InterfaceDeclarationChildNames; }
            case NodeKind.InterfaceMethodDeclaration: { return InterfaceMethodDeclarationChildNames; }
            case NodeKind.ClassDeclaration: { return ClassDeclarationChildNames; }
            case NodeKind.ClassMethodDeclaration: { return ClassMethodDeclarationChildNames; }

            case NodeKind.DataDeclarationSequenceStatement: { return DataDeclarationSequenceStatementChildNames; }
            case NodeKind.ReturnStatement: { return ReturnStatementChildNames; }
            case NodeKind.IfStatement: { return IfStatementChildNames; }
            case NodeKind.ElseIfClause: { return ElseIfClauseChildNames; }
            case NodeKind.ElseClause: { return ElseClauseChildNames; }
            case NodeKind.SelectStatement: { return SelectStatementChildNames; }
            case NodeKind.CaseClause: { return CaseClauseChildNames; }
            case NodeKind.DefaultClause: { return DefaultClauseChildNames; }
            case NodeKind.WhileLoop: { return WhileLoopChildNames; }
            case NodeKind.RepeatLoop: { return RepeatLoopChildNames; }
            case NodeKind.NumericForLoop: { return NumericForLoopChildNames; }
            case NodeKind.ForEachInLoop: { return ForEachInLoopChildNames; }
            case NodeKind.ContinueStatement: { return ContinueStatementChildNames; }
            case NodeKind.ExitStatement: { return ExitStatementChildNames; }
            case NodeKind.ThrowStatement: { return ThrowStatementChildNames; }
            case NodeKind.TryStatement: { return TryStatementChildNames; }
            case NodeKind.CatchClause: { return CatchClauseChildNames; }
            case NodeKind.AssignmentStatement: { return AssignmentStatementChildNames; }
            case NodeKind.ExpressionStatement: { return ExpressionStatementChildNames; }
            case NodeKind.EmptyStatement: { return EmptyStatementChildNames; }

            case NodeKind.NewExpression: { return NewExpressionChildNames; }
            case NodeKind.NullExpression: { return NullExpressionChildNames; }
            case NodeKind.BooleanLiteralExpression: { return BooleanLiteralExpressionChildNames; }
            case NodeKind.SelfExpression: { return SelfExpressionChildNames; }
            case NodeKind.SuperExpression: { return SuperExpressionChildNames; }
            case NodeKind.IntegerLiteralExpression: { return IntegerLiteralExpressionChildNames; }
            case NodeKind.FloatLiteralExpression: { return FloatLiteralExpressionChildNames; }
            case NodeKind.StringLiteralExpression: { return StringLiteralExpressionChildNames; }
            case NodeKind.ConfigurationTag: { return ConfigurationTagChildNames; }
            case NodeKind.ArrayLiteralExpression: { return ArrayLiteralExpressionChildNames; }
            case NodeKind.IdentifierExpression: { return IdentifierExpressionChildNames; }
            case NodeKind.ScopeMemberAccessExpression: { return ScopeMemberAccessExpressionChildNames; }
            case NodeKind.InvokeExpression: { return InvokeExpressionChildNames; }
            case NodeKind.IndexExpression: { return IndexExpressionChildNames; }
            case NodeKind.SliceExpression: { return SliceExpressionChildNames; }
            case NodeKind.GroupingExpression: { return GroupingExpressionChildNames; }
            case NodeKind.UnaryExpression: { return UnaryExpressionChildNames; }
            case NodeKind.BinaryExpression: { return BinaryExpressionChildNames; }
            case NodeKind.GlobalScopeExpression: { return GlobalScopeExpressionChildNames; }

            case NodeKind.ModulePath: { return ModulePathChildNames; }
            case NodeKind.ArrayTypeAnnotation: { return ArrayTypeAnnotationChildNames; }
            case NodeKind.ShorthandTypeAnnotation: { return ShorthandTypeAnnotationChildNames; }
            case NodeKind.LonghandTypeAnnotation: { return LonghandTypeAnnotationChildNames; }
            case NodeKind.TypeReference: { return TypeReferenceChildNames; }
            case NodeKind.TypeParameter: { return TypeParameterChildNames; }
            case NodeKind.EscapedIdentifier: { return EscapedIdentifierChildNames; }
            case NodeKind.CommaSeparator: { return CommaSeparatorChildNames; }

            default: {
                return assertNever(kind);
            }
        }
    }

    function isNode(nodeOrToken: Nodes | ErrorableToken): nodeOrToken is Nodes {
        switch (nodeOrToken.kind) {
            case NodeKind.PreprocessorModuleDeclaration:
            case NodeKind.IfDirective:
            case NodeKind.ElseIfDirective:
            case NodeKind.ElseDirective:
            case NodeKind.RemDirective:
            case NodeKind.PrintDirective:
            case NodeKind.ErrorDirective:
            case NodeKind.AssignmentDirective:
            case NodeKind.ModuleDeclaration:
            case NodeKind.ExternDataDeclarationSequence:
            case NodeKind.ExternDataDeclaration:
            case NodeKind.ExternFunctionDeclaration:
            case NodeKind.ExternClassDeclaration:
            case NodeKind.ExternClassMethodDeclaration:
            case NodeKind.StrictDirective:
            case NodeKind.ImportStatement:
            case NodeKind.FriendDirective:
            case NodeKind.AccessibilityDirective:
            case NodeKind.AliasDirectiveSequence:
            case NodeKind.AliasDirective:
            case NodeKind.DataDeclarationSequence:
            case NodeKind.DataDeclaration:
            case NodeKind.FunctionDeclaration:
            case NodeKind.InterfaceDeclaration:
            case NodeKind.InterfaceMethodDeclaration:
            case NodeKind.ClassDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.DataDeclarationSequenceStatement:
            case NodeKind.ReturnStatement:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfClause:
            case NodeKind.ElseClause:
            case NodeKind.SelectStatement:
            case NodeKind.CaseClause:
            case NodeKind.DefaultClause:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.NumericForLoop:
            case NodeKind.ForEachInLoop:
            case NodeKind.ContinueStatement:
            case NodeKind.ExitStatement:
            case NodeKind.ThrowStatement:
            case NodeKind.TryStatement:
            case NodeKind.CatchClause:
            case NodeKind.AssignmentStatement:
            case NodeKind.ExpressionStatement:
            case NodeKind.EmptyStatement:
            case NodeKind.NewExpression:
            case NodeKind.NullExpression:
            case NodeKind.BooleanLiteralExpression:
            case NodeKind.SelfExpression:
            case NodeKind.SuperExpression:
            case NodeKind.IntegerLiteralExpression:
            case NodeKind.FloatLiteralExpression:
            case NodeKind.StringLiteralExpression:
            case NodeKind.ConfigurationTag:
            case NodeKind.ArrayLiteralExpression:
            case NodeKind.IdentifierExpression:
            case NodeKind.ScopeMemberAccessExpression:
            case NodeKind.InvokeExpression:
            case NodeKind.IndexExpression:
            case NodeKind.SliceExpression:
            case NodeKind.GroupingExpression:
            case NodeKind.UnaryExpression:
            case NodeKind.BinaryExpression:
            case NodeKind.GlobalScopeExpression:
            case NodeKind.ModulePath:
            case NodeKind.ArrayTypeAnnotation:
            case NodeKind.ShorthandTypeAnnotation:
            case NodeKind.LonghandTypeAnnotation:
            case NodeKind.TypeReference:
            case NodeKind.TypeParameter:
            case NodeKind.EscapedIdentifier:
            case NodeKind.CommaSeparator: {
                return true;
            }

            case TokenKind.Unknown:
            case TokenKind.EOF:
            case TokenKind.Newline:
            case TokenKind.IntegerLiteral:
            case TokenKind.FloatLiteral:
            case TokenKind.StringLiteralText:
            case TokenKind.EscapeNull:
            case TokenKind.EscapeCharacterTabulation:
            case TokenKind.EscapeLineFeedLf:
            case TokenKind.EscapeCarriageReturnCr:
            case TokenKind.EscapeQuotationMark:
            case TokenKind.EscapeTilde:
            case TokenKind.EscapeUnicodeHexValue:
            case TokenKind.InvalidEscapeSequence:
            case TokenKind.ConfigurationTagStart:
            case TokenKind.ConfigurationTagEnd:
            case TokenKind.IfDirectiveKeyword:
            case TokenKind.ElseIfDirectiveKeyword:
            case TokenKind.ElseDirectiveKeyword:
            case TokenKind.EndDirectiveKeyword:
            case TokenKind.RemDirectiveKeyword:
            case TokenKind.RemDirectiveBody:
            case TokenKind.PrintDirectiveKeyword:
            case TokenKind.ErrorDirectiveKeyword:
            case TokenKind.ConfigurationVariable:
            case TokenKind.QuotationMark:
            case TokenKind.NumberSign:
            case TokenKind.DollarSign:
            case TokenKind.PercentSign:
            case TokenKind.Ampersand:
            case TokenKind.OpeningParenthesis:
            case TokenKind.ClosingParenthesis:
            case TokenKind.Asterisk:
            case TokenKind.PlusSign:
            case TokenKind.Comma:
            case TokenKind.HyphenMinus:
            case TokenKind.Period:
            case TokenKind.Slash:
            case TokenKind.Colon:
            case TokenKind.Semicolon:
            case TokenKind.LessThanSign:
            case TokenKind.EqualsSign:
            case TokenKind.GreaterThanSign:
            case TokenKind.QuestionMark:
            case TokenKind.CommercialAt:
            case TokenKind.OpeningSquareBracket:
            case TokenKind.ClosingSquareBracket:
            case TokenKind.VerticalBar:
            case TokenKind.Tilde:
            case TokenKind.PeriodPeriod:
            case TokenKind.AmpersandEqualsSign:
            case TokenKind.AsteriskEqualsSign:
            case TokenKind.PlusSignEqualsSign:
            case TokenKind.HyphenMinusEqualsSign:
            case TokenKind.SlashEqualsSign:
            case TokenKind.ColonEqualsSign:
            case TokenKind.LessThanSignEqualsSign:
            case TokenKind.GreaterThanSignEqualsSign:
            case TokenKind.VerticalBarEqualsSign:
            case TokenKind.TildeEqualsSign:
            case TokenKind.ShlKeywordEqualsSign:
            case TokenKind.ShrKeywordEqualsSign:
            case TokenKind.ModKeywordEqualsSign:
            case TokenKind.LessThanSignGreaterThanSign:
            case TokenKind.Identifier:
            case TokenKind.VoidKeyword:
            case TokenKind.StrictKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.FriendKeyword:
            case TokenKind.PropertyKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ArrayKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ModKeyword:
            case TokenKind.ContinueKeyword:
            case TokenKind.ExitKeyword:
            case TokenKind.IncludeKeyword:
            case TokenKind.ImportKeyword:
            case TokenKind.ModuleKeyword:
            case TokenKind.ExternKeyword:
            case TokenKind.NewKeyword:
            case TokenKind.SelfKeyword:
            case TokenKind.SuperKeyword:
            case TokenKind.EachInKeyword:
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword:
            case TokenKind.NullKeyword:
            case TokenKind.NotKeyword:
            case TokenKind.ExtendsKeyword:
            case TokenKind.AbstractKeyword:
            case TokenKind.FinalKeyword:
            case TokenKind.SelectKeyword:
            case TokenKind.CaseKeyword:
            case TokenKind.DefaultKeyword:
            case TokenKind.ConstKeyword:
            case TokenKind.LocalKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.ClassKeyword:
            case TokenKind.AndKeyword:
            case TokenKind.OrKeyword:
            case TokenKind.ShlKeyword:
            case TokenKind.ShrKeyword:
            case TokenKind.EndKeyword:
            case TokenKind.IfKeyword:
            case TokenKind.ThenKeyword:
            case TokenKind.ElseKeyword:
            case TokenKind.ElseIfKeyword:
            case TokenKind.EndIfKeyword:
            case TokenKind.WhileKeyword:
            case TokenKind.WendKeyword:
            case TokenKind.RepeatKeyword:
            case TokenKind.UntilKeyword:
            case TokenKind.ForeverKeyword:
            case TokenKind.ForKeyword:
            case TokenKind.ToKeyword:
            case TokenKind.StepKeyword:
            case TokenKind.NextKeyword:
            case TokenKind.ReturnKeyword:
            case TokenKind.InterfaceKeyword:
            case TokenKind.ImplementsKeyword:
            case TokenKind.InlineKeyword:
            case TokenKind.AliasKeyword:
            case TokenKind.TryKeyword:
            case TokenKind.CatchKeyword:
            case TokenKind.ThrowKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.Missing:
            case TokenKind.Skipped: {
                return false;
            }

            default: {
                return assertNever(nodeOrToken);
            }
        }
    }
}
