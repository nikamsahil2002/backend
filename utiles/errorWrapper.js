
exports.errorWrapper = (func) => (...args) => func(...args).catch(args[2]);