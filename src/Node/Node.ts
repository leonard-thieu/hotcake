import { assertType } from '../assertNever';
import { ErrorableToken } from '../Token/Token';
import { ArrayTypeDeclaration } from './ArrayTypeDeclaration';
import { CommaSeparator } from './CommaSeparator';
import { ConfigurationTag } from './ConfigurationTag';
import { Declarations } from './Declaration/Declaration';
import { Directives } from './Directive/Directive';
import { Expressions } from './Expression/Expression';
import { EscapedIdentifier } from './Identifier';
import { ModulePath } from './ModulePath';
import { NodeKind } from './NodeKind';
import { NumericForLoopHeader } from './Statement/ForLoop';
import { Statements } from './Statement/Statement';
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
    NumericForLoopHeader |
    ArrayTypeDeclaration |
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
        case NodeKind.ElseIfStatement:
        case NodeKind.ElseStatement:
        case NodeKind.SelectStatement:
        case NodeKind.CaseStatement:
        case NodeKind.DefaultStatement:
        case NodeKind.WhileLoop:
        case NodeKind.RepeatLoop:
        case NodeKind.ForLoop:
        case NodeKind.NumericForLoopHeader:
        case NodeKind.ContinueStatement:
        case NodeKind.ExitStatement:
        case NodeKind.ThrowStatement:
        case NodeKind.TryStatement:
        case NodeKind.CatchStatement:
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
        case NodeKind.ArrayTypeDeclaration:
        case NodeKind.ShorthandTypeDeclaration:
        case NodeKind.LonghandTypeDeclaration:
        case NodeKind.TypeReference:
        case NodeKind.TypeParameter:
        case NodeKind.EscapedIdentifier:
        case NodeKind.CommaSeparator: {
            return true;
        }
    }

    assertType<ErrorableToken>(nodeOrToken);

    return false;
}
