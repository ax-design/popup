import { AxMoveAway } from './AxMoveAway.js';
import { AxClickAway } from './AxClickAway.js';

import { getTargetPosition, PopupPosition } from '../utils/getTargetPosition.js';

export class AxPopup extends HTMLElement {
    static readonly ElementName = 'ax-popup';
    static readonly openEvent = 'open';
    static readonly closeEvent = 'close';

    private container: HTMLDivElement;
    private target: HTMLElement | null = null;
    private root = this.attachShadow({ mode: 'open' });

    set open(x: boolean) {
        x ? this.handleOpen() : this.handleClose();
    }

    get open() {
        return !!this.target;
    }

    private acquireTargetElement = () => {
        const selector = this.getAttribute('target');
        if (!selector) return null;

        const $target = document.querySelector(`#${selector}`) as HTMLElement;
        if (!($target instanceof AxClickAway || $target instanceof AxMoveAway)) {
            return null;
        }
        this.target = $target;

        return this.target;
    }

    private handleClose = () => {
        window.requestAnimationFrame(() => {
            if (!this.target) return;
            this.target.removeEventListener(AxMoveAway.pointerMoveAwayEvent, this.handleClose);
            this.target.removeEventListener(AxClickAway.pointerClickAwayEvent, this.handleClose);
            this.target.style.visibility = 'hidden';
            this.target.setAttribute('aria-expanded', 'false');
            this.target = null;
        });
    }

    private handleOpen = () => {
        const $target = this.acquireTargetElement();
        if (!this.target || !$target) return;

        const position = (this.getAttribute('position') || PopupPosition.BottomLeft) as PopupPosition;

        if (!Object.values(PopupPosition).includes(position)) {
            return;
        }

        const [x, y] = getTargetPosition(this, this.target, { position });

        document.body.appendChild(this.target);
        this.target.style.top = `${y}px`;
        this.target.style.left = `${x}px`;
        this.target.style.visibility = 'visible';
        this.target.style.position = 'absolute';
        this.target.setAttribute('aria-expanded', 'true');

        window.requestAnimationFrame(() => {
            $target.addEventListener(AxMoveAway.pointerMoveAwayEvent, this.handleClose);
            $target.addEventListener(AxClickAway.pointerClickAwayEvent, this.handleClose);
        });
    }

    handleClick = (event: MouseEvent) => {
        if (event.target === this) {
            return;
        }

        this.handleOpen();
    }

    adoptedCallback() {
        this.connectedCallback();
    }
    connectedCallback() {
        this.container.addEventListener('click', this.handleClick);
    }

    initializeTargetStyle = () => {
        const $target = this.acquireTargetElement();
        if (!$target) return;
        $target.style.visibility = 'hidden';
    }

    constructor() {
        super();
        this.root.innerHTML = `
      <div>
        <slot></slot>
      </div>
      <style>
        div { display: block; width: 100%; height: 100%; }
        :host { display: inline-block; }
        :host([block]) { display: block; }
        :host([inline-block]) { display: inline-block; }
        :host([flex]) { display: flex; }
        :host([inline-flex]) { display: inline-flex; }
        :host([grid]) { display: grid; }
        :host([inline-grid]) { display: inline-grid; }
      </style>`;

        this.container = this.root.querySelector('div')!;
        this.setAttribute('aria-haspopup', 'true');

        window.addEventListener(
            'DOMContentLoaded',
            this.initializeTargetStyle,
            { once: true }
        );

        this.initializeTargetStyle();
    }
}
