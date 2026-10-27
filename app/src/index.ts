import { makeBox } from 'dual';
import { box } from 'lib/index';

export const fromApp: 'esm' = makeBox().format; // OK
export const fromLib: 'esm' = box.format; // error: Type '"cjs"' is not assignable to type '"esm"'
