# lit-rx
## RxJS utils to be used with lit-html.
### Usage
#### subscribe
The subscribe directive can be used to render data emitted by a subscribable or 
by a promise like.

It works pretty much like Angular's async pipe and it can be binded to any type 
of lit-html template part (content binding, attribute bounding, boolean 
attribute binding, event binding and property binding should all work).

Here is a tiny example that binds an observable to a boolean attribute:
```js
import { html, render } from 'lit-html';
import { from } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { subscribe } from 'lit-rx'; // or 'lit-rx/subscribe'

const dataPromise = new Promise(resolve => setTimeout(() => resolve('data'), 3000));

const loading$ = from(dataPromise).pipe(
  map(data => !data),
  startWith(true),
);

render(
  html`<my-loading ?shown="${subscribe(loading$)}"></my-loading>`,
  document.body,
);
```
