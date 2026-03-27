/**
 * Resizer Configuration Parameters
 *
 * This configuration defines how the application's base font size (and thus all 'rem' units)
 * scales across different screen sizes.
 *
 * Properties:
 * - name: Unique identifier for the breakpoint (e.g., 'mobile', 'tablet', 'desktop') !!!!!
 * - width: The base design width for this breakpoint (scaling is relative to this)   !!!!!
 * - height: (Optional) The base design height for this breakpoint
 * - minWidth: (Optional) The minimum width to consider for scaling (clamped)
 * - minHeight: (Optional) The minimum height to consider for scaling (clamped)
 * - maxWidth: The maximum window width for this breakpoint (used for switching)      !!!!!
 * - fontSize: The base font size at the design width                                 !!!!!
 * - scaleBy: (Optional) 'width', 'height', or 'both' (default is 'width')
 * - maxFontSize: (Optional) Maximum font size allowed for this breakpoint
 * - minFontSize: (Optional) Minimum font size allowed for this breakpoint
 */

export interface ResizerConfig {
  name: string
  width: number
  fontSize: number
  maxWidth: number
  height?: number
  minWidth?: number
  minHeight?: number
  scaleBy?: 'width' | 'height' | 'both'
  maxFontSize?: number
  minFontSize?: number
}

const resizerParams: Record<string, ResizerConfig> = {
  mobile: {
    name: 'mobile',
    width: 375,
    fontSize: 16,
    maxWidth: 767
  },
  tablet: {
    name: 'tablet',
    width: 768,
    fontSize: 16,
    maxWidth: 1439
  },
  desktop: {
    name: 'desktop',
    width: 1440,
    fontSize: 16,
    maxWidth: Infinity
  }
}

export default resizerParams
