import path from 'path';


const mainModule = require.main;
const mainFilename = mainModule ? mainModule.filename : '';
const dirname = path.dirname(mainFilename);

export default dirname;
// module.exports = path.dirname(require.main.filename);