const { dataStoreHelper } = require('keywordflow-wdio-js-lib');

const replaceAllParamsInString = async (str) => {
  const regexpGlob = /(\/|&|\?|=|")/;
  let allParams = str.split(regexpGlob);
  if (allParams !== null) {
    allParams.forEach((param) => {
      if (param.startsWith('$')) {
        let paramName = param.slice(1);
        // eslint-disable-next-line no-undefined
        if (dataStoreHelper.getData(paramName) !== undefined)
          str = str.replace(param, dataStoreHelper.getData(paramName));
        else
          str = str.replace(param, global.uniqueMap[`${paramName}`]);
      }
    });
  }

  return str;
};
module.exports = {
  replaceAllParamsInString
};
