import { ComputedStyleStorage, createStorage } from '../utils/ComputedStyleStorage.js';

export class AxMoveAway extends HTMLElement {
    static readonly ElementName = 'ax-move-away';
    static readonly pointerMoveAwayEvent = 'pointerMoveAway';
  
    private container: HTMLDivElement;
    private root = this.attachShadow({ mode: 'open' });
  
    private timeout: number | null = null;
    protected readonly computedStyle: ComputedStyleStorage;
  
    private cancelHideTask = () => {
      if (this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
      }
    }
  
    private scheduleHideTask = () => {
      this.cancelHideTask();
      const delay = this.computedStyle.getNumber('--move-away-delay');
      this.timeout = window.setTimeout(this.sendEvent, delay);
    }
  
    handlePointerLeave = () => {
      this.scheduleHideTask();
    }
  
    handlePointerEnter = () => {
      this.cancelHideTask();
    }
  
    private sendEvent = () => {
      this.dispatchEvent(new CustomEvent(AxMoveAway.pointerMoveAwayEvent));
    }
  
    adoptedCallback() {
      this.connectedCallback();
    }
  
    connectedCallback() {
      this.addEventListener('pointerleave', this.handlePointerLeave);
    }
  
    constructor() {
      super();
      this.root.innerHTML = `
        <div id="ax-move-away-root">
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
      this.computedStyle = createStorage(this.container);
    }
  }