import { assertNever } from '../../assertNever';
import { ErrorableToken } from '../Token/Token';
import { TokenKind } from '../Token/TokenKind';
import { ArrayTypeAnnotation } from './ArrayTypeAnnotation';
import { CommaSeparator } from './CommaSeparator';
import { ConfigurationTag } from './ConfigurationTag';
import { Declarations } from './Declaration/Declaration';
import { Directives } from './Directive/Directive';
import { Expressions } from './Expression/Expression';
import { EscapedIdentifier } from './Identifier';
import { ModulePath } from './ModulePath';
import { NodeKind } from './NodeKind';
import { NumericForLoopHeader } from './Statement/ForLoop';
import { ElseClause, ElseIfClause } from './Statement/IfStatement';
import { CaseClause, DefaultClause } from './Statement/SelectStatement';
import { Statements } from './Statement/Statement';
import { CatchClause } from './Statement/TryStatement';
import { TypeAnnotation } from './TypeAnnotation';
import { TypeReference } from './TypeReference';

export abstract class Node {
    static CHILD_NAMES: string[];

    'constructor': typeof Node;

    abstract readonly kind: NodeKind;
    parent?: Nodes = undefined;

    get root() {
        let root: Node = this;

        while (root.parent) {
            root = root.parent;
        }

        return root;
    }

    getFirstAncestor(...kinds: NodeKind[]) {
        let ancestor: Node = this;
        while (true) {
            if (!ancestor.parent) {
                break;
            }

            ancestor = ancestor.parent;
            for (const kind of kinds) {
                if (ancestor.kind === kind) {
                    return ancestor;
                }
            }
        }
    }

    * getDescendantNodesAndTokens(): IterableIterator<Nodes | ErrorableToken> {
        for (const child of this.getChildNodesAndTokens()) {
            if (isNode(child)) {
                yield child;

                for (const childChild of child.getDescendantNodesAndTokens()) {
                    yield childChild;
                }
            } else {
                yield child;
            }
        }
    }

    * getDescendantNodes(): IterableIterator<Nodes> {
        for (const child of this.getChildNodes()) {
            yield child;

            for (const childChild of child.getDescendantNodes()) {
                yield childChild;
            }
        }
    }

    * getDescendantTokens(): IterableIterator<ErrorableToken> {
        for (const child of this.getChildNodesAndTokens()) {
            if (isNode(child)) {
                for (const childChild of child.getDescendantTokens()) {
                    yield childChild;
                }
            } else {
                yield child;
            }
        }
    }

    * getChildNodesAndTokens(): IterableIterator<Nodes | ErrorableToken> {
        for (const childName of this.getChildNames() as (keyof this)[]) {
            const child = this[childName] as any;
            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const c of child) {
                    yield c;
                }
            } else {
                yield child;
            }
        }
    }

    * getChildNodes(): IterableIterator<Nodes> {
        for (const childName of this.getChildNames() as (keyof this)[]) {
            const child = this[childName] as any;
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
                if (isNode(child)) {
                    yield child;
                }
            }
        }
    }

    * getChildTokens(): IterableIterator<ErrorableToken> {
        for (const childName of this.getChildNames() as (keyof this)[]) {
            const child = this[childName] as any;
            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const c of child) {
                    if (!isNode(c)) {
                        yield c;
                    }
                }
            } else if (!isNode(child)) {
                yield child;
            }
        }
    }

    getChildNodeAt(offset: number) {
        for (const child of this.getChildNodes()) {
            if (child.fullStart <= offset && offset < child.end) {
                return child;
            }
        }
    }

    getChildTokenAt(offset: number) {
        for (const child of this.getChildTokens()) {
            if (child.fullStart <= offset && offset < child.end) {
                return child;
            }
        }
    }

    get fullStart() {
        return this.firstToken.fullStart;
    }

    get start() {
        return this.firstToken.start;
    }

    get length() {
        return this.lastToken.end - this.firstToken.fullStart;
    }

    get end() {
        return this.fullStart + this.length;
    }

    abstract get firstToken(): ErrorableToken;

    abstract get lastToken(): ErrorableToken;

    toJSON(): any {
        const obj: any = {
            kind: this.kind,
        };

        for (const childName of this.getChildNames()) {
            obj[childName] = this[childName as keyof this];
        }

        return obj;
    }

    private getChildNames() {
        return this.constructor.CHILD_NAMES;
    }
}

export type Nodes =
    Declarations |
    Directives |
    Expressions |
    Statements |
    ConfigurationTag |
    ElseIfClause | ElseClause |
    CaseClause | DefaultClause |
    NumericForLoopHeader |
    CatchClause |
    ArrayTypeAnnotation |
    TypeAnnotation |
    CommaSeparator |
    EscapedIdentifier |
    ModulePath |
    TypeReference
    ;

export function isNode(nodeOrToken: Nodes | ErrorableToken): nodeOrToken is Nodes {
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
