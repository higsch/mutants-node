module.exports = {
  mutantDataPath: 'data/mutant_data.csv',
  shapePath: 'data/london.json',
  excludeVariants: [
    'B.1.1.1',
    'B.1.1.257',
    'B.1.1.315',
    'B.1.98'
  ],
  width: 2560 * 2,
  height: 1440 * 2,
  backgroundColor: '#FFFFFF',
  fillColor: '#FFFFFF',
  lastFillColor: '#333333',
  lineWidth: 0.6,
  alpha: 1.0,
  iterations: 13,
  dateLabels: [
    new Date(2020, 2, 1),
    new Date(2020, 7, 1),
    new Date(2021, 0, 1),
    new Date(2021, 1, 14)
  ],
  outputPath: 'output',
  outputFormat: 'png'
};
