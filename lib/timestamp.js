/**
 * Tiny library to create and manipulate Unix timestamps
 * (i.e. defined as the number of seconds since Unix epoch time).
 */

var timestamp = module.exports = {},
    Constants = require('./Constants');

var DeltaRegExp = new RegExp('^\\s*' +
    '([-+]?)\\s*' +
    [ 'y', 'M', 'w', 'd', 'h', 'm', 's', 'ms' ]
        .map(function (t) { return '(?:(\\d+)\\s*' + t + ')?'; })
        .join('\\s*') +
    '\\s*$');

/**
 * Gets the current time as Unix timestamp.
 * Optionally applying a given delta specified as either a human-readable string or a number of
 * seconds.
 *
 * @param {String|Number} delta The optional delta time to apply
 * @returns {Number} The corresponding timestamp
 */
timestamp.now = function (delta) {
  var now = Date.now() / 1000;
  return delta ? timestamp.add(now, delta) : now;
};

/**
 * Applies the given delta to the given timestamp.
 * The delta is specified as either a human-readable string or a number of
 * seconds.
 *
 * @param {Number} time The original timestamp
 * @param {String|Number} delta The optional delta time to apply
 * @returns {Number} The corresponding timestamp
 */
timestamp.add = function (time, delta) {
  if (! isNumber(time)) {
    throw new Error('Time must be a number');
  }
  if (isString(delta)) {
    var matches = DeltaRegExp.exec(delta);
    if (! matches) {
      throw new Error('Expected delta string format: [+|-] [{years}y] [{months}M] [{weeks}w] ' +
          '[{days}d] [{hours}h] [{minutes}m] [{seconds}s] [{milliseconds}ms]');
    }
    delta = (matches[1] === '-' ? -1 : 1) * (
        (matches[2] || 0) * Constants.Year +
        (matches[3] || 0) * Constants.Month +
        (matches[4] || 0) * Constants.Week +
        (matches[5] || 0) * Constants.Day +
        (matches[6] || 0) * Constants.Hour +
        (matches[7] || 0) * Constants.Minute +
        (matches[8] || 0) * Constants.Second +
        (matches[9] || 0) * Constants.Millisecond
    );
  } else if (! isNumber(delta)) {
    throw new Error('Delta must be either a string or a number');
  }
  return time + delta;
};

/**
 * Gets the Unix timestamp for the given date object or string.
 *
 * @param {Date|String} date A date object or an ISO 8601 date string
 * @returns {Number} The corresponding timestamp
 */
timestamp.fromDate = function (date) {
  if (isString(date)) {
    date = new Date(date);
  } else if (! isDate(date)) {
    throw new Error('Expected either a string or a date');
  }
  return date.getTime() / 1000;
};

function isString(value) {
  return typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';
}

function isNumber(value) {
  return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
}

function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}