import { BoundSymbolTable } from '../Binder';
import { SerializationOptions } from '../SerializationOptions';
import { ArrayTypeDeclaration } from './ArrayTypeDeclaration';
import { CommaSeparator } from './CommaSeparator';
import { ConfigurationTag } from './ConfigurationTag';
import { Declarations } from './Declaration/Declaration';
import { Directives } from './Directive/Directive';
import { Expressions } from './Expression/Expression';
import { EscapedIdentifier } from './Identifier';
import { NodeKind } from './NodeKind';
import { NumericForLoopHeader } from './Statement/ForLoop';
import { Statements } from './Statement/Statement';
import { TypeReference } from './TypeReference';

export abstract class Node {
    abstract readonly kind: NodeKind;
    parent?: Nodes = undefined;

    locals?: BoundSymbolTable = undefined;

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

    toJSON(): any {
        const obj: any = {
            kind: this.kind,
        };

        if (SerializationOptions.serializeSymbols) {
            obj.locals = this.locals;
        }

        for (const childName of this.getChildNames()) {
            obj[childName] = this[childName];
        }

        return obj;
    }

    private getChildNames<K extends keyof this>(): K[] {
        const ctor = this.constructor as any;

        return ctor.CHILD_NAMES || [];
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
    TypeReference
    ;
