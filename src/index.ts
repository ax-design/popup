import { AxPopup } from './components/AxPopup';
import { AxMoveAway } from './components/AxMoveAway';
import { AxClickAway } from './components/AxClickAway';

export function register() {
    // @ts-ignore
    if (window.CSS && window.CSS.registerProperty) {
        customElements.define(AxMoveAway.ElementName, AxMoveAway);
        customElements.define(AxClickAway.ElementName, AxClickAway);
        customElements.define(AxPopup.ElementName, AxPopup);

        window.CSS.registerProperty({
            name: '--move-away-delay',
            syntax: '<number>',
            initialValue: 1000,
            inherits: true
        });
    } else {
        console.warn('Your browser do NOT support `CSS.registerProperty` method, register failed!');
    }
}

export { PopupPosition } from './utils/getTargetPosition';