import { Directive } from "./Node/Directive/Directive";
import { IfDirective } from "./Node/Directive/IfDirective";
import { ModuleNode } from "./Node/ModuleNode";
import { Token } from "./Token";

export class PreprocessorParserTokenizer {
    * getTokens(module: ModuleNode): IterableIterator<Token> {
        for (const member of this.readMember(module.members)) {
            yield member;
        }

        yield module.eofToken!;
    }

    private * readMember(members: Array<Directive | Token>): IterableIterator<Token> {
        for (const member of members) {
            if (member instanceof IfDirective) {
                let branchMembers: Array<Directive | Token>;

                // TODO: Determine which branch is active.
                branchMembers = member.members;
                for (const branchMember of this.readMember(branchMembers)) {
                    yield branchMember;
                }
            } else if (!(member instanceof Directive)) {
                yield member;
            } else {
                console.log(`Skipped ${JSON.stringify(member.constructor.name)}`);
            }
        }
    }
}
