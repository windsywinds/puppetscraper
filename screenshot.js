const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");

async function initBrowser() {
  console.log("Initializing browser");
  return await puppeteer.launch();
}

async function takeScreenshot(browser, url) {
  const page = await browser.newPage();

  console.log(`Navigating to ${url}`);
  await page.goto(url);

  console.log(`Taking a screenshot of ${url}`);
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  // Extracting webpage title
  const title = await page.$eval('meta[property="og:title"]', (element) => element.content);

  return { screenshot, title };
}

async function createStorageBucketIfMissing(storage, bucketName) {
  console.log(
    `Checking for Cloud Storage bucket '${bucketName}' and creating if not found`
  );
  const bucket = storage.bucket(bucketName);
  const [exists] = await bucket.exists();
  if (exists) {
    // Bucket exists, nothing to do here
    return bucket;
  }

  // Create bucket
  const [createdBucket] = await storage.createBucket(bucketName);
  console.log(`Created Cloud Storage bucket '${createdBucket.name}'`);
  return createdBucket;
}

async function uploadData(bucket, taskIndex, screenshotData) {
  // Create filename using the current time and task index
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const filename = `${date.toISOString()}-task${taskIndex}`;

  // Upload screenshot
  console.log(`Uploading screenshot as '${filename}.png'`);
  await bucket.file(`${filename}.png`).save(screenshotData.screenshot);

  // Create JSON object with title and upload
  const jsonData = JSON.stringify({ title: screenshotData.title });
  console.log(`Uploading data as '${filename}.json'`);
  await bucket.file(`${filename}.json`).save(jsonData);
}

async function main(urls) {
  console.log(`Passed in urls: ${urls}`);

  const taskIndex = process.env.CLOUD_RUN_TASK_INDEX || 0;
  const url = urls[taskIndex];
  if (!url) {
    throw new Error(
      `No url found for task ${taskIndex}. Ensure at least ${
        parseInt(taskIndex, 10) + 1
      } url(s) have been specified as command args.`
    );
  }
  const bucketName = process.env.BUCKET_NAME;
  if (!bucketName) {
    throw new Error(
      "No bucket name specified. Set the BUCKET_NAME env var to specify which Cloud Storage bucket the screenshot will be uploaded to."
    );
  }

  const browser = await initBrowser();
  const screenshotData = await takeScreenshot(browser, url).catch(async (err) => {
    // Make sure to close the browser if we hit an error.
    await browser.close();
    throw err;
  });
  await browser.close();

  console.log("Initializing Cloud Storage client");
  const storage = new Storage();
  const bucket = await createStorageBucketIfMissing(storage, bucketName);
  await uploadData(bucket, taskIndex, screenshotData);

  console.log("Upload complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
