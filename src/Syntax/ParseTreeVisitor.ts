import { assertNever } from '../assertNever';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { NodeKindToChildNamesMap } from './Node/NodeKindToChildNamesMap';
import { ErrorableToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class ParseTreeVisitor {
    // #region Nodes

    getNodeAt(node: Nodes, offset: number) {
        while (true) {
            const childNode = this.getChildNodeAt(node, offset);
            if (!childNode) {
                break;
            }

            node = childNode;
        }

        return node;
    }

    getChildNodeAt(node: Nodes, offset: number) {
        for (const child of this.getChildNodes(node)) {
            const childFullStart = this.getNodeFullStart(child);
            const childEnd = this.getNodeEnd(child);
            if (childFullStart <= offset && offset < childEnd) {
                return child;
            }
        }
    }

    * getChildNodes(node: Nodes): IterableIterator<Nodes> {
        const childNames = NodeKindToChildNamesMap[node.kind];
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

    getNodeFullStart(node: Nodes) {
        const firstToken = this.getNodeFirstToken(node)!;

        return firstToken.fullStart;
    }

    getNodeEnd(node: Nodes) {
        const lastToken = this.getNodeLastToken(node);

        return lastToken.end;
    }

    private getNodeFirstToken(node: Nodes) {
        for (const token of this.getDescendentTokens(node)) {
            return token;
        }
    }

    private getNodeLastToken(node: Nodes) {
        let lastToken: ErrorableToken;

        for (const token of this.getDescendentTokens(node)) {
            lastToken = token;
        }

        return lastToken!;
    }

    // #endregion

    // #region Tokens

    getChildTokenAt(node: Nodes, offset: number) {
        for (const child of this.getChildTokens(node)) {
            if (child.fullStart <= offset && offset < child.end) {
                return child;
            }
        }
    }

    * getChildTokens(node: Nodes): IterableIterator<ErrorableToken> {
        const childNames = NodeKindToChildNamesMap[node.kind];
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

    * getDescendentTokens(node: Nodes): IterableIterator<ErrorableToken> {
        const childNames = NodeKindToChildNamesMap[node.kind];
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
                        yield* this.getDescendentTokens(c);
                    }
                }
            } else {
                const c = child;
                if (!isNode(c)) {
                    yield c;
                } else {
                    yield* this.getDescendentTokens(c);
                }
            }
        }
    }

    // #endregion
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
        case NodeKind.ForLoop:
        case NodeKind.NumericForLoopHeader:
        case NodeKind.ContinueStatement:
        case NodeKind.ExitStatement:
        case NodeKind.ThrowStatement:
        case NodeKind.TryStatement:
        case NodeKind.CatchClause:
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
        case NodeKind.AssignmentExpression:
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
