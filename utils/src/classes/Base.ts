abstract class BaseClass {
  abstract toJSON(): Record<string, any>;
  abstract toString(): string;
  abstract clone(): any;
}

export default BaseClass;
