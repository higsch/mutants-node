const { scaleLinear, scaleSqrt, extent } = require('d3');

const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 20
};

const defineScales = (data, width, height) => {
  // r scale
  const rScale = scaleSqrt()
    .domain([0, 1])
    .range([0, (height - margin.top - margin.bottom) / 3]);

  // y scale
  const yScale = scaleLinear()
    .domain([0, 1]) // it is a probability
    .range([height - margin.bottom, margin.top + 2 * rScale.range()[1]]);

  // x scale
  const xScale = scaleLinear()
    .domain(extent(data, d => d.sample_date))
    .range([margin.left, width - margin.right - 2 * rScale.range()[1]]);

  return {
    xScale,
    yScale,
    rScale
  };
};

module.exports = {
  defineScales
};
