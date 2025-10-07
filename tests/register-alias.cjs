const Module = require('module');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distRoot = path.join(projectRoot, '.test-dist');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    const relativeRequest = request.slice(2);
    const resolvedPath = path.join(distRoot, relativeRequest);
    return originalResolveFilename.call(this, resolvedPath, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
