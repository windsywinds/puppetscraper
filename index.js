const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");

async function initBrowser() {
  console.log("Initializing browser");
  return await puppeteer.launch();
}

async function getJobData(browser, url) {
  const page = await browser.newPage();

  console.log(`Navigating to ${url}`);
  await page.goto(url);

  console.log(`Taking a screenshot of ${url}`);
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  // Extracting webpage title
  const companyName = await page.$eval(
    'meta[property="og:title"]',
    (element) => element.content
  );

  // Wait for the job listings to load
  await page.waitForSelector('ul[data-ui="list"]');

  const jobs = await page.$$eval('li[data-ui="job"]', async (elements) => {
    console.log("Number of elements found:", elements.length);
    const jobsData = [];

    for (const e of elements) {
      const jobData = {
        createdAt: e.querySelector('small[data-ui="job-posted"]').innerText,
        title: e.querySelector('h3[data-ui="job-title"]').innerText,
        location: e.querySelector('span[data-ui="job-location"]').innerText,
        workStyle: e.querySelector('span[data-ui="job-workplace"]').innerText,
        workType: e.querySelector('span[data-ui="job-type"]').innerText,
        url: 'https://apply.workable.com' + e.querySelector('a').getAttribute('href'),
        areas: e.querySelector('span[data-ui="job-department"]').innerText,
        description: '', // Initialize description as an empty string
      };

      jobsData.push(jobData);
    }

    return jobsData;
  });

  console.log("Scraped data:", jobs);

  // Visit each job posting page to extract the description
  for (const job of jobs) {
    const jobPage = await browser.newPage();
    await jobPage.goto(job.url);
    console.log(
      "Navigating to job page",
      jobs.indexOf(job) + 1,
      "of",
      jobs.length,
      ":",
      job.url
    );
    try {
      await jobPage.waitForSelector('[data-ui="job-description"]', {
        timeout: 10000,
      }); // Adjust timeout as needed
      job.description = await jobPage.$eval(
        '[data-ui="job-description"]',
        (element) => element.innerText
      );
    } catch (error) {
      console.error(
        `Error extracting description for job ${job.title}:`,
        error.message
      );
    }

    await jobPage.close();
  }

  return { screenshot, companyName, jobs };
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

async function uploadData(bucket, taskIndex, jobData) {
  // Create filename using the current time and task index
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const filename = `${date.toISOString()}-${jobData.companyName}-task${taskIndex}`;

  // Upload screenshot
  console.log(`Uploading screenshot as '${filename}.png'`);
  await bucket.file(`${filename}.png`).save(jobData.screenshot);

  // Upload JSON data for each job
  for (const jobIndex in jobData.jobs) {
    const job = jobData.jobs[jobIndex];
    const jobJsonData = JSON.stringify({
      title: job.title,
      location: job.location,
      workStyle: job.workStyle,
      workType: job.workType,
      url: job.url,
      areas: job.areas,
      description: job.description,
    });

    console.log(
      `Uploading data for job ${parseInt(jobIndex) + 1} as '${filename}-job${parseInt(
        jobIndex
      )}.json'`
    );
    await bucket
      .file(`${filename}-job${parseInt(jobIndex)}.json`)
      .save(jobJsonData);
  }
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
  const jobData = await getJobData(browser, url).catch(async (err) => {
    // Make sure to close the browser if we hit an error.
    await browser.close();
    throw err;
  });
  await browser.close();

  console.log("Initializing Cloud Storage client");
  const storage = new Storage();
  const bucket = await createStorageBucketIfMissing(storage, bucketName);
  await uploadData(bucket, taskIndex, jobData);

  console.log("Upload complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
