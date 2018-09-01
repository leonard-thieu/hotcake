import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { AssignmentDirective } from './Node/Directive/AssignmentDirective';
import { Directive } from './Node/Directive/Directive';
import { EndDirective } from './Node/Directive/EndDirective';
import { ErrorDirective } from './Node/Directive/ErrorDirective';
import { ElseDirective, ElseIfDirective, IfDirective } from './Node/Directive/IfDirective';
import { PrintDirective } from './Node/Directive/PrintDirective';
import { RemDirective } from './Node/Directive/RemDirective';
import { Expressions } from './Node/Expression/Expression';
import { Node } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ParseContext, ParseContextElementMapBase, ParserBase } from './ParserBase';
import { Token } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class PreprocessorParser extends ParserBase {
    parse(filePath: string, document: string, tokens: Token[]): PreprocessorModuleDeclaration {
        this.tokens = [...tokens]
        this.position = 0;
        this.parseContexts = [];

        return this.parsePreprocessorModuleDeclaration(filePath, document);
    }

    private parsePreprocessorModuleDeclaration(filePath: string, document: string): PreprocessorModuleDeclaration {
        const preprocessorModuleDeclaration = new PreprocessorModuleDeclaration();
        preprocessorModuleDeclaration.filePath = filePath;
        preprocessorModuleDeclaration.document = document;

        preprocessorModuleDeclaration.members = this.parseList(preprocessorModuleDeclaration, preprocessorModuleDeclaration.kind);
        preprocessorModuleDeclaration.eofToken = this.eat(TokenKind.EOF);

        return preprocessorModuleDeclaration;
    }

    // #region Directives

    private isPreprocessorModuleMemberListTerminator(): boolean {
        return false;
    }

    private isPreprocessorModuleMemberStart(): boolean {
        return true;
    }

    private parseModuleMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.PrintDirectiveKeyword: {
                return this.parsePrintDirective(parent);
            }
            case TokenKind.ErrorDirectiveKeyword: {
                return this.parseErrorDirective(parent);
            }
            case TokenKind.ConfigurationVariable: {
                return this.parseAssignmentDirective(parent);
            }
        }

        this.advanceToken();

        return token;
    }

    private parseIfDirective(parent: Node): IfDirective {
        const ifDirective = new IfDirective();
        ifDirective.parent = parent;
        ifDirective.ifDirectiveKeyword = this.eat(TokenKind.IfDirectiveKeyword);
        ifDirective.expression = this.parseExpression(ifDirective);
        ifDirective.members = this.parseList(ifDirective, ifDirective.kind);

        while (this.getToken().kind === TokenKind.ElseIfDirectiveKeyword) {
            ifDirective.elseIfDirectives.push(this.parseElseIfDirective(ifDirective));
        }

        if (this.getToken().kind === TokenKind.ElseDirectiveKeyword) {
            ifDirective.elseDirective = this.parseElseDirective(ifDirective);
        }

        ifDirective.endDirective = this.parseEndDirective(ifDirective);

        return ifDirective;
    }

    private parseElseIfDirective(parent: IfDirective): ElseIfDirective {
        const elseIfDirective = new ElseIfDirective();
        elseIfDirective.parent = parent;
        elseIfDirective.elseIfDirectiveKeyword = this.eat(TokenKind.ElseIfDirectiveKeyword);
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        elseIfDirective.members = this.parseList(elseIfDirective, elseIfDirective.kind);

        return elseIfDirective;
    }

    private parseElseDirective(parent: IfDirective): ElseDirective {
        const elseDirective = new ElseDirective();
        elseDirective.parent = parent;
        elseDirective.elseDirectiveKeyword = this.eat(TokenKind.ElseDirectiveKeyword);
        elseDirective.members = this.parseList(elseDirective, elseDirective.kind);

        return elseDirective;
    }

    private isIfDirectiveMembersListTerminator(token: Token) {
        switch (token.kind) {
            case TokenKind.ElseIfDirectiveKeyword:
            case TokenKind.ElseDirectiveKeyword:
            case TokenKind.EndDirectiveKeyword: {
                return true;
            }
        }
        return false;
    }

    private parseEndDirective(parent: Directive): EndDirective {
        const endDirective = new EndDirective();
        endDirective.parent = parent;
        endDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return endDirective;
    }

    private parseRemDirective(parent: Node): RemDirective {
        const remDirective = new RemDirective();
        remDirective.parent = parent;
        remDirective.remDirectiveKeyword = this.eat(TokenKind.RemDirectiveKeyword);
        remDirective.children = this.parseList(remDirective, remDirective.kind);
        remDirective.endDirective = this.parseEndDirective(remDirective);

        return remDirective;
    }

    // #region Rem directive members

    private isRemDirectiveMembersListTerminator(token: Token): boolean {
        return token.kind === TokenKind.EndDirectiveKeyword;
    }

    private isRemDirectiveMemberStart(token: Token) {
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword:
            case TokenKind.RemDirectiveKeyword:
            case TokenKind.RemDirectiveBody: {
                return true;
            }
        }
        return false;
    }

    private parseRemDirectiveMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.RemDirectiveBody: {
                this.advanceToken();

                return token;
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    // #endregion

    private parsePrintDirective(parent: Node): PrintDirective {
        const printDirective = new PrintDirective();
        printDirective.parent = parent;
        printDirective.printDirectiveKeyword = this.eat(TokenKind.PrintDirectiveKeyword);
        printDirective.expression = this.parseExpression(printDirective);

        return printDirective;
    }

    private parseErrorDirective(parent: Node): ErrorDirective {
        const errorDirective = new ErrorDirective();
        errorDirective.parent = parent;
        errorDirective.errorDirectiveKeyword = this.eat(TokenKind.ErrorDirectiveKeyword);
        errorDirective.expression = this.parseExpression(errorDirective);

        return errorDirective;
    }

    private parseAssignmentDirective(parent: Node): AssignmentDirective {
        const assignmentDirective = new AssignmentDirective();
        assignmentDirective.parent = parent;
        assignmentDirective.name = this.eat(TokenKind.ConfigurationVariable);
        assignmentDirective.operator = this.eat(TokenKind.EqualsSign, TokenKind.PlusSignEqualsSign);
        assignmentDirective.expression = this.parseExpression(assignmentDirective);

        return assignmentDirective;
    }

    // #endregion

    protected isInvokeExpressionStart(token: Token, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        return false;
    }

    // #region Core

    protected isListTerminator(parseContext: ParseContext, token: Token): boolean {
        parseContext = parseContext as PreprocessorParserParseContext;

        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.PreprocessorModuleDeclaration: {
                return this.isPreprocessorModuleMemberListTerminator();
            }
            case NodeKind.IfDirective:
            case NodeKind.ElseIfDirective:
            case NodeKind.ElseDirective: {
                return this.isIfDirectiveMembersListTerminator(token);
            }
            case NodeKind.RemDirective: {
                return this.isRemDirectiveMembersListTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: ParseContext, token: Token): boolean {
        parseContext = parseContext as PreprocessorParserParseContext;

        switch (parseContext) {
            case NodeKind.PreprocessorModuleDeclaration:
            case NodeKind.IfDirective:
            case NodeKind.ElseIfDirective:
            case NodeKind.ElseDirective: {
                return this.isPreprocessorModuleMemberStart();
            }
            case NodeKind.RemDirective: {
                return this.isRemDirectiveMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: ParseContext, parent: Node) {
        parseContext = parseContext as PreprocessorParserParseContext;

        switch (parseContext) {
            case NodeKind.PreprocessorModuleDeclaration:
            case NodeKind.IfDirective:
            case NodeKind.ElseIfDirective:
            case NodeKind.ElseDirective: {
                return this.parseModuleMember(parent);
            }
            case NodeKind.RemDirective: {
                return this.parseRemDirectiveMember(parent);
            }
        }

        return this.parseListElementCore(parseContext, parent);
    }

    // #endregion
}

// #region Parse contexts

interface PreprocessorParserParseContextElementMap extends ParseContextElementMapBase {
    [NodeKind.PreprocessorModuleDeclaration]: ReturnType<PreprocessorParser['parseModuleMember']>;
    [NodeKind.IfDirective]: ReturnType<PreprocessorParser['parseModuleMember']>;
    [NodeKind.ElseIfDirective]: ReturnType<PreprocessorParser['parseModuleMember']>;
    [NodeKind.ElseDirective]: ReturnType<PreprocessorParser['parseModuleMember']>;
    [NodeKind.RemDirective]: ReturnType<PreprocessorParser['parseRemDirectiveMember']>;
}

type PreprocessorParserParseContext = keyof PreprocessorParserParseContextElementMap;

declare module './ParserBase' {
    interface ParseContextElementMap extends PreprocessorParserParseContextElementMap { }
}

// #endregion
