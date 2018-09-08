import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { AssignmentDirective } from './Node/Directive/AssignmentDirective';
import { ErrorDirective } from './Node/Directive/ErrorDirective';
import { ElseDirective, ElseIfDirective, IfDirective } from './Node/Directive/IfDirective';
import { PrintDirective } from './Node/Directive/PrintDirective';
import { RemDirective } from './Node/Directive/RemDirective';
import { Expressions } from './Node/Expression/Expression';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ParseContext, ParseContextElementMapBase, ParserBase } from './ParserBase';
import { ConfigurationVariableToken, ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, EOFToken, ErrorDirectiveKeywordToken, IfDirectiveKeywordToken, PrintDirectiveKeywordToken, RemDirectiveKeywordToken, Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class PreprocessorParser extends ParserBase {
    parse(filePath: string, document: string, tokens: Tokens[]): PreprocessorModuleDeclaration {
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
        // Guaranteed by tokenizer and parser.
        preprocessorModuleDeclaration.eofToken = this.eat(TokenKind.EOF) as EOFToken;

        return preprocessorModuleDeclaration;
    }

    // #region Directives

    private isPreprocessorModuleMemberListTerminator(): boolean {
        return false;
    }

    private isPreprocessorModuleMemberStart(): boolean {
        return true;
    }

    private parseModuleMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                this.advanceToken();

                return this.parseIfDirective(parent, token);
            }
            case TokenKind.RemDirectiveKeyword: {
                this.advanceToken();

                return this.parseRemDirective(parent, token);
            }
            case TokenKind.PrintDirectiveKeyword: {
                this.advanceToken();

                return this.parsePrintDirective(parent, token);
            }
            case TokenKind.ErrorDirectiveKeyword: {
                this.advanceToken();

                return this.parseErrorDirective(parent, token);
            }
            case TokenKind.ConfigurationVariable: {
                this.advanceToken();

                return this.parseAssignmentDirective(parent, token);
            }
        }

        this.advanceToken();

        return token;
    }

    private parseIfDirective(parent: Nodes, ifDirectiveKeyword: IfDirectiveKeywordToken): IfDirective {
        const ifDirective = new IfDirective();
        ifDirective.parent = parent;
        ifDirective.ifDirectiveKeyword = ifDirectiveKeyword;
        ifDirective.expression = this.parseExpression(ifDirective);
        ifDirective.members = this.parseList(ifDirective, ifDirective.kind);

        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.ElseIfDirectiveKeyword) {
                break;
            }

            this.advanceToken();

            ifDirective.elseIfDirectives.push(this.parseElseIfDirective(ifDirective, token));
        }

        const elseDirectiveKeyword = this.getToken();
        if (elseDirectiveKeyword.kind === TokenKind.ElseDirectiveKeyword) {
            this.advanceToken();

            ifDirective.elseDirective = this.parseElseDirective(ifDirective, elseDirectiveKeyword);
        }

        ifDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return ifDirective;
    }

    private parseElseIfDirective(parent: IfDirective, elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken): ElseIfDirective {
        const elseIfDirective = new ElseIfDirective();
        elseIfDirective.parent = parent;
        elseIfDirective.elseIfDirectiveKeyword = elseIfDirectiveKeyword;
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        elseIfDirective.members = this.parseList(elseIfDirective, elseIfDirective.kind);

        return elseIfDirective;
    }

    private parseElseDirective(parent: IfDirective, elseDirectiveKeyword: ElseDirectiveKeywordToken): ElseDirective {
        const elseDirective = new ElseDirective();
        elseDirective.parent = parent;
        elseDirective.elseDirectiveKeyword = elseDirectiveKeyword;
        elseDirective.members = this.parseList(elseDirective, elseDirective.kind);

        return elseDirective;
    }

    private isIfDirectiveMembersListTerminator(token: Tokens) {
        switch (token.kind) {
            case TokenKind.ElseIfDirectiveKeyword:
            case TokenKind.ElseDirectiveKeyword:
            case TokenKind.EndDirectiveKeyword: {
                return true;
            }
        }
        return false;
    }

    private parseRemDirective(parent: Nodes, remDirectiveKeyword: RemDirectiveKeywordToken): RemDirective {
        const remDirective = new RemDirective();
        remDirective.parent = parent;
        remDirective.remDirectiveKeyword = remDirectiveKeyword;
        remDirective.children = this.parseList(remDirective, remDirective.kind);
        remDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return remDirective;
    }

    // #region Rem directive members

    private isRemDirectiveMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndDirectiveKeyword;
    }

    private isRemDirectiveMemberStart(token: Tokens) {
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword:
            case TokenKind.RemDirectiveKeyword:
            case TokenKind.RemDirectiveBody: {
                return true;
            }
        }
        return false;
    }

    private parseRemDirectiveMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                this.advanceToken();

                return this.parseIfDirective(parent, token);
            }
            case TokenKind.RemDirectiveKeyword: {
                this.advanceToken();

                return this.parseRemDirective(parent, token);
            }
            case TokenKind.RemDirectiveBody: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    private parsePrintDirective(parent: Nodes, printDirectiveKeyword: PrintDirectiveKeywordToken): PrintDirective {
        const printDirective = new PrintDirective();
        printDirective.parent = parent;
        printDirective.printDirectiveKeyword = printDirectiveKeyword;
        printDirective.expression = this.parseExpression(printDirective);

        return printDirective;
    }

    private parseErrorDirective(parent: Nodes, errorDirectiveKeyword: ErrorDirectiveKeywordToken): ErrorDirective {
        const errorDirective = new ErrorDirective();
        errorDirective.parent = parent;
        errorDirective.errorDirectiveKeyword = errorDirectiveKeyword;
        errorDirective.expression = this.parseExpression(errorDirective);

        return errorDirective;
    }

    private parseAssignmentDirective(parent: Nodes, name: ConfigurationVariableToken): AssignmentDirective {
        const assignmentDirective = new AssignmentDirective();
        assignmentDirective.parent = parent;
        assignmentDirective.name = name;
        assignmentDirective.operator = this.eat(TokenKind.EqualsSign, TokenKind.PlusSignEqualsSign);
        assignmentDirective.expression = this.parseExpression(assignmentDirective);

        return assignmentDirective;
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        return false;
    }

    // #region Core

    protected isListTerminator(parseContext: ParseContext, token: Tokens): boolean {
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

    protected isValidListElement(parseContext: ParseContext, token: Tokens): boolean {
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

    protected parseListElement(parseContext: ParseContext, parent: Nodes) {
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
