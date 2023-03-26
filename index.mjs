import fs, { promises } from 'fs';
import os from 'os';
import path from 'path';

const REQUIRED_ARGS = ['target', 'source', 'destination'];

const convertTranslationsDirJson = async () => {
  const args = process.argv.slice(2).reduce((acc, arg) => {
    if (arg.slice(0, 2) === '--') {
      const [key, value] = arg.split('=');
      const keyWithoutDashes = key.slice(2);

      acc[keyWithoutDashes] =
        value[0] === '~' ? os.homedir() + value.slice(1) : value;
    }
    return acc;
  }, {});

  const { target, source, destination } = args;

  REQUIRED_ARGS.forEach((arg) => {
    if (!args[arg]) {
      console.log('Please supply an argument for', arg);
      process.exit(1);
    }
  });

  const jsonFiles = fs
    .readdirSync(target)
    .filter((fileInDir) => path.extname(fileInDir) === '.json');

  if (!jsonFiles.length) {
    console.log('No .json files found.');
    process.exit(1);
  }

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const parsedSource = JSON.parse(fs.readFileSync(source, 'utf-8'));
  const sourceEntries = Object.entries(parsedSource);

  const convert = async (file) => {
    const parsedTarget = JSON.parse(
      await promises.readFile(path.join(target, file), 'utf-8')
    );
    const convertedTarget = sourceEntries.reduce(
      (acc, [key, { message, description }]) => {
        return {
          ...acc,
          [key]: { description, message: parsedTarget[key] ?? message },
        };
      },
      {}
    );

    return await promises.writeFile(
      path.join(destination, file),
      JSON.stringify(convertedTarget, null, 2)
    );
  };

  await Promise.all(jsonFiles.map((jsonFile) => convert(jsonFile)));

  console.log('Translation files converted successfully!');
  console.log('View converted files at:', destination);
  process.exit(0);
};

convertTranslationsDirJson();
