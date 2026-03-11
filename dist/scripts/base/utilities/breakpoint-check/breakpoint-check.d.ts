export type BreakpointSizeArgs = 'small' | 'medium' | 'large' | 'xlarge';
/**
 * Checks whether a given breakpoint is visible at the current viewport size
 *
 * @param {BreakpointSize} size
 * @returns {boolean}
 */
export default function (size: BreakpointSizeArgs): boolean;
