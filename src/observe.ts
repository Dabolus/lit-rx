import {directive, Part} from 'lit-html';
import {Subscribable} from 'rxjs';

interface PreviousValue {
  readonly value: unknown;
  readonly subscribable: Subscribable<unknown>;
}

// For each part, remember the value that was last rendered to the part by the
// observe directive, and the subscribable that was last set as a value.
// The subscribable is used as a unique key to check if the last value
// rendered to the part was with observe. If not, we'll always re-render the
// value passed to observe.
const previousValues = new WeakMap<Part, PreviousValue>();

/**
 * A directive that renders the items of a subscribable, replacing
 * previous values with new values, so that only one value is ever rendered
 * at a time.
 *
 * @param value A subscribable
 */
export const observe =
    directive(<T>(subscribable: Subscribable<T>) => (part: Part) => {
      // If we have already set up this subscribable in this part, we
      // don't need to do anything
      const previousValue = previousValues.get(part);

      if (previousValue !== undefined &&
          subscribable === previousValue.subscribable) {
        return;
      }

      subscribable.subscribe((value) => {
        // If we have the same value and the same subscribable in the same part,
        // we don't need to do anything
        if (previousValue !== undefined && part.value === previousValue.value &&
            subscribable === previousValue.subscribable) {
          return;
        }

        part.setValue(value);
        part.commit();
        previousValues.set(part, {value, subscribable});
      });
    });
