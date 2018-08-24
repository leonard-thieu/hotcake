import path = require('path');

import { executePreprocessorParserTokenizerTestCases } from './shared';

const name = 'PreprocessorParserTokenizer';
const casesPath = path.resolve(__dirname, 'cases', 'PreprocessorParser');

executePreprocessorParserTokenizerTestCases(name, casesPath);
