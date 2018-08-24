import path = require('path');
import 'chai/register-should';

import { executeTestCases, getTokens } from "./shared";

const name = 'Tokenizer';
const casesPath = path.resolve(__dirname, 'cases', name);

executeTestCases({
    name: `${name} (Invariants)`,
    casesPath: casesPath,
    testCallback: function (context) {
        const { _it, sourceRelativePath, contents } = context;
        const tokens = getTokens(contents);

        _it(sourceRelativePath, function () {
            let tokensLength = 0;
            for (const token of tokens) {
                tokensLength += token.length;
            }

            tokensLength.should.equal(contents.length, 'Invariant: Sum of the lengths of all the tokens should be equivalent to the length of the document.');
        });

        _it(sourceRelativePath, function () {
            for (const token of tokens) {
                token.start.should.be.at.least(token.fullStart, "Invariant: A token's Start is always >= FullStart.");
            }
        });
    },
});
