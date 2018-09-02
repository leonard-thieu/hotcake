import { NewlineToken, SemicolonToken } from '../../Token/Token';
import { Node } from '../Node';

export abstract class Statement extends Node {
    terminator: NewlineToken | SemicolonToken | null = null;
}
