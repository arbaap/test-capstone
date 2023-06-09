function calculateBMR(gender, age, height, weight) {
  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return bmr;
}

module.exports = {
  calculateBMR,
};
