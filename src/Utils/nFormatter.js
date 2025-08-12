var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
function nFormatter(number) {
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;
  if (tier == 0) return number;
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  var scaled = number / scale;
  return scaled.toFixed(1) + suffix;
}

export default nFormatter;
