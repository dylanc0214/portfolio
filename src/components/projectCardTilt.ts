export const MAX_TILT = 15

/**
 * Computes the 3D tilt rotation values for a ProjectCard given a normalised
 * cursor offset. Both inputs are normalised to [-1, 1] where -1 is the
 * left/top edge and 1 is the right/bottom edge of the card.
 *
 * @param nx - normalised horizontal cursor offset in [-1, 1]
 * @param ny - normalised vertical cursor offset in [-1, 1]
 * @returns { tiltX, tiltY } in degrees, each clamped to [-MAX_TILT, MAX_TILT]
 */
export function computeTilt(nx: number, ny: number): { tiltX: number; tiltY: number } {
  const clamp = (v: number) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v))
  return {
    tiltX: clamp(-ny * MAX_TILT),
    tiltY: clamp(nx * MAX_TILT),
  }
}
