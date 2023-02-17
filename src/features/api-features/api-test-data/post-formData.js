const utils = require('../../../utils/api-util');

const formData = {};

const contentData = {
  'title': 'Test Post Request with Form Data',
  'description': 'Test Description',
  'date': '2020-03-03T00:00:00.000Z'
};

formData['content'] = JSON.stringify(contentData);
formData['action'] = 'Submit';
formData['attachment'] = utils.getFileDetailsForUpload('logo.png');

module.exports = {
  formData
};