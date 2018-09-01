import { Token } from '../../Token/Token';
import { Node } from '../Node';

export abstract class Statement extends Node {
    terminator: Token | null = null;
}
