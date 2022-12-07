import pathFn from 'path'
import fs from 'fs'

export const projectPrefix = 'url_submission: '

export const readFileSync = (publicDir: string, filePath: string) => {
  return fs.readFileSync(pathFn.join(publicDir, filePath), 'utf8')
}

export const isMatchUrl = (s: string, p: string): boolean => {
  if (s === p) return true;

  const words = p.split(/\*+/g);

  if (words.length === 2 && words[0] === "" && words[1] === "") {
    return true;
  }
  if (words.length === 1 || (words.length === 2 && (words[0] === "" || words[1] === ""))) {
    return _check_regular(s, p);
  }
  if (!_check_includes(s, p)) return false;
  if (words.length >= 2) {
    return _check_fixs(s, words);
  }

  return false;
}

const _check_includes = (s: string, p: string) => {
  const words = Array.from(new Set(p.split(/\?|\*+/g).filter(Boolean)))
  if (
    words.some((word) => {
      return !s.includes(word);
    })
  ) {
    return false;
  }
  return true;
}
const _check_fixs = (s: string, words: string[]): boolean => {
  if (words.length >= 2) {
    const prefix = words[0];
    const suffix = words[words.length - 1];
    let str = s;
    if (suffix) {
      const matched = str.match(
        //@ts-ignore
        new RegExp(`^(.*?)${suffix.replaceAll("?", ".")}$`),
      );
      if (!matched) return false;
      str = matched[1];
    }
    if (prefix) {
      const matched = str.match(
        //@ts-ignore
        new RegExp(`^${prefix.replaceAll("?", ".")}(.*?)$`),
      );
      if (!matched) return false;
      str = matched[1];
    }
    const rest = words.slice(1, words.length - 1);
    return _check_words(str, rest);
  }
  return false;
}
const _check_regular = (s: string, p: string): boolean => {
  return new RegExp(
    //@ts-ignore
    "^" + p.replaceAll("?", ".").replaceAll(/\*+/g, '.*') + "$",
    "g",
  ).test(s);
}
const _check_words = (s: string, words: string[]): boolean => {
  if (words.length === 0) return true;
  const mid_index = words.reduce(
    (a, v, i) => (v.length > words[a].length ? i : a),
    Math.floor(words.length / 2),
  );
  const middle = words[mid_index];
  const matched_array = Array.from(
    //@ts-ignore
    s.matchAll(new RegExp(`${middle.replaceAll("?", ".")}`, "g")),
  );

  if (!matched_array.length) return false;
  matched_array.sort(() => Math.random() - 0.5);
  const first_half = words.slice(0, mid_index);
  const second_half = words.slice(mid_index + 1);
  return matched_array.some((matched) => {
    const length = matched[0].length;
    if ("number" !== typeof matched.index) return false;
    const left = s.slice(0, matched.index);
    const right = s.slice(matched.index + length);
    return _check_words(left, first_half) && _check_words(right, second_half);
  });
}

export const queue = (arr: any) => {
  let sequence = Promise.resolve()
  arr.forEach((item: any) => {
    sequence = sequence.then(item)
  })
  return sequence
}