const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const csv = require('csv-parser');
const { timeParse, ascending } = require('d3');

const parseDate = timeParse('%Y-%m-%d');
const root = __dirname.replace('utils', '');

const _readCsv = async (filePath) => {
  return new Promise((resolve, reject) => {
    const promises = [];
    createReadStream(filePath)
      .pipe(csv())
      .on('data', row => promises.push(row))
      .on('error', reject)
      .on('end', async () => {
        await Promise.all(promises);
        resolve(promises);
      });
  });
};

const _readJson = (filePath) => {
  return require(filePath);
};

const loadMutantData = async (dataPath) => {
  const data = await _readCsv(path.join(root, dataPath));
  const parsedData = data.map((d) => {
    return {
      ...d,
      prob: +d.prob,
      sample_date: parseDate(d.sample_date)
    };
  });

  const filteredData = parsedData
    .filter(d => d.nhs_name === 'London')
    .sort((a, b) => ascending(a.sample_date, b.sample_date));

  return filteredData;
};

const loadShape = async (shapePath) => {
  const json = await _readJson(path.join(root, shapePath));
  const { features } = json;

  return features.find(d => d.properties.EER13NM === 'London');
};

const exportToImage = (canvas, outputPath, name, format) => {
  return new Promise((resolve) => {
    const o = path.join(root, outputPath, `${name.replace(/[\s\\\/]/g, '_')}.${format}`);
    const out = createWriteStream(o);

    let stream;
    if (format === 'png') {
      stream = canvas.createPNGStream();
    } else if (format === 'jpg') {
      stream = canvas.createJPEGStream();
    }
    stream.pipe(out);

    out.on('close', () => {
      console.log('\n===',
                  `\nImage exported to ${o}`,
                  '\n===\n');
      resolve();
    });
  });
};

module.exports = {
  loadMutantData,
  loadShape,
  exportToImage
};
