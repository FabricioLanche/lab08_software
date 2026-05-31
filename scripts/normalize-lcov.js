const fs = require('fs');
const path = require('path');

const services = ['notification-service', 'restaurant-service', 'rewards-service'];
const baseDir = path.resolve(__dirname, '..');

for (const service of services) {
  const lcovPath = path.join(baseDir, 'services', service, 'coverage', 'lcov.info');
  if (!fs.existsSync(lcovPath)) continue;

  let content = fs.readFileSync(lcovPath, 'utf8');
  const prefix = `services/${service}`;

  content = content.replace(/^SF:(.+)$/gm, (match, sfPath) => {
    const normalized = sfPath.replace(/\\/g, '/');
    return `SF:${prefix}/${normalized}`;
  });

  fs.writeFileSync(lcovPath, content, 'utf8');
  console.log(`Normalized: ${lcovPath}`);
}
