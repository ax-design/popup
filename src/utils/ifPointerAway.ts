import { closest } from './closest.js';

/**
 * If pointer moves away from specific element.
 * @param $compareWith Compare with element.
 * @returns Moved away or not.
 */
export const ifPointerAway = ($compareWith: string, insideShadowDom: boolean) => (event: PointerEvent | MouseEvent) => {
    if (!event.target) return false;
    if (!(event.target instanceof Element)) return false;
    return !!closest(event.target, $compareWith, insideShadowDom);
}
