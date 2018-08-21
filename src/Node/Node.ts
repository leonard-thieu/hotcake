export abstract class Node {
    parent: Node | null = null;

    toJSON() {
        const obj: any = {};

        for (const childName of this.getChildNames()) {
            obj[childName] = this[childName];
        }

        return {
            [this.constructor.name]: obj,
        };
    }

    private getChildNames<K extends keyof this>(): K[] {
        const ctor = this.constructor as any;

        return ctor.CHILD_NAMES || [];
    }
}
