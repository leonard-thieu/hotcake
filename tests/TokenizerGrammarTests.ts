import path = require('path');

import { executeTokenizerTestCases } from './shared';

const name = 'Tokenizer';
const casesPath = path.resolve(__dirname, 'cases', name);

executeTokenizerTestCases(name, casesPath);
