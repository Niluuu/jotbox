import path from 'path';
import { devices } from 'puppeteer';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const getMatchOptions = ({ context: { kind, story, fileName } }) => {
  const subPath = path
    .join(path.dirname(fileName))
    .split('/')
    .slice(1)
    .join('/');

  const storyshotsDir = 'src/stories/__screenshots__/';

  const storyShotPath = `${storyshotsDir}${subPath}`;
  const pureFileName = kind.split('/');

  return {
    // doesn't detect all changes try to comment out "l:52         styles[`size-${size}`]," on Button.tsx, changes won't be detected with this threshold, but will be with 0.001
    failureThreshold: 0.1,
    // use to have all difference detected, but it has some odd effects with some screenshots e.g. src/stories/__screenshots__/__diff__output/components/InfoButton-Align Right-diff.png
    // failureThreshold: 0.001,
    failureThresholdType: 'percent',
    customSnapshotsDir: storyShotPath,
    customDiffDir: `${storyshotsDir}__diff__output/${subPath}`,
    customSnapshotIdentifier: `${pureFileName[pureFileName.length - 1]}-${story}`,
  };
};

// const MOBILE = devices['iPhone 5']; // width: 320
const TABLET_PORTRAIT = devices['iPad Mini']; // width: 768

function customizePage(page) {
  return page.emulate(TABLET_PORTRAIT);
}

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:6006',
    getMatchOptions,
    customizePage,
  }),
});
