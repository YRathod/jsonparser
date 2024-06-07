function fakejsonParser(str) {
  let i = 0;

  return parseValue();

  function parseObject() {
    if (str[i] == "{") {
      i++;
      skipWhiteSpaces();

      let results = {};

      let initial = true;

      while (str[i] !== "}") {
        skipWhiteSpaces();

        if (!initial) {
          skipComma();
          skipWhiteSpaces();
        }

        let key = parseString();

        skipWhiteSpaces();

        skipColon();

        let value = parseValue();
        results[key] = value;
        initial = false;
      }
      i++;

      return results;
    }
  }

  function parseArray() {
    if (str[i] == "[") {
      i++;
      skipWhiteSpaces();
      let initial = true;

      let results = [];
      while (str[i] !== "]") {
        if (!initial) {
          skipComma();
          skipWhiteSpaces();
        }
        const value = parseValue();
        results.push(value);
        initial = false;
      }
      i++;
      return results;
    }
  }
  function skipComma() {
    if (str[i] !== ",") {
      throw new Error('Expected ",".');
    }
    i++;
  }
  function skipWhiteSpaces() {
    while (
      str[i] === "" ||
      str[i] === "\n" ||
      str[i] === "\t" ||
      str[i] === "\r"
    ) {
      i++;
    }
  }

  function skipColon() {
    if (str[i] !== ":") {
      throw new Error('Expected ":".');
    }
    i++;
  }
  function isHexaDecimal(char) {
    return (
      (char >= "0" && char <= "9") ||
      (char.toLowerCase() >= "a" && char.toLowerCase() <= "f")
    );
  }
  function parseString() {
    if (str[i] === '"') {
      i++;
      let results = "";
      while (str[i] !== '"') {
        if (str[i] === "\\") {
          const char = str[i + 1];
          if (
            char === '"' ||
            char === "/" ||
            char === "\\" ||
            char === "b" ||
            char === "f" ||
            char === "n" ||
            char === "r" ||
            char === "t"
          ) {
            results += char;
            i++;
          } else if (char === "u") {
            if (
              isHexaDecimal(str[i + 2]) &&
              isHexaDecimal(str[i + 3]) &&
              isHexaDecimal(str[i + 4]) &&
              isHexaDecimal(str[i + 5])
            ) {
              results += String.fromCharCode(
                parseInt(str.slice(i + 2, i + 6), 16)
              );
              i += 5;
            }
          }
        } else {
          results += str[i];
        }
        i++;
      }
      i++;
      return results;
    }
  }

  function parseNumber() {
    let start = i;
    if (str[i] === "-") {
      i++;
    }
    if (str[i] === "0") {
      i++;
      while (str[i] === "0") {
        i++;
      }
    } else if (str[i] >= "1" && str[i] <= "9") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (str[i] == ".") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (str[i] === "e" || str[i] === "E") {
      i++;
      if (str[i] === "-" || str[i] === "+") {
        i++;
      }
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (i > start) {
      return Number(str.slice(start, i));
    }
  }
  function parseKeyword(name, value) {
    if (str.slice(i, name.length) === name) {
      i += name.length;
      return value;
    }
  }
  function parseValue() {
    skipWhiteSpaces();
    let value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword("true", true) ??
      parseKeyword("false", false) ??
      parseKeyword("null", null);
    skipWhiteSpaces();
    return value;
  }
}

const obj = { one: "one", two: [1, 2, 3, 4] };
const o = fakejsonParser(JSON.stringify(obj));
console.log(o);
