import { version } from '../package.json';

// Export as a string so Metro can bundle it at compile time
const s = JSON.stringify({ver:version});
const injectedJS = `
(function () {
    glBxNexusApp = ${s};
})();
`;

export default injectedJS;