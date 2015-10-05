# islider
**islider** stands for **I**tem **slider**. It uses animate.css to make slideshows more animated. An example will be available soon.

## Usage
This is the markup needed:
```html
<div class="my-slider">
  <div class="slide">
    <h1 class="slide-item">Title One</h1>
    <p class="slide-item">Content one</p>
  </div>
  <div class="slide">
    <h1 class="slide-item">Title One</h1>
    <p class="slide-item">Content one</p>
  </div>
</div>
```

And the js:
```js
$('.my-slider').iSlider();
```

Done. Your slideshow is fully animated now.

If you don't want to use animate.css for the animations (or you're not linking it directly to your HTML), you can do:
```js
$('.my-slider').iSlider({
  useAnimateCss: false
});
```
Otherwise, it will check if animate.css is linked to your HTML page.

All config options will be listed here soon, for now, you can take a look at the code.
