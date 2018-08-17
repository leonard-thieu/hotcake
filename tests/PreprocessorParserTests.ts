import assert = require('assert');
import { PreprocessorParser } from '../PreprocessorParser';

describe('PreprocessorParser', function() {
    describe('#parse()', function() {
        it(`should return an AST`, function() {
            const parser = new PreprocessorParser();

            const module = parser.parse(`' A test module`);

            assert.notEqual(module, null);
        });
    });
});