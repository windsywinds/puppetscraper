const fs = require('fs');
const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");

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

async function uploadJson(bucket, taskIndex, jobData) {
  // Create filename using the current time and task index
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const filename = `${date.toISOString()}-task${taskIndex}.json`;

  // Save data to JSON file
  fs.writeFile(filename, JSON.stringify(jobData, null, 2), (err) => { // Use the generated filename
    if (err) throw err;
    console.log(`Data saved to ${filename}`);
  });

  console.log(`Uploading JSON file as '${filename}'`);


  await bucket.upload(filename, {
    destination: filename,
    metadata: {
      contentType: 'application/json',
    },
  });

  console.log(`JSON file '${filename}' uploaded to bucket.`);
}

async function run(urls) {
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

  try {
    const inputURL = url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('Launching browser...');
    
    await page.goto(inputURL);
    console.log('Navigating to:', inputURL);

    // Wait for the job listings to load
    await page.waitForSelector('.styles--Qqz1P');

    await page.screenshot({ path: 'example.png', fullPage: true });

    const jobData = await page.$$eval('.styles--1vo9F', (elements, inputURL) => {
      console.log('Number of elements found:', elements.length);
      return elements.map((e) => ({
        title: e.querySelector('.styles--3TJHk').innerText,
        location: e.querySelector('.styles--1Sarc').innerText,
        type: e.querySelector('.styles--2TdGW.styles--3brK_.styles--3da4O').innerText,
        url: inputURL + e.querySelector('.styles--1OnOt').getAttribute('href'), // Use getAttribute('href') to get the href attribute value
        role: e.querySelector('[data-ui="job-department"]').innerText, // Use attribute selector for data-ui="job-department"
      }));
    }, inputURL);

    console.log('Scraped data:', jobData);

 

    const storage = new Storage();
    const bucket = await createStorageBucketIfMissing(storage, bucketName);
    await uploadJson(bucket, taskIndex, jobData);
    console.log("Upload complete!");

    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});