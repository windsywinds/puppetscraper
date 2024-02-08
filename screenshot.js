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
  
    console.log(`Getting data from ${url}`);
  
    const jobs = await page.$$eval('li[data-ui="job"]', async (elements) => {
      console.log('Number of elements found:', elements.length);
      const jobsData = [];
  
      for (const e of elements) {
        const jobData = {
          createdAt: e.querySelector('small[data-ui="job-posted"]').innerText,
          title: e.querySelector('h3[data-ui="job-title"]').innerText,
          location: e.querySelector('span[data-ui="job-location"]').innerText,
          workStyle: e.querySelector('span[data-ui="job-workplace"]').innerText,
          workType: e.querySelector('span[data-ui="job-type"]').innerText,
          areas: e.querySelector('span[data-ui="job-department"]').innerText,
          description: '', // Initialize description as an empty string
        };
  
        jobsData.push(jobData);
      }
  
      return jobsData; // Remove await here
    });
  
    return jobs;
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

async function uploadImage(bucket, taskIndex, imageBuffer) {
  // Create filename using the current time and task index
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const filename = `${date.toISOString()}-task${taskIndex}.json`;

  console.log(`Uploading JSON file as '${filename}'`);
  
  // Convert JSON data to a buffer
  const jsonBuffer = Buffer.from(JSON.stringify(imageBuffer), 'utf-8');

  // Upload the JSON file to the bucket
  await bucket.file(filename).save(jsonBuffer, {
    contentType: 'application/json' // Specify content type as JSON
  });
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
  const imageBuffer = await takeScreenshot(browser, url).catch(async (err) => {
    // Make sure to close the browser if we hit an error.
    await browser.close();
    throw err;
  });
  await browser.close();

  console.log("Initializing Cloud Storage client");
  const storage = new Storage();
  const bucket = await createStorageBucketIfMissing(storage, bucketName);
  await uploadImage(bucket, taskIndex, imageBuffer);

  console.log("Upload complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
