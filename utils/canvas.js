const { createCanvas } = require('canvas');
const { geoMercator, geoPath } = require('d3');

const initCanvas = (width, height, backgroundColor = '#FFFFFF') => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  return [canvas, ctx];
};

const getCoordinates = (dataPoint, xScale, yScale, rScale) => {
  if (!dataPoint) return;

  const { sample_date: sampleDate, prob } = dataPoint;

  return {
    x: xScale(sampleDate),
    y: yScale(prob),
    r: rScale(prob)
  };
};

const drawSegment = (
    ctx,
    shape,
    projection,
    { x, y, r },
    { x: nextX = x, y: nextY = y, r:nextR = r } = {},
    iterations
  ) => {
  const width = 2 * r;
  const height = 2 * r;
  const nextWidth = 2 * nextR;
  const nextHeight = 2 * nextR;

  for (let i = 0; i < iterations; i++) {
    const progress = i / iterations;
    const interpolatedWidth = width + progress * (nextWidth - width);
    const interpolatedHeight = height + progress * (nextHeight - height);
    const interpolatedX = x + progress * (nextX - x);
    const interpolatedY = y + progress * (nextY - y);

    const scaledProjection = projection.fitSize([interpolatedWidth, interpolatedHeight], shape);
    const gPath = geoPath()
      .projection(scaledProjection)
      .context(ctx);

    ctx.setTransform(1, 0, 0, 1, interpolatedX, interpolatedY - interpolatedHeight);

    ctx.beginPath();
    gPath(shape);
    // ctx.arc(0, 0, interpolatedWidth / 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
};

const plotFlow = (
    ctx,
    data,
    shape,
    xScale,
    yScale,
    rScale,
    color1,
    color2,
    fillColor,
    lineWidth,
    alpha,
    iterations
  ) => {
  // some global canvas settings
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = color1;

  // get the projection
  const projection = geoMercator();

  // run through the data
  data.forEach((dataPoint, i, arr) => {
    const nextDataPoint = arr[i + 1];
    
    // get the coordinates
    const dataPointCoords = getCoordinates(dataPoint, xScale, yScale, rScale);
    const nextDataPointCoords = getCoordinates(nextDataPoint, xScale, yScale, rScale);

    // draw a segment
    drawSegment(ctx,
                shape,
                projection,
                dataPointCoords,
                nextDataPointCoords,
                iterations);
  });
};

module.exports = {
  initCanvas,
  plotFlow,
};
