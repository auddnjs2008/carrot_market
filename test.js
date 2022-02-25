// 평균 규하기

const values = [1, 2, 3, 4, 5, 6];

const averages = values.reduce((acc, cur, i, { length }) => {
  return i === length - 1 ? (acc + cur) / length : acc + cur;
}, 0);

//최대값 구하기   => Math.max를 사용하는게 더 직관적

const maxValue = values.reduce((acc, cur) => {
  return acc > cur ? acc : cur;
}, 0);

// 요소의 중복횟 수 구하기

const fruits = ["banana", "apple", "ornage", "orange", "apple"];

const count = fruits.reduce((acc, cur) => {
  acc[cur] = (acc[cur] || 0) + 1;
  return acc;
}, {});

//중첩 배열 평탄화
const values = [1, [2, 3], 4, [5, 6]];

const flatValues = values.reduce((acc, cur) => acc.concat(cur), []);
