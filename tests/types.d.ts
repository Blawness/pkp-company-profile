import "bun:test";
import "@testing-library/jest-dom";

declare module "bun:test" {
  interface Matchers<T> extends jest.Matchers<void, T> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toBeEmptyDOMElement(): T;
    toBeInvalid(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toContainElement(element: HTMLElement | SVGElement | null): T;
    toContainHTML(html: string): T;
    toHaveAccessibleDescription(description?: string | RegExp): T;
    toHaveAccessibleName(name?: string | RegExp): T;
    toHaveAttribute(attr: string, value?: unknown): T;
    toHaveClass(...classNames: string[]): T;
    toHaveFocus(): T;
    toHaveFormValues(values: { [key: string]: unknown }): T;
    toHaveStyle(style: string | { [key: string]: unknown }): T;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): T;
    toHaveValue(value?: string | string[] | number): T;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T;
    toBeChecked(): T;
    toBePartiallyChecked(): T;
    toHaveDescription(description?: string | RegExp): T;
  }
}

