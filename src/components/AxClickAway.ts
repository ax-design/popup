import { ifPointerAway } from '../utils/ifPointerAway.js';

export class AxClickAway extends HTMLElement {
    static readonly ElementName = 'ax-click-away';
    static readonly pointerClickAwayEvent = 'pointerClickAway';
    private root = this.attachShadow({ mode: 'open' });

    private ifPointerAway: ReturnType<typeof ifPointerAway>;

    handleClick = (event: MouseEvent) => {
        if (!this.ifPointerAway(event)) {
            this.dispatchEvent(new CustomEvent(AxClickAway.pointerClickAwayEvent));
        }
    }

    adoptedCallback() {
        this.connectedCallback();
    }

    connectedCallback() {
        window.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        window.removeEventListener('click', this.handleClick);
    }

    constructor() {
        super();
        this.root.innerHTML = `
        <div id="ax-click-away-root">
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

        this.ifPointerAway = ifPointerAway('#ax-click-away-root', true);
    }
}