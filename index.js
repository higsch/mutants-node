const config = require('./config');
const { initCanvas, plotFlow } = require('./utils/canvas');
const { loadMutantData, loadShape, exportToImage } = require('./utils/io');
const { defineScales } = require('./utils/scales');
const { variantColors } = require('./colors');

(async function main() {
  // read in data
  const data = await loadMutantData(config.mutantDataPath);
  const shape = await loadShape(config.shapePath);
  
  // define scales
  const { xScale, yScale, rScale } = defineScales(data, config.width, config.height);
  
  // plot
  const variants = [...new Set(data.map(d => d.variant))];
  for (variant of variants) {
    // loop through variants
    // one plot per variant
    console.log('\n===',
                `\nProcess variant ${variant}`,
                '\n===\n');

    // get canvas
    const [ canvas, ctx ] = initCanvas(config.width, config.height, config.backgroundColor);

    // get the colors
    const { color1, color2 } = variantColors.find(d => d.variant === variant);

    plotFlow(ctx,
             data.filter(d => d.variant === variant),
             shape,
             xScale,
             yScale,
             rScale,
             color1,
             color2,
             config.fillColor,
             config.lineWidth,
             config.alpha,
             config.iterations);

    // export image
    await exportToImage(canvas,
                        config.outputPath,
                        variant,
                        config.outputFormat);
  }
})();
