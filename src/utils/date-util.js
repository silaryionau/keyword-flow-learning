module.exports = {

  /**
      * Return date in MM.DD.YYYY format for UK timezone
      * @returns {string} DateString
      */
  getCurrentDateWithDotSeparation: function () {
    const date = new Date();
    const options = {year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/London'};
    const currentDate = date.toLocaleDateString('en-UK', options);

    return currentDate.replace(/\//g, '.');
  }
};

