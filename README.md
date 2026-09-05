# TINS Website

This is partial code for the website for the TINS GameJam

https://tins.amarillion.org

I'm slowly migrating the old multi-page django-based website to a new single page application backed by a django-based API. As I migrate page by page, they will appear in this repository.

## Building and running

To run this (partial) website

```
npm install
npm run dev
```

Then browse to http://localhost:8080/static/


## Playwright tests

First time setup:

```
npm install
npx playwright install --with-deps chromium
```

Run tests:

```
npm run test:pw
```

## License

This code is open source according to the MIT License. See: [LICENSE](./LICENSE)