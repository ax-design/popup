export enum PopupPosition {
    TopLeft = 'top-left',
    Top = 'top',
    TopRight = 'top-right',
    Right = 'right',
    BottomRight = 'bottom-right',
    Bottom = 'bottom',
    BottomLeft = 'bottom-left',
    Left = 'left',
}

const ADJUST_X_MAP: Record<PopupPosition, PopupPosition> = {
    [PopupPosition.TopLeft]: PopupPosition.TopRight,
    [PopupPosition.Top]: PopupPosition.Top,
    [PopupPosition.TopRight]: PopupPosition.TopLeft,
    [PopupPosition.Right]: PopupPosition.Left,
    [PopupPosition.BottomRight]: PopupPosition.BottomLeft,
    [PopupPosition.Bottom]: PopupPosition.Bottom,
    [PopupPosition.BottomLeft]: PopupPosition.BottomRight,
    [PopupPosition.Left]: PopupPosition.Right,
}

const ADJUST_Y_MAP: Record<PopupPosition, PopupPosition> = {
    [PopupPosition.TopLeft]: PopupPosition.BottomLeft,
    [PopupPosition.Top]: PopupPosition.Bottom,
    [PopupPosition.TopRight]: PopupPosition.BottomRight,
    [PopupPosition.Right]: PopupPosition.Right,
    [PopupPosition.BottomRight]: PopupPosition.TopRight,
    [PopupPosition.Bottom]: PopupPosition.Top,
    [PopupPosition.BottomLeft]: PopupPosition.TopRight,
    [PopupPosition.Left]: PopupPosition.Left,
}

/**
 * Popup options
 * @param position The position parameter.
 * @param noIteration Recalculate if `$target` touched the boundary of 
 *          the window.
 */
export interface IPopupOption {
    position: PopupPosition;
    noIteration?: boolean;
}

/**
 * Get position of `$target` element.
 * @param $anchor Element of the anchor, the element of popup docked to.
 * @param $target The element that docked to the `$anchor`.
 * @param options Configurations of the docking.
 * @returns x and y position in pixel.
 */
export const getTargetPosition = (
    $anchor: HTMLElement,
    $target: HTMLElement,
    options: IPopupOption
): [number, number] => {
    const anchorBox = $anchor.getBoundingClientRect();
    const targetBox = $target.getBoundingClientRect();

    let x: number = 0
        , y: number = 0;

    const { position } = options;

    const alignToY0 = position === PopupPosition.Top
        || position === PopupPosition.TopLeft
        || position === PopupPosition.TopRight;
    
    const alignToY1 = position === PopupPosition.Left
        || position === PopupPosition.Right;
    
    const alignToY2 = position === PopupPosition.Bottom
        || position === PopupPosition.BottomLeft
        || position === PopupPosition.BottomRight;
    
    const alignToX0 = position === PopupPosition.Left
        || position === PopupPosition.BottomLeft
        || position === PopupPosition.BottomRight;
    
    const alignToX1 = position === PopupPosition.Top
        || position === PopupPosition.Bottom;
    
    const alignToX2 = position === PopupPosition.Right
        || position === PopupPosition.TopRight
        || position === PopupPosition.BottomRight;

    if (alignToY0) {
        y = anchorBox.top - targetBox.height;
    }

    if (alignToY2) {
        y = anchorBox.bottom;
    }

    if (alignToY1) {
        const anchorCenter = anchorBox.top + anchorBox.height;
        y = anchorCenter - targetBox.height / 2;
    }

    if (alignToX0) {
        x = anchorBox.left;
    }

    if (alignToX2) {
        x = anchorBox.right;
    }

    if (alignToX1) {
        const anchorCenter = anchorBox.left + anchorBox.width;
        x = anchorCenter - targetBox.width / 2;
    }

    const exceedLeftBoundary = (x < 0) && alignToX0;
    const exceedRightBoundary = (x + targetBox.width > window.innerWidth) && alignToX2;
    const exceedTopBoundary = (y < 0) && alignToY0;
    const exceedBottomBoundary = (y + targetBox.height > window.innerHeight) && alignToY2;

    // @ts-ignore: Need this behavior
    const needRecalculateX = exceedLeftBoundary + exceedRightBoundary === 1;
    // @ts-ignore
    const needRecalculateY = exceedTopBoundary + exceedBottomBoundary === 1;

    let nextPosition = position;
    if (needRecalculateX) {
        nextPosition = ADJUST_X_MAP[nextPosition];
    }
    if (needRecalculateY) {
        nextPosition = ADJUST_Y_MAP[nextPosition];
    }

    const needRecalculatePosition = needRecalculateX || needRecalculateY;

    if (needRecalculatePosition && !options.noIteration) {
        return getTargetPosition($anchor, $target, { position: nextPosition, noIteration: true });
    }

    return [Math.round(x), Math.round(y)];
}