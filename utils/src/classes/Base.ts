abstract class BaseClass {
  abstract toJSON(): Record<string, any>;
  abstract clone(): any;
  toString(): string {
    return JSON.stringify(this.toJSON());
  }
}

export default BaseClass;
