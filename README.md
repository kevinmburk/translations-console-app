# Translations Console App

A simple Node console app that takes in a directory of `react-intl` JSON files and outputs them into a Crowdin-consumable JSON format.

If your source file includes descriptions, it will inject those values into the new format JSON file as well.

## Instructions

- The app needs three arguments:

  1. `target`: Directory of the JSON files you want to convert
  1. `destination`: Directory where you want the converted JSON files to be output into
  1. `source`: JSON file that's the principal Crowdin source file. This file will be checked for matching ID's and will use the descriptions associated with each ID in all the converted files.

- Run the app with the following command:

```bash
npm start -- --target=<TARGET_DIR> --destination=<DESTINATION_DIR> --source=<SOURCE_DIR>
```

Note the double dash after `npm start`, this is needed to pass the following as arguments to the script.
