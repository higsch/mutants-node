const { scaleLinear, scaleSqrt, extent } = require('d3');

const defineScales = (data, width, height) => {
  // x scale
  const xScale = scaleLinear()
    .domain(extent(data, d => d.sample_date))
    .range([0, width]);

  // y scale
  const yScale = scaleLinear()
    .domain([0, 1]) // it is a probability
    .range([height, 0]);

  // r scale
  const rScale = scaleSqrt()
    .domain([0, 1])
    .range([0, height / 3]);

  return {
    xScale,
    yScale,
    rScale
  };
};

module.exports = {
  defineScales
};
