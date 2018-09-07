import { AccessibilityDirective, AccessibilityKeywordToken } from './Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence, MissableDataDeclaration } from './Node/Declaration/DataDeclarationSequence';
import { FriendDirective } from './Node/Declaration/FriendDirective';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { LonghandTypeDeclaration, ShorthandTypeDeclaration, ShorthandTypeToken } from './Node/Declaration/TypeDeclaration';
import { TypeParameter } from './Node/Declaration/TypeParameter';
import { AssignmentExpression } from './Node/Expression/AssignmentExpression';
import { Expressions } from './Node/Expression/Expression';
import { MissableModulePath } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForLoop, NumericForLoopHeader } from './Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './Node/Statement/IfStatement';
import { LocalDataDeclarationSequenceStatement } from './Node/Statement/LocalDataDeclarationSequenceStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './Node/Statement/SelectStatement';
import { Statement } from './Node/Statement/Statement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { ParseContext, ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { MissingToken } from './Token/MissingToken';
import { AliasKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, ColonToken, ContinueKeywordToken, DefaultKeywordToken, ElseIfKeywordToken, ElseKeywordToken, ExitKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, IdentifierToken, IfKeywordToken, ImportKeywordToken, InterfaceKeywordToken, LocalKeywordToken, MethodKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, StrictKeywordToken, ThrowKeywordToken, Tokens, TryKeywordToken, WhileKeywordToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Parser extends ParserBase {
    parse(filePath: string, document: string, tokens: Tokens[]): ModuleDeclaration {
        this.tokens = [...tokens];
        this.position = 0;
        this.parseContexts = [];

        return this.parseModuleDeclaration(filePath, document);
    }

    private parseModuleDeclaration(filePath: string, document: string): ModuleDeclaration {
        const moduleDeclaration = new ModuleDeclaration();
        moduleDeclaration.filePath = filePath;
        moduleDeclaration.document = document;

        moduleDeclaration.members = this.parseList(moduleDeclaration, moduleDeclaration.kind);

        return moduleDeclaration;
    }

    // #region Module members

    private isModuleMembersListTerminator(): boolean {
        return false;
    }

    private isModuleMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.StrictKeyword:
            case TokenKind.ImportKeyword:
            case TokenKind.FriendKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword:
            case TokenKind.AliasKeyword:
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.InterfaceKeyword:
            case TokenKind.ClassKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseModuleMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.StrictKeyword: {
                this.advanceToken();

                return this.parseStrictDirective(parent, token);
            }
            case TokenKind.ImportKeyword: {
                this.advanceToken();

                return this.parseImportStatement(parent, token);
            }
            case TokenKind.FriendKeyword: {
                this.advanceToken();

                return this.parseFriendDirective(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
            case TokenKind.AliasKeyword: {
                this.advanceToken();

                return this.parseAliasDirectiveSequence(parent, token);
            }
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.InterfaceKeyword: {
                this.advanceToken();

                return this.parseInterfaceDeclaration(parent, token);
            }
            case TokenKind.ClassKeyword: {
                this.advanceToken();

                return this.parseClassDeclaration(parent, token);
            }
        }

        return this.parseCore(parent);
    }

    private parseStrictDirective(parent: Nodes, strictKeyword: StrictKeywordToken): StrictDirective {
        const strictDirective = new StrictDirective();
        strictDirective.parent = parent;
        strictDirective.strictKeyword = strictKeyword;

        return strictDirective;
    }

    private parseImportStatement(parent: Nodes, importKeyword: ImportKeywordToken): ImportStatement {
        const importStatement = new ImportStatement();
        importStatement.parent = parent;
        importStatement.importKeyword = importKeyword;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuotationMark: {
                this.advanceToken();

                importStatement.path = this.parseStringLiteral(importStatement, token);
                break;
            }
            default: {
                importStatement.path = this.parseMissableModulePath(importStatement);
                break;
            }
        }

        return importStatement;
    }

    private parseFriendDirective(parent: Nodes, friendKeyword: FriendKeywordToken): FriendDirective {
        const friendDirective = new FriendDirective();
        friendDirective.parent = parent;
        friendDirective.friendKeyword = friendKeyword;
        friendDirective.modulePath = this.parseMissableModulePath(friendDirective);

        return friendDirective;
    }

    private parseAliasDirectiveSequence(parent: Nodes, aliasKeyword: AliasKeywordToken): AliasDirectiveSequence {
        const aliasDirectiveSequence = new AliasDirectiveSequence();
        aliasDirectiveSequence.parent = parent;
        aliasDirectiveSequence.aliasKeyword = aliasKeyword;
        aliasDirectiveSequence.children = this.parseList(aliasDirectiveSequence, aliasDirectiveSequence.kind);

        return aliasDirectiveSequence;
    }

    private parseInterfaceDeclaration(parent: Nodes, interfaceKeyword: InterfaceKeywordToken): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = interfaceKeyword;
        interfaceDeclaration.name = this.eat(TokenKind.Identifier);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword !== null) {
            interfaceDeclaration.baseTypes = this.parseList(interfaceDeclaration, ParseContextKind.TypeReferenceSequence);
        }
        interfaceDeclaration.members = this.parseList(interfaceDeclaration, interfaceDeclaration.kind);
        interfaceDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        interfaceDeclaration.endInterfaceKeyword = this.eatOptional(TokenKind.InterfaceKeyword);

        return interfaceDeclaration;
    }

    private parseClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ClassDeclaration {
        const classDeclaration = new ClassDeclaration();
        classDeclaration.parent = parent;
        classDeclaration.classKeyword = classKeyword;
        classDeclaration.name = this.eat(TokenKind.Identifier);

        classDeclaration.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (classDeclaration.lessThanSign !== null) {
            classDeclaration.typeParameters = this.parseList(classDeclaration, ParseContextKind.TypeParameterSequence);
            classDeclaration.greaterThanSign = this.eat(TokenKind.GreaterThanSign);
        }

        classDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (classDeclaration.extendsKeyword !== null) {
            classDeclaration.baseType = this.parseMissableTypeReference(classDeclaration);
        }

        classDeclaration.implementsKeyword = this.eatOptional(TokenKind.ImplementsKeyword);
        if (classDeclaration.implementsKeyword !== null) {
            classDeclaration.implementedTypes = this.parseList(classDeclaration, ParseContextKind.TypeReferenceSequence);
        }

        let token: typeof classDeclaration.attributes[0] | null;
        while ((token = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword)) !== null) {
            classDeclaration.attributes.push(token);
        }

        classDeclaration.members = this.parseList(classDeclaration, classDeclaration.kind);
        classDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);

        return classDeclaration;
    }

    // #endregion

    // #region Alias directive members

    private isAliasDirectiveSequenceTerminator(token: Tokens): boolean {
        return !this.isAliasDirectiveSequenceMemberStart(token);
    }

    private isAliasDirectiveSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseAliasDirectiveSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                this.advanceToken();

                return this.parseAliasDirective(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseAliasDirective(parent: Nodes, name: IdentifierToken) {
        const aliasDirective = new AliasDirective();
        aliasDirective.parent = parent;
        aliasDirective.name = name;
        aliasDirective.equalsSign = this.eat(TokenKind.EqualsSign);
        aliasDirective.target = this.parseMissableTypeReference(aliasDirective);

        return aliasDirective;
    }

    // #endregion

    // #region Interface members

    private isInterfaceMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isInterfaceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseInterfaceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseInterfaceMethodDeclaration(parent, token);
            }
        }

        return this.parseCore(parent);
    }

    private parseInterfaceMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): InterfaceMethodDeclaration {
        const interfaceMethodDeclaration = new InterfaceMethodDeclaration();
        interfaceMethodDeclaration.parent = parent;
        interfaceMethodDeclaration.methodKeyword = methodKeyword;
        interfaceMethodDeclaration.name = this.eat(TokenKind.Identifier);
        interfaceMethodDeclaration.returnType = this.parseTypeDeclaration(interfaceMethodDeclaration);
        interfaceMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseList(interfaceMethodDeclaration, ParseContextKind.DataDeclarationSequence);
        interfaceMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    // #endregion

    // #region Class members

    private isClassMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isClassMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseClassMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseClassMethodDeclaration(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
        }

        return this.parseCore(parent);
    }

    private parseClassMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): ClassMethodDeclaration {
        const classMethodDeclaration = new ClassMethodDeclaration();
        classMethodDeclaration.parent = parent;
        classMethodDeclaration.methodKeyword = methodKeyword;
        classMethodDeclaration.name = this.eat(TokenKind.Identifier);
        classMethodDeclaration.returnType = this.parseTypeDeclaration(classMethodDeclaration);
        classMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseList(classMethodDeclaration, ParseContextKind.DataDeclarationSequence);
        classMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        let token: typeof classMethodDeclaration.attributes[0] | null;
        while ((token = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword, TokenKind.PropertyKeyword)) !== null) {
            classMethodDeclaration.attributes.push(token);
        }

        if (classMethodDeclaration.attributes.findIndex(attribute => attribute.kind === TokenKind.AbstractKeyword) === -1) {
            classMethodDeclaration.statements = this.parseList(classMethodDeclaration, classMethodDeclaration.kind);
            classMethodDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
            classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);
        }

        return classMethodDeclaration;
    }

    // #endregion

    // #region Statements

    private isBlockStatementsListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isStatementStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.LocalKeyword:
            case TokenKind.ReturnKeyword:
            case TokenKind.IfKeyword:
            case TokenKind.SelectKeyword:
            case TokenKind.WhileKeyword:
            case TokenKind.RepeatKeyword:
            case TokenKind.ForKeyword:
            case TokenKind.ContinueKeyword:
            case TokenKind.ExitKeyword:
            case TokenKind.ThrowKeyword:
            case TokenKind.TryKeyword:
            case TokenKind.Newline:
            case TokenKind.Semicolon: {
                return true;
            }
        }

        return this.isExpressionStart(token);
    }

    private parseStatement(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.LocalKeyword: {
                this.advanceToken();

                return this.parseLocalDataDeclarationSequenceStatement(parent, token);
            }
            case TokenKind.ReturnKeyword: {
                this.advanceToken();

                return this.parseReturnStatement(parent, token);
            }
            case TokenKind.IfKeyword: {
                this.advanceToken();

                return this.parseIfStatement(parent, token);
            }
            case TokenKind.SelectKeyword: {
                this.advanceToken();

                return this.parseSelectStatement(parent, token);
            }
            case TokenKind.CaseKeyword: {
                this.advanceToken();

                return this.parseCaseStatement(parent, token);
            }
            case TokenKind.DefaultKeyword: {
                this.advanceToken();

                return this.parseDefaultStatement(parent, token);
            }
            case TokenKind.WhileKeyword: {
                this.advanceToken();

                return this.parseWhileLoop(parent, token);
            }
            case TokenKind.RepeatKeyword: {
                this.advanceToken();

                return this.parseRepeatLoop(parent, token);
            }
            case TokenKind.ForKeyword: {
                this.advanceToken();

                return this.parseForLoop(parent, token);
            }
            case TokenKind.ContinueKeyword: {
                this.advanceToken();

                return this.parseContinueStatement(parent, token);
            }
            case TokenKind.ExitKeyword: {
                this.advanceToken();

                return this.parseExitStatement(parent, token);
            }
            case TokenKind.ThrowKeyword: {
                this.advanceToken();

                return this.parseThrowStatement(parent, token);
            }
            case TokenKind.TryKeyword: {
                this.advanceToken();

                return this.parseTryStatement(parent, token);
            }
            case TokenKind.Newline:
            case TokenKind.Semicolon: {
                return this.parseEmptyStatement(parent);
            }
        }

        return this.parseExpressionStatement(parent);
    }

    private parseLocalDataDeclarationSequenceStatement(parent: Nodes, localKeyword: LocalKeywordToken): LocalDataDeclarationSequenceStatement {
        const localDataDeclarationSequenceStatement = new LocalDataDeclarationSequenceStatement();
        localDataDeclarationSequenceStatement.parent = parent;
        localDataDeclarationSequenceStatement.localDataDeclarationSequence = this.parseDataDeclarationSequence(localDataDeclarationSequenceStatement, localKeyword);
        localDataDeclarationSequenceStatement.terminator = this.eatStatementTerminator(localDataDeclarationSequenceStatement);

        return localDataDeclarationSequenceStatement;
    }

    private parseReturnStatement(parent: Nodes, returnKeyword: ReturnKeywordToken): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = returnKeyword;
        // TODO: Is there sufficient information at this point to determine whether the return expression is required?
        if (this.isExpressionStart(this.getToken())) {
            returnStatement.expression = this.parseExpression(returnStatement);
        }
        returnStatement.terminator = this.eatStatementTerminator(returnStatement);

        return returnStatement;
    }

    // #region If statement

    private parseIfStatement(parent: Nodes, ifKeyword: IfKeywordToken): IfStatement {
        const ifStatement = new IfStatement();
        ifStatement.parent = parent;
        ifStatement.ifKeyword = ifKeyword;
        ifStatement.expression = this.parseExpression(ifStatement);
        ifStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);

        if (this.getToken().kind === TokenKind.Newline) {
            ifStatement.statements = this.parseList(ifStatement, ifStatement.kind);

            while (true) {
                const elseIfKeyword = this.getToken();
                let ifKeyword: Tokens | null = null;
                if (elseIfKeyword.kind === TokenKind.ElseIfKeyword) {
                    this.advanceToken();
                } else if (elseIfKeyword.kind === TokenKind.ElseKeyword) {
                    ifKeyword = this.getToken(1);
                    if (ifKeyword.kind === TokenKind.IfKeyword) {
                        this.advanceToken();
                        this.advanceToken();
                    } else {
                        break;
                    }
                } else {
                    break;
                }

                if (ifStatement.elseIfStatements === null) {
                    ifStatement.elseIfStatements = [];
                }

                ifStatement.elseIfStatements.push(this.parseElseIfStatement(ifStatement, elseIfKeyword, ifKeyword));
            }

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseStatement = this.parseElseStatement(ifStatement, elseKeyword);
            }

            ifStatement.endKeyword = this.eat(TokenKind.EndIfKeyword, TokenKind.EndKeyword);
            if (ifStatement.endKeyword.kind === TokenKind.EndKeyword) {
                ifStatement.endIfKeyword = this.eatOptional(TokenKind.IfKeyword);
            }
        } else {
            ifStatement.isSingleLine = true;
            ifStatement.statements = [this.parseStatement(ifStatement)];

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseStatement = this.parseElseStatement(ifStatement, elseKeyword);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator(ifStatement);

        return ifStatement;
    }

    private parseElseIfStatement(parent: IfStatement, elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken, ifKeyword: IfKeywordToken | null): ElseIfStatement {
        const elseIfStatement = new ElseIfStatement();
        elseIfStatement.parent = parent;
        elseIfStatement.elseIfKeyword = elseIfKeyword;
        elseIfStatement.ifKeyword = ifKeyword;
        elseIfStatement.expression = this.parseExpression(elseIfStatement);
        elseIfStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);
        elseIfStatement.statements = this.parseList(elseIfStatement, elseIfStatement.kind);

        return elseIfStatement;
    }

    private parseElseStatement(parent: IfStatement, elseKeyword: ElseKeywordToken): ElseStatement {
        const elseStatement = new ElseStatement();
        elseStatement.parent = parent;
        elseStatement.elseKeyword = elseKeyword;

        // TODO: Should just check if parent is single line.
        if (this.getToken().kind === TokenKind.Newline) {
            elseStatement.statements = this.parseList(elseStatement, elseStatement.kind);
        } else {
            elseStatement.statements = [this.parseStatement(elseStatement)];
        }

        return elseStatement;
    }

    private isIfStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword:
            case TokenKind.ElseKeyword:
            case TokenKind.EndIfKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Select statement

    private parseSelectStatement(parent: Nodes, selectKeyword: SelectKeywordToken): SelectStatement {
        const selectStatement = new SelectStatement();
        selectStatement.parent = parent;
        selectStatement.selectKeyword = selectKeyword;
        selectStatement.expression = this.parseExpression(selectStatement);

        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.Newline) {
                break;
            }

            this.advanceToken();

            selectStatement.newlines.push(token);
        }

        while (true) {
            const caseKeyword = this.getToken();
            if (caseKeyword.kind !== TokenKind.CaseKeyword) {
                break;
            }

            this.advanceToken();

            selectStatement.caseStatements.push(this.parseCaseStatement(selectStatement, caseKeyword));
        }

        const defaultKeyword = this.getToken();
        if (defaultKeyword.kind === TokenKind.DefaultKeyword) {
            this.advanceToken();

            selectStatement.defaultStatement = this.parseDefaultStatement(selectStatement, defaultKeyword);
        }

        selectStatement.endKeyword = this.eat(TokenKind.EndKeyword);
        selectStatement.endSelectKeyword = this.eatOptional(TokenKind.SelectKeyword);
        selectStatement.terminator = this.eatStatementTerminator(selectStatement);

        return selectStatement;
    }

    private parseCaseStatement(parent: Nodes, caseKeyword: CaseKeywordToken): CaseStatement {
        const caseStatement = new CaseStatement();
        caseStatement.parent = parent;
        caseStatement.caseKeyword = caseKeyword;
        caseStatement.expressions = this.parseList(caseStatement, ParseContextKind.ExpressionSequence);
        caseStatement.statements = this.parseList(caseStatement, caseStatement.kind);

        return caseStatement;
    }

    private parseDefaultStatement(parent: Nodes, defaultKeyword: DefaultKeywordToken): DefaultStatement {
        const defaultStatement = new DefaultStatement();
        defaultStatement.parent = parent;
        defaultStatement.defaultKeyword = defaultKeyword;
        defaultStatement.statements = this.parseList(defaultStatement, defaultStatement.kind);

        return defaultStatement;
    }

    private isCaseOrDefaultStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword:
            case TokenKind.DefaultKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Loops

    // #region While loop

    private parseWhileLoop(parent: Nodes, whileKeyword: WhileKeywordToken): WhileLoop {
        const whileLoop = new WhileLoop();
        whileLoop.parent = parent;
        whileLoop.whileKeyword = whileKeyword;
        whileLoop.expression = this.parseExpression(whileLoop);
        whileLoop.statements = this.parseList(whileLoop, whileLoop.kind);
        whileLoop.endKeyword = this.eat(TokenKind.WendKeyword, TokenKind.EndKeyword);
        if (whileLoop.endKeyword.kind === TokenKind.EndKeyword) {
            whileLoop.endWhileKeyword = this.eatOptional(TokenKind.WhileKeyword);
        }
        whileLoop.terminator = this.eatStatementTerminator(whileLoop);

        return whileLoop;
    }

    private isWhileLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.WendKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Repeat loop

    private parseRepeatLoop(parent: Nodes, repeatKeyword: RepeatKeywordToken): RepeatLoop {
        const repeatLoop = new RepeatLoop();
        repeatLoop.parent = parent;
        repeatLoop.repeatKeyword = repeatKeyword;
        repeatLoop.statements = this.parseList(repeatLoop, repeatLoop.kind);
        repeatLoop.foreverOrUntilKeyword = this.eat(TokenKind.ForeverKeyword, TokenKind.UntilKeyword);
        if (repeatLoop.foreverOrUntilKeyword.kind === TokenKind.UntilKeyword) {
            repeatLoop.untilExpression = this.parseExpression(repeatLoop);
        }
        repeatLoop.terminator = this.eatStatementTerminator(repeatLoop);

        return repeatLoop;
    }

    private isRepeatLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ForeverKeyword:
            case TokenKind.UntilKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region For loop

    private parseForLoop(parent: Nodes, forKeyword: ForKeywordToken): ForLoop {
        const forLoop = new ForLoop();
        forLoop.parent = parent;
        forLoop.forKeyword = forKeyword;
        forLoop.header = this.parseForLoopHeader(forLoop);
        forLoop.statements = this.parseList(forLoop, forLoop.kind);
        forLoop.endKeyword = this.eat(TokenKind.NextKeyword, TokenKind.EndKeyword);
        if (forLoop.endKeyword.kind === TokenKind.EndKeyword) {
            forLoop.endForKeyword = this.eatOptional(TokenKind.ForKeyword);
        }
        forLoop.terminator = this.eatStatementTerminator(forLoop);

        return forLoop;
    }

    private parseForLoopHeader(parent: ForLoop) {
        let loopVariableExpression: LocalDataDeclarationSequenceStatement | AssignmentExpression;
        const localKeyword = this.getToken();
        if (localKeyword.kind === TokenKind.LocalKeyword) {
            this.advanceToken();

            loopVariableExpression = this.parseLocalDataDeclarationSequenceStatement(parent, localKeyword);
            const declaration = loopVariableExpression.localDataDeclarationSequence.children[0];
            if (declaration &&
                declaration.kind === NodeKind.DataDeclaration &&
                declaration.eachInKeyword !== null) {
                return loopVariableExpression;
            }
        } else {
            // TODO: Is this a safe assertion?
            loopVariableExpression = this.parseExpression(parent) as AssignmentExpression;
            if (loopVariableExpression.eachInKeyword !== null) {
                return loopVariableExpression;
            }
        }

        const numericForLoopHeader = new NumericForLoopHeader();
        numericForLoopHeader.parent = parent;
        numericForLoopHeader.loopVariableExpression = loopVariableExpression;

        numericForLoopHeader.toOrUntilKeyword = this.eat(TokenKind.ToKeyword, TokenKind.UntilKeyword);
        numericForLoopHeader.lastValueExpression = this.parseExpression(numericForLoopHeader);

        numericForLoopHeader.stepKeyword = this.eatOptional(TokenKind.StepKeyword);
        if (numericForLoopHeader.stepKeyword !== null) {
            numericForLoopHeader.stepValueExpression = this.parseExpression(numericForLoopHeader);
        }

        return numericForLoopHeader;
    }

    private isForLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NextKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseContinueStatement(parent: Nodes, continueKeyword: ContinueKeywordToken): ContinueStatement {
        const continueStatement = new ContinueStatement();
        continueStatement.parent = parent;
        continueStatement.continueKeyword = continueKeyword;
        continueStatement.terminator = this.eatStatementTerminator(continueStatement);

        return continueStatement;
    }

    private parseExitStatement(parent: Nodes, exitKeyword: ExitKeywordToken): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = exitKeyword;
        exitStatement.terminator = this.eatStatementTerminator(exitStatement);

        return exitStatement;
    }

    // #endregion

    private parseThrowStatement(parent: Nodes, throwKeyword: ThrowKeywordToken): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = throwKeyword;
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator(throwStatement);

        return throwStatement;
    }

    // #region Try statement

    private parseTryStatement(parent: Nodes, tryKeyword: TryKeywordToken): TryStatement {
        const tryStatement = new TryStatement();
        tryStatement.parent = parent;
        tryStatement.tryKeyword = tryKeyword;
        tryStatement.statements = this.parseList(tryStatement, tryStatement.kind);

        while (true) {
            const catchKeyword = this.getToken();
            if (catchKeyword.kind !== TokenKind.CatchKeyword) {
                break;
            }

            if (tryStatement.catchStatements === null) {
                tryStatement.catchStatements = [];
            }

            this.advanceToken();

            tryStatement.catchStatements.push(this.parseCatchStatement(tryStatement, catchKeyword));
        }

        tryStatement.endKeyword = this.eat(TokenKind.EndKeyword);
        tryStatement.endTryKeyword = this.eatOptional(TokenKind.TryKeyword);
        tryStatement.terminator = this.eatStatementTerminator(tryStatement);

        return tryStatement;
    }

    private parseCatchStatement(parent: Nodes, catchKeyword: CatchKeywordToken): CatchStatement {
        const catchStatement = new CatchStatement();
        catchStatement.parent = parent;
        catchStatement.catchKeyword = catchKeyword;
        catchStatement.parameter = this.parseMissableDataDeclaration(catchStatement);
        catchStatement.statements = this.parseList(catchStatement, catchStatement.kind);

        return catchStatement;
    }

    private isTryStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CatchKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseExpressionStatement(parent: Nodes): ExpressionStatement {
        const expressionStatement = new ExpressionStatement();
        expressionStatement.parent = parent;
        expressionStatement.expression = this.parseExpression(expressionStatement);
        expressionStatement.terminator = this.eatStatementTerminator(expressionStatement);

        return expressionStatement;
    }

    private parseEmptyStatement(parent: Nodes): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator(emptyStatement);

        return emptyStatement;
    }

    // #endregion

    // #region Common

    private parseMissableModulePath(parent: Nodes): MissableModulePath {
        const token = this.getToken();
        if (this.isModulePathChildStart(token)) {
            this.advanceToken();

            return this.parseModulePath(parent, token);
        }

        return new MissingToken(token.fullStart, NodeKind.ModulePath);
    }

    private parseAccessibilityDirective(parent: Nodes, accessibilityKeyword: AccessibilityKeywordToken): AccessibilityDirective {
        const accessibilityDirective = new AccessibilityDirective();
        accessibilityDirective.parent = parent;
        accessibilityDirective.accessibilityKeyword = accessibilityKeyword;
        if (accessibilityDirective.accessibilityKeyword.kind === TokenKind.ExternKeyword) {
            accessibilityDirective.externPrivateKeyword = this.eatOptional(TokenKind.PrivateKeyword);
        }

        return accessibilityDirective;
    }

    private parseFunctionDeclaration(parent: Nodes, functionKeyword: FunctionKeywordToken): FunctionDeclaration {
        const functionDeclaration = new FunctionDeclaration();
        functionDeclaration.parent = parent;
        functionDeclaration.functionKeyword = functionKeyword;
        functionDeclaration.name = this.eat(TokenKind.Identifier);
        functionDeclaration.returnType = this.parseTypeDeclaration(functionDeclaration);
        functionDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseList(functionDeclaration, ParseContextKind.DataDeclarationSequence);
        functionDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseList(functionDeclaration, functionDeclaration.kind);
        functionDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);

        return functionDeclaration;
    }

    private parseDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword: DataDeclarationKeywordToken): DataDeclarationSequence {
        const dataDeclarationSequence = new DataDeclarationSequence();
        dataDeclarationSequence.parent = parent;
        dataDeclarationSequence.dataDeclarationKeyword = dataDeclarationKeyword;
        dataDeclarationSequence.children = this.parseList(dataDeclarationSequence, ParseContextKind.DataDeclarationSequence);

        return dataDeclarationSequence;
    }

    // #region Data declaration sequence members

    private isDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isDataDeclarationSequenceMemberStart(token);
    }

    private isDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            // TODO: Is Period (global scope member access) allowed?
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseDataDeclarationSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseMissableDataDeclaration(parent: Nodes): MissableDataDeclaration {
        const name = this.getToken();
        switch (name.kind) {
            case TokenKind.Identifier: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, name);
            }
        }

        return new MissingToken(name.fullStart, NodeKind.DataDeclaration);
    }

    private parseDataDeclaration(parent: Nodes, name: IdentifierToken): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.name = name;
        dataDeclaration.type = this.parseTypeDeclaration(dataDeclaration);
        // TODO: Check if parent is Const.
        dataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
        if (dataDeclaration.equalsSign !== null) {
            dataDeclaration.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
            dataDeclaration.expression = this.parseExpression(dataDeclaration);
        }

        return dataDeclaration;
    }

    // #endregion

    // #region Type declaration

    private parseTypeDeclaration(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuestionMark:
            case TokenKind.PercentSign:
            case TokenKind.NumberSign:
            case TokenKind.DollarSign: {
                this.advanceToken();

                return this.parseShorthandTypeDeclaration(parent, token);
            }
            case TokenKind.Colon: {
                this.advanceToken();

                return this.parseLonghandTypeDeclaration(parent, token);
            }
        }

        return null;
    }

    private parseShorthandTypeDeclaration(parent: Nodes, shorthandType: ShorthandTypeToken): ShorthandTypeDeclaration {
        const shorthandTypeDeclaration = new ShorthandTypeDeclaration();
        shorthandTypeDeclaration.parent = parent;
        shorthandTypeDeclaration.shorthandType = shorthandType;
        shorthandTypeDeclaration.arrayTypeDeclarations = this.parseList(shorthandTypeDeclaration, ParseContextKind.ArrayTypeDeclarationList);

        return shorthandTypeDeclaration;
    }

    private parseLonghandTypeDeclaration(parent: Nodes, colon: ColonToken): LonghandTypeDeclaration {
        const longhandTypeDeclaration = new LonghandTypeDeclaration();
        longhandTypeDeclaration.parent = parent;
        longhandTypeDeclaration.colon = colon;
        longhandTypeDeclaration.typeReference = this.parseMissableTypeReference(longhandTypeDeclaration);

        return longhandTypeDeclaration;
    }

    // #endregion

    // #region Type parameter sequence

    private isTypeParameterSequenceTerminator(token: Tokens): boolean {
        return !this.isTypeParameterSequenceMemberStart(token);
    }

    private isTypeParameterSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseTypeParameterSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                this.advanceToken();

                return this.parseTypeParameter(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseTypeParameter(parent: Nodes, name: IdentifierToken): TypeParameter {
        const typeParameter = new TypeParameter();
        typeParameter.parent = parent;
        typeParameter.name = name;

        return typeParameter;
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        /**
         * Parentheses-less invocations are only valid in expression statements. For this purpose, 
         * the expression statements in single line If statements do not count as expression statements.
         */
        const parent = expression.parent;
        if (parent && parent.kind === NodeKind.ExpressionStatement &&
            !this.isInlineStatement(parent)) {
            return this.isExpressionSequenceMemberStart(token);
        }

        return false;
    }

    private isInlineStatement(statement: Statement): boolean {
        let parent = statement.parent!;

        switch (parent.kind) {
            case NodeKind.IfStatement:
            case NodeKind.ElseStatement: {
                return parent.isSingleLine;
            }
            case NodeKind.ForLoop: {
                // Check if this statement is the header.
                const currentParseContext = this.parseContexts[this.parseContexts.length - 1];

                return currentParseContext !== NodeKind.ForLoop;
            }
            case NodeKind.NumericForLoopHeader: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Core

    protected isListTerminator(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMembersListTerminator();
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMembersListTerminator(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMembersListTerminator(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration: {
                return this.isBlockStatementsListTerminator(token);
            }
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement: {
                return this.isIfStatementStatementsListTerminator(token);
            }
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement: {
                return this.isCaseOrDefaultStatementStatementsListTerminator(token);
            }
            case NodeKind.WhileLoop: {
                return this.isWhileLoopStatementsListTerminator(token);
            }
            case NodeKind.RepeatLoop: {
                return this.isRepeatLoopStatementsListTerminator(token);
            }
            case NodeKind.ForLoop: {
                return this.isForLoopStatementsListTerminator(token);
            }
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isTryStatementStatementsListTerminator(token);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceTerminator(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceTerminator(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMemberStart(token);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMemberStart(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMemberStart(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isStatementStart(token);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceMemberStart(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: ParseContext, parent: Nodes) {
        parseContext = parseContext as ParserParseContext;

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.parseModuleMember(parent);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.parseInterfaceMember(parent);
            }
            case NodeKind.ClassDeclaration: {
                return this.parseClassMember(parent);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.parseStatement(parent);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.parseAliasDirectiveSequenceMember(parent);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.parseDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
            }
        }

        return super.parseListElementCore(parseContext, parent);
    }

    private parseCore(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Newline: {
                this.advanceToken();

                return token;
            }
        }

        const p = parent || {
            kind: null,
        };
        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)} in ${JSON.stringify(p.kind)}`);
    }

    private eatStatementTerminator(statement: Statement) {
        if (!this.isInlineStatement(statement)) {
            return this.eatOptional(TokenKind.Newline, TokenKind.Semicolon);
        }

        return null;
    }

    // #endregion
}

// #region Parse contexts

interface ParserParseContextElementMap extends ParseContextElementMapBase {
    [NodeKind.ModuleDeclaration]: ReturnType<Parser['parseModuleMember']>;
    [NodeKind.InterfaceDeclaration]: ReturnType<Parser['parseInterfaceMember']>;
    [NodeKind.ClassDeclaration]: ReturnType<Parser['parseClassMember']>;
    [NodeKind.ClassMethodDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.IfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseIfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CaseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.DefaultStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.WhileLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.RepeatLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ForLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.TryStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CatchStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.FunctionDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.AliasDirectiveSequence]: ReturnType<Parser['parseAliasDirectiveSequenceMember']>;
    [ParseContextKind.DataDeclarationSequence]: ReturnType<Parser['parseDataDeclarationSequenceMember']>;
    [ParseContextKind.TypeParameterSequence]: ReturnType<Parser['parseTypeParameterSequenceMember']>;
}

type ParserParseContext = keyof ParserParseContextElementMap;

const _ParseContextKind: { -readonly [P in keyof typeof ParseContextKind]: typeof ParseContextKind[P]; } = ParseContextKind;
_ParseContextKind.DataDeclarationSequence = 'DataDeclarationSequence' as ParseContextKind.DataDeclarationSequence;
_ParseContextKind.TypeParameterSequence = 'TypeParameterSequence' as ParseContextKind.TypeParameterSequence;

declare module './ParserBase' {
    enum ParseContextKind {
        DataDeclarationSequence = 'DataDeclarationSequence',
        TypeParameterSequence = 'TypeParameterSequence',
    }

    interface ParseContextElementMap extends ParserParseContextElementMap { }
}

// #endregion
