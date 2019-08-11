import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';

export namespace BoundTreeWalker {
    export function getClosest<TKind extends BoundNodeKind>(
        node: BoundNodes,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        let closest: BoundNodes | undefined = node;

        do {
            if (kinds.length === 0) {
                return closest;
            }

            for (const kind of kinds) {
                if (closest.kind === kind) {
                    return closest;
                }
            }

            closest = closest.parent;
        } while (closest);
    }
}
