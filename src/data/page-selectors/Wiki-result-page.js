class WikiResultPage {

  constructor() {
  }

  // Different selectors of "Search Input" element with and without postfix "_Mobile"
  // were added to enable the use of the same elements for mobile and desktop versions
  // And may be editted in /src/features/support/parameter-types.js with 'locator' strategy
  get resultHeader() { return '#firstHeading'; }
  get resultHeader_Mobile() { return '#section_0'; }
  get infoBoxRowCss() { return '.infobox tr'; }
  get infoBoxHeaderCellCss() { return '.infobox th'; }
  get infoBoxDataCellCss() { return '.infobox td'; }
  get infoBoxRowXPath() { return '//*[@id="mw-content-text"]/div/table[1]//tr'; }
  get infoBoxHeaderCellXPath() { return '//*[@id="mw-content-text"]/div/table[1]//th'; }
  get infoBoxDataCellXPath() { return '//*[@id="mw-content-text"]/div/table[1]//td'; }
  get infoBoxPortrait() { return '.infobox.biography.vcard .infobox-image .image img'; }
}

module.exports = WikiResultPage;