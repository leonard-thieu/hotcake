import path = require('path');
import { executeParserTestCases, executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases } from './shared';

const name = 'MonkeyX';
const casesPath = path.resolve('..', '..', 'blitz-research', 'monkey');

executePreprocessorTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
executeParserTestCases(name, casesPath);
