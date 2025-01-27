export function unthrow<T>(operation: (...args: unknown[]) => T) {
  try {
    return operation();
  } catch (error) {
    return error as Error;
  }
}

declare global {
  namespace globalThis {
    class Result<T, E> {
      static success<T>(x: T): Result<T, never>;
      static fail<E>(x: E): Result<never, E>;
      isSuccess(): boolean;
      isFail(): boolean;
      get value(): T | E;
    }
  }
}

class Result<T, E> {
  #tag: 'success' | 'fail';
  #value: T | E;

  constructor(tag: 'success' | 'fail', value: T | E) {
    this.#tag = tag;
    this.#value = value;
  }

  static success<T>(x: T) {
    return new Result<T, never>('success', x);
  }

  static fail<E>(x: E) {
    return new Result<never, E>('fail', x);
  }

  isSuccess() {
    this.#tag === 'success';
  }

  isFail() {
    this.#tag === 'fail';
  }

  public get value(): T | E {
    return this.#value;
  }
}

Object.defineProperty(globalThis, 'Result', Result);
