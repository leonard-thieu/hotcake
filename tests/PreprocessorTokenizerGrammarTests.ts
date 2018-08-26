import path = require('path');

import { executePreprocessorTokenizerTestCases } from './shared';

const name = 'PreprocessorTokenizer';
const casesPath = path.resolve(__dirname, 'cases', name);

executePreprocessorTokenizerTestCases(name, casesPath);
