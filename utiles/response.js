/**
 * Define every responses which we going to
 * use while building product CRUD.
 */

const httpStatus = require("http-status");

module.exports = {
  /**
   * successful response
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  ok: (res, options = { message: "data found" }) => {
    const opts = { statusCode: httpStatus.default.OK, ...options };
    return res.status(httpStatus.default.OK).send(opts);
  },

  /**
   * successful creation
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  created: (res, options = { message: "data inserted" }) => {
    const opts = { statusCode: httpStatus.default.CREATED, ...options };
    return res.status(httpStatus.default.CREATED).send(opts);
  },

  /**
   * Bad Request
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  badRequest: (res, options = { message: "bad request" }) => {
    const opts = { statusCode: httpStatus.default.BAD_REQUEST, ...options };
    return res.status(httpStatus.default.BAD_REQUEST).send(opts);
  },

  /**
   * No Data Found.
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  noData: (res, options = { message: "no data found" }) => {
    const opts = { statusCode: httpStatus.default.NOT_FOUND, ...options };
    return res.status(httpStatus.default.NOT_FOUND).send(opts);
  },

  /**
   * NO CONTENT
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  noContent: (res, options = { message: "no content" }) => {
    const opts = { statusCode: httpStatus.default.NO_CONTENT, ...options };
    return res.status(httpStatus["204"]).send(opts);
  },

  /**
   * Unauthorized
   * @param {Object<response>} res response object of express.js
   * @param {Object} options options.
   * @param {String} options.message message to be pass.
   * @param {Any}   options.data data be send.
   */

  unauthorized: (res, options = { message: "Unauthorized" }) => {
    const opts = { statusCode: httpStatus.default.UNAUTHORIZED, ...options };
    return res.status(httpStatus.default.UNAUTHORIZED).send(opts);
  },
};
