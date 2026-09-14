import fs from 'fs';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

const dotenvFiles = [
  `.env`,
  `.env.${NODE_ENV}`
].filter(Boolean);

const config = () => {
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      dotenvExpand(
        dotenv.config({
          path: dotenvFile
        })
      );
    }
  });
};

export default {
  config
};
