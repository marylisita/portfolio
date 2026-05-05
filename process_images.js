const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'C:\\Users\\maryl\\Desktop\\siteportfolio novo\\img\\isadora vertical';
const outputDir = path.join(__dirname, 'public', 'img', 'isadora_vertical');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Support both png and jpg
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    // Replace extension properly
    const outputPath = path.join(outputDir, file.replace(/\.(png|jpe?g)$/i, '.webp'));
    
    console.log(`Processing ${file}...`);
    try {
      await sharp(inputPath)
        .resize({ height: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved to ${outputPath}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
}

processImages();
