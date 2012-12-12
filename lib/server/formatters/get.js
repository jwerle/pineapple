module.exports = function() {
  var formatter, formatters = {}
    , f

  for (formatter in this) {
    f = this[formatter]

    if (f.format && typeof f.call === 'function') {
      formatters[f.format] = f.call
    }
  }

  return formatters;
};