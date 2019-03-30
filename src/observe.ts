import {directive, Part} from 'lit-html';
import {Subscribable} from 'rxjs';

interface PreviousValue {
  readonly value: unknown;
  readonly observable: Subscribable<unknown>;
}

// For each part, remember the value that was last rendered to the part by the
// observe directive, and the observable that was last set as a value.
// The observable is used as a unique key to check if the last value
// rendered to the part was with observe. If not, we'll always re-render the
// value passed to observe.
const previousValues = new WeakMap<Part, PreviousValue>();

/**
 * A directive that renders the items of an observable[1], replacing
 * previous values with new values, so that only one value is ever rendered
 * at a time.
 *
 * [1]: http://reactivex.io/documentation/observable.html
 *
 * @param value An observable
 */
export const observe =
    directive(<T>(observable: Subscribable<T>) => (part: Part) => {
      // If we have already set up this observable in this part, we
      // don't need to do anything
      const previousValue = previousValues.get(part);

      if (previousValue !== undefined &&
          observable === previousValue.observable) {
        return;
      }

      observable.subscribe((value) => {
        // If we have the same value and the same observable in the same part,
        // we don't need to do anything
        if (previousValue !== undefined && part.value === previousValue.value &&
            observable === previousValue.observable) {
          return;
        }

        part.setValue(value);
        part.commit();
        previousValues.set(part, {value, observable});
      });
    });
