// http://yui.yahooapis.com/3.18.1/build/yui/yui.js

const TOSTRING = Object.prototype.toString;

const TYPES = {
  'boolean': 'boolean',
  'undefined': 'undefined',
  'number': 'number',
  'string': 'string',
  '[object Function]': 'function',
  '[object RegExp]': 'regexp',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Error]': 'error'
};

export const type = (o: any): string => {
  return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

export const isFunction = (o: any): boolean => {
  return type(o) === 'function';
};

export const isNull = (o: any): boolean => {
  return o === null;
};

export const isNumber = (o: any): boolean => {
  return typeof o === 'number' && isFinite(o);
};

export const isObject = (o: any, failfn: boolean = false): boolean => {
  const t = typeof o;
  return (o && (t === 'object' ||
    (!failfn && (t === 'function' || isFunction(o))))) || false;
};

export const isPlainObject = (o): boolean => {
  return isObject(o, true);
};

export const isString = (o: any): boolean => {
  return typeof o === 'string';
};

export const isUndefined = (o: any): boolean => {
  return typeof o === 'undefined';
};

export const isArray = Array.isArray || ((o: any) => type(o) === 'array');

export const now = Date.now || (() => new Date().getTime());

export function addUnit(value: string | number) {
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return value + 'px'
  }
  return ''
}

export declare const extend: {
  <T, U>(target: T, source: U): T & U;
  <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
  <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
  (target: object, ...sources: any[]): any;
}

export function toObject<T>(arr: Array<T>): Record<string, T> {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export const off = function (
  element: any, event: string, handler: EventListenerOrEventListenerObject, useCapture = false,) {
  if (element && event && handler) {
    element.removeEventListener(event, handler, useCapture)
  }
}

export const on = function (
  element: any,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false,) {
  if (element && event && handler) {
    (element as any).addEventListener(event, handler, useCapture)
  }
}

export function renderThumbStyle({ move, size, bar }) {
  const style = {} as any
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate
  return style
}


function camelCase(name) {
  return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(/^moz([A-Z])/, 'Moz$1');
}

export function getStyle (element, styleName) {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    const computed = getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch(e) {
    return element.style[styleName];
  }
}

export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

export const setParm = (props) => {
  let label = "label";
  let value = "value";
  let child = "children";
  if (props) {
    if (isString(props)) {
      let obj = props.split(',');
      if (obj[0]) {
        label = obj[0];
      }
      if (obj[1]) {
        value = obj[1]
      }
      if (obj[2]) {
        child = obj[2]
      }
    } else if (isArray(props)) {
      if (props[0]) {
        label = props[0];
      }
      if (props[1]) {
        value = props[1]
      }
      if (props[2]) {
        child = props[2]
      }
    } else if (isObject(props)) {
      label = props.label;
      value = props.value;
      child = props.children;
    }
  }
  return { label, value, child }
}
