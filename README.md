# GA Calc

## About

A small PWA to determine [gestational age](https://en.wikipedia.org/wiki/Gestational_age) based on [mean sac diameter](https://en.wikipedia.org/wiki/Gestational_sac).

I made this app to explore the PWA space, get familiar with the offline capabilities afforded by ServiceWorkers, and to pursue a perfect 100 across all Lighthouse audits - [which I have](https://twitter.com/chrstntdd/status/1234182168253026304?s=20)

## Building the repo

To begin, clone the repo and open the directory

```shell
$ git clone https://github.com/chrstntdd/ga-calc.git && cd ga-calc
```

Then install the project dependencies

```shell
$ yarn install
```

Start the development server

```shell
$ yarn start
```

Finally, open your browser to `http://localhost:8080/` to view the app

## Technology

- [Preact 10](https://preactjs.com/)
- [Linaria](https://linaria.now.sh/)
- [Normalize.css](https://necolas.github.io/normalize.css/)
- [PurgeCSS](https://purgecss.com/)
- [ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Terser](https://terser.org/)
- [Babel 7](https://babeljs.io/)
- [Webpack 4](https://webpack.js.org/)

## Build process

As stated above, for development, `webpack-dev-server` does all the heavy lifting for us.

For production, the process is a bit more involved to squeeze out every last drop of performance.

First, we transpile our `src` files to the `build` folder at the root of the project. The output is plain JS, compiled by Babel, mirroring our `src` directory.
Next, we run `webpack` in production mode, writing to the `dist` folder at the `root`. This directory will contain the `index.html`, JavaScript in `js/**` and the CSS in `css/**`.
Following that, there are some custom scripts (`scripts/build.ts`) that use the output of the previous two steps to bring it all together.

At a high level, the build script is responsible for the following:

- Adding `link` `rel="preload"` tags to the head of `index.html`
- Adding `script` tags to `index.html`
- Inlining the small webpack runtime chunk into `index.html`
- Inlining critical CSS into the head of `index.html`
- Minifying `index.html`
- Copying the contents of `src/assets` to `dist/images`
- Moving the pre-compiled `service-worker.js` file to `dist/sw.js` & adding in the correct file names of the emitted assets that have to be pre-cached (the JS modules, webmanifest, and the `index.html` page itself).
- Minifying the newly created `dist/sw.js` file

## Todo

- [ ] Input validation? (`inputMode="decimal"` seems to work well enough)
- [ ] Smooth out ServiceWorker integration
  - [ ] Offline messaging
  - [ ] Update messaging
  - [ ] Integrate w/ build process
- [ ] Pre-render? (work out bugs w/ hydrating inputs and using persisted `localStorage` state)
- [ ] Tests 😅
- [ ] Differential serving
