import path = require('path');
import 'chai/register-should';
import { executePreprocessorTokenizerTestCases, executeTestCases, getCasePaths, getPreprocessorTokens } from './shared';

const name = 'PreprocessorTokenizer';
const rootPath = path.resolve(__dirname, 'cases', name);
const casePaths = getCasePaths(rootPath);

executeTestCases(
    `${name} (Invariants)`,
    rootPath,
    casePaths,
    function (document) {
        const tokens = getPreprocessorTokens(document);

        let tokensLength = 0;
        for (const token of tokens) {
            tokensLength += token.length;
        }

        tokensLength.should.equal(document.length, 'Invariant: Sum of the lengths of all the tokens should be equivalent to the length of the document');
    },
    function (document) {
        const tokens = getPreprocessorTokens(document);

        for (const token of tokens) {
            token.start.should.be.at.least(token.fullStart, "Invariant: A token's start is always >= fullStart");
        }
    },
    function (document) {
        const tokens = getPreprocessorTokens(document);

        let allFullText = '';
        for (const token of tokens) {
            allFullText += token.getFullText(document);
        }

        allFullText.should.equal(document, 'Invariant: Concatenating the full text of each token returns the document');
    },
);

executePreprocessorTokenizerTestCases(name, rootPath, casePaths);
