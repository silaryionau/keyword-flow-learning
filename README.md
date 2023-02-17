# KeywordFlow README

## Install Dependencies

```
npm install
```

### Run Smoke test
```
npm run test-smoke
```

### Local/Debug Test Run 

Before run make sure you add a feature to specs in wdio.local.conf.js and add @debug tag in a feature file.

```
npm run test-local
```
### Test Run with yargs params
```
npm run test-local --TEST_ENV=LOCAL --BROWSER_NAME=chrome --instances=3 --tags=@smoke
```

### Open report
```
npm run allure:open
```
### Visual Regression Toolkit Setup
```
https://github.com/viktor-silakov/syngrisi
```
### Visual Test Run
```
npm run test-visual
```