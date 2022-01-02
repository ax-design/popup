export { };

declare global {
  interface Window {
    CSS?: CSS;
  }

  interface HTMLElement {
    attributeStyleMap: StylePropertyMap;
    computedStyleMap(): StylePropertyMap;
  }

  interface StylePropertyMap {
    readonly size: number;
    get(stylePropertyName: string): CSSStyleValue;
    set(stylePropertyName: string, value: CSSStyleValue | string): void;
  }

  interface CSS {
    px(value: number): CSSUnitValue;
    registerProperty(rule: CSSPropertyRule): void
  }

  interface CSSPropertyRule {
    name: string;
    syntax: string;
    initialValue: string | number | CSSUnitValue;
    inherits: boolean
  }

  interface CSSStyleValue {
    toString(): string;
    value: unknown;
  }

  interface CSSUnitValue extends CSSStyleValue {
    unit: string;
    value: number
  }

  interface CSSColorValue extends CSSStyleValue {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    value: string
  }

  interface CSSKeywordValue extends CSSStyleValue {
    value: string
  }
}