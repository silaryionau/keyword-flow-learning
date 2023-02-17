class WikiPage {

  constructor() {
  }

  // Different selectors of "Search Input" element with and without postfix "_Mobile"
  // were added to enable the use of the same elements for mobile and desktop versions
  get searchField_Mobile() { return 'input#searchInput'; }
  get searchField() { return '#searchInput'; }
  get searchButton() { return 'button[type=submit]'; }
  get emailVerifyForm() { return '#emailVerifyForm'; }
  get languageArticalsList() { return 'div.central-featured-lang'; }
  

}

module.exports = WikiPage;