import { NodeKind } from './NodeKind';

export abstract class Node {
    abstract readonly kind: NodeKind;
    parent: Node | null = null;

    get root() {
        let root: Node = this;
        
        while (root.parent !== null) {
            root = root.parent;
        }

        return root;
    }

    getFirstAncestor(...kinds: NodeKind[]) {
        let ancestor: Node = this;
        while (true) {
            if (ancestor.parent === null) {
                return null;
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
