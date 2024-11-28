var name = 'lester';
const info = { a: 1, b: 2 };
info.c = name;
debugger;
console.log(info);

function add(name, value) {
  return 1;
}

export const sum = (p1, p2) => {
  const b = 1;
  return {
    b,
    name,
    ...info
  };
};

class A {
  say(word) {}
  move(x1, x2, x3) {
    const b = 1;
    const c = () => {};
    const d = (x, y) => {};
  }
}
