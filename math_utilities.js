const SUPER_MAP = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

function randomInt(minVal, maxVal)
{
    return Math.round(Math.random() * (maxVal - minVal) + minVal);
}

function randomBool()
{
  return Math.random() < 0.5;
}

function toMappedCharacter(value, map) {
  if (value == 1) {
    return ""
  }

  var returnedString = ""
  if (value < 0) {
    returnedString += "⁻"
    value *= -1
  }

  return returnedString + value.toString().replace(/[0123456789]/g, function(match) {
      return map[match]
  })
}

function getExponentString(value) {
  return toMappedCharacter(value, SUPER_MAP)
}

function getSimplifiedTerm(exponent, ignoreZero = false) {
  if (!ignoreZero && exponent == 0) {
    return "1"
  }
  else {
    return "x" + getExponentString(exponent)
  }
}

function createConcept01() {
  var base = getRandomElement(["a", "x", "y", "z", "m", "n", "3", "4", "(-2)"])

  var firstExponent = randomInt(1, 9)
  var secondExponent = randomInt(1, 9)

  var sum = firstExponent + secondExponent

  while (sum < 2 || sum > 9) {
     firstExponent = randomInt(1, 9)
     secondExponent = randomInt(1, 9)
     sum = firstExponent + secondExponent
  }

  var firstTerm = base + getExponentString(firstExponent)
  var secondTerm = base + getExponentString(secondExponent)

  return {
    numerator: firstTerm + " ⋅ " + secondTerm,
    promptNumerator: base + "▀",
    answer: sum,
    answerNumerator: base + getExponentString(sum)
  }
}

function createConcept02() {
  var base = getRandomElement(["b", "x", "y", "z", "t", "2", "5", "(-3)"])

  var firstExponent = randomInt(1, 4)
  var secondExponent = randomInt(1, 4)
  var thirdExponent = randomInt(1, 4)

  var sum = firstExponent + secondExponent + thirdExponent

  while (sum < 2 || sum > 9) {
     firstExponent = randomInt(1, 4)
     secondExponent = randomInt(1, 4)
     thirdExponent = randomInt(1, 4)
     sum = firstExponent + secondExponent + thirdExponent
  }

  var firstTerm = base + getExponentString(firstExponent)
  var secondTerm = base + getExponentString(secondExponent)
  var thirdTerm = base + getExponentString(thirdExponent)

  return {
    numerator: firstTerm + " ⋅ " + secondTerm + " ⋅ " + thirdTerm,
    promptNumerator: base + "▀",
    answer: sum,
    answerNumerator: base + getExponentString(sum)
  }
}

function createConcept03() {
  var base = getRandomElement(["c", "x", "y", "w", "h", "4", "7", "(-2)"])

  var innerExponent = randomInt(2, 4)
  var outerExponent = randomInt(2, 9)
  var product = innerExponent * outerExponent

  while (product < 2 || product > 9) {
    innerExponent = randomInt(2, 4)
    outerExponent = randomInt(2, 9)
    product = innerExponent * outerExponent
  }

  var term = base + getExponentString(innerExponent)

  return {
    numerator: "(" + term + ")" + getExponentString(outerExponent),
    promptNumerator: base + "▀",
    answer: product,
    answerNumerator: base + getExponentString(product)
  }
}

function createConcept04() {
  var base = getRandomElement(["d", "x", "y", "z", "t", "2", "3", "(-3)"])

  var topExponent = randomInt(3, 9)
  var bottomExponent = randomInt(1, 8)
  var difference = topExponent - bottomExponent

  while (difference < 2 || difference > 9) {
    topExponent = randomInt(3, 9)
    bottomExponent = randomInt(1, 8)
    difference = topExponent - bottomExponent
  }

  return {
    numerator: base + getExponentString(topExponent),
    denominator: base + getExponentString(bottomExponent),
    promptNumerator: base + "▀",
    answer: difference,
    answerNumerator: base + getExponentString(difference)
  }
}

function createConcept05() {
  var base = getRandomElement(["x", "y", "z", "h", "2", "3", "4"])

  var firstTopExponent = randomInt(1, 9)
  var secondTopExponent = randomInt(1, 9)
  var bottomExponent = randomInt(1, 9)
  var result = firstTopExponent + secondTopExponent - bottomExponent

  while (result < 2 || result > 9) {
    firstTopExponent = randomInt(1, 9)
    secondTopExponent = randomInt(1, 9)
    bottomExponent = randomInt(1, 9)
    result = firstTopExponent + secondTopExponent - bottomExponent
  }

  return {
    numerator: base + getExponentString(firstTopExponent) + " ⋅ " + base + getExponentString(secondTopExponent),
    denominator: base + getExponentString(bottomExponent),
    promptNumerator: base + "▀",
    answer: result,
    answerNumerator: base + getExponentString(result)
  }
}
