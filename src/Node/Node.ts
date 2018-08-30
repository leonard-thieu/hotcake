import { NodeKind } from './NodeKind';

export abstract class Node {
    abstract readonly kind: NodeKind;
    parent: Node | null = null;

    get root() {
        let parent = this.parent;

        if (parent !== null) {
            while (parent.parent !== null) {
                parent = parent.parent;
            }
        }

        return parent;
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
