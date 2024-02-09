//index.js is the current iteration being developed for GCloud Run.
//Workable.js is a working version that runs locally
//gCloudRun.jsx is a starter version of getting this running on Google Cloud Run
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

async function uploadJson(bucket, companyName, jobData) {
  // Create filename using the current time and task index
  //create filename convention
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const formattedDate = date.toISOString().replace(/:/g, '_');
  const filename = `${formattedDate}-${companyName}-jobs.json`;

  console.log(`Uploading JSON file as '${filename}'`);

  try {
    // Upload JSON data to the specified Google Cloud Storage bucket
    await bucket.file(filename).save(JSON.stringify(jobData, null, 2));

    console.log(`JSON file '${filename}' uploaded to bucket.`);
  } catch (error) {
    console.error(`Error uploading JSON file '${filename}' to bucket:`, error);
    throw error; // Rethrow the error to propagate it further
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

  try {
    const workableURL = 'https://apply.workable.com';
    const inputURL = url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('Launching browser...');
    
    await page.goto(inputURL);
    console.log('Navigating to:', inputURL);

    // Wait for the job listings to load
    await page.waitForSelector('ul[data-ui="list"]');
    const companyName = await page.$eval('meta[property="og:title"]', element => element.getAttribute('content'))

    //await page.screenshot({ path: `${companyName}-page-screenshot.png`, fullPage: true });


    const jobs = await page.$$eval('li[data-ui="job"]', async (elements, workableURL) => {
      console.log('Number of elements found:', elements.length);
      const jobsData = [];
    
      for (const e of elements) {
        const jobData = {
          createdAt: e.querySelector('small[data-ui="job-posted"]').innerText,
          title: e.querySelector('h3[data-ui="job-title"]').innerText,
          location: e.querySelector('span[data-ui="job-location"]').innerText,
          workStyle: e.querySelector('span[data-ui="job-workplace"]').innerText,
          workType: e.querySelector('span[data-ui="job-type"]').innerText,
          url: workableURL + e.querySelector('li[data-ui="job"] > a').getAttribute('href'),
          areas: e.querySelector('span[data-ui="job-department"]').innerText,
          description: '', // Initialize description as an empty string
        };
    
        jobsData.push(jobData);
      }
    
      return jobsData;
    }, workableURL);

    console.log('Scraped data:', jobs);

    // Visit each job posting page to extract the description
    for (const job of jobs) {
      const jobPage = await browser.newPage();
      await jobPage.goto(job.url);
      console.log('Navigating to job page', jobs.indexOf(job), 'of', jobs.length, ':', job.url)
      try {
        await jobPage.waitForSelector('[data-ui="job-description"]', { timeout: 10000 }); // Adjust timeout as needed
        job.description = await jobPage.$eval('[data-ui="job-description"]', (element) => element.innerText);
      } catch (error) {
        console.error(`Error extracting description for job ${job.title}:`, error.message);
      }
  
      await jobPage.close();
    }

    console.log('Scraped data with descriptions:', jobs);

    
    const jobData = jobs
    const storage = new Storage();
    const bucket = await createStorageBucketIfMissing(storage, bucketName);
    await uploadJson(bucket, companyName, jobData);
    console.log("Upload complete!");

    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

console.log("Workable Scraper Starting...")
main();
console.log("Workable Scraper Ended...")