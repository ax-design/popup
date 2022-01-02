const findParentShadowRoot = (x: Node | undefined | null): ShadowRoot | null => {
    if (!x) return null;
    if (x.parentNode && x.parentNode.nodeType === document.DOCUMENT_FRAGMENT_NODE) {
        return x.parentNode as ShadowRoot;
    }
    return findParentShadowRoot(x.parentNode);
}

/**
 * Find closest element of specific selector, supports ShadowDOM.
 * @param $dom The start point.
 * @param selector The selector to search for.
 * @param insideShadowDom The search range is inside the ShadowDOM not.
 * @returns The result HTML element.
 */
export const closest = ($dom: Element, selector: string, insideShadowDom: boolean): Element | null => {
    const r = $dom.closest(selector);
    if (r) return r;
    if (insideShadowDom) return null;

    const host = findParentShadowRoot($dom)?.host;
    if (!host) return null;
    return closest(host, selector, insideShadowDom);
}