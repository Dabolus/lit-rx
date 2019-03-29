import {directive, NodePart, Part} from 'lit-html';
import {Observable} from 'rxjs';

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
    directive(<T>(value: Observable<T>) => (part: Part) => {
      if (!(part instanceof NodePart)) {
        throw new Error('observe can only be used in text bindings');
      }
      // If we've already set up this particular observable, we don't need
      // to do anything.
      if (value === part.value) {
        return;
      }

      // We nest a new part to keep track of previous item values separately
      // of the observable as a value itself.
      const itemPart = new NodePart(part.options);
      part.value = value;

      let i = 0;

      value.subscribe((v) => {
        // Check to make sure that value is the still the current value of
        // the part, and if not bail because a new value owns this part
        if (part.value !== value) {
          return;
        }

        // When we get the first value, clear the part. This let's the
        // previous value display until we can replace it.
        if (i === 0) {
          part.clear();
          itemPart.appendIntoPart(part);
        }

        itemPart.setValue(v);
        itemPart.commit();
        i++;
      });
    });
