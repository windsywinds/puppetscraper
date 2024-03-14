const puppeteer = require("puppeteer");

//scraper imports
const getWorkableData = require("./jobsBoards/workable/workable.js");
const getLeverJobsData = require("./jobsBoards/lever/lever.js");
const getMyRecruitmentJobData = require("./jobsBoards/myrecruitmentplus/myrecruitmentplus.js");
const getGreenHouseData = require("./jobsBoards/greenhouse/greenhouse.js");
const getBambooData = require("./jobsBoards/bamboohr/bamboohr.js");
const getSwagappData = require("./jobsBoards/swagapp/swagapp.js");
const findJobBoardFromUrl = require('./jobsBoards/findJobPlatform.js')
//shared components
const finaliseDataEntry = require("./components/finaliseDataEntry");

//for DOM scrapers to use puppeter
async function initBrowser() {
  console.log("Initializing browser");
  return await puppeteer.launch({headless: false});
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

  console.log("Data retrieval started");
  let jobData = [];
  const browser = await initBrowser();
  try {
    if (url.includes("workable.com")) {
        jobData = await getWorkableData(url);
    } else if (url.includes("jobs.lever.co")) {
      jobData = await getLeverJobsData(browser, url)
    } else if (url.includes("greenhouse.io")) {
      jobData = await getGreenHouseData(url)
    } else if (url.includes("myrecruitmentplus")) {
      jobData = await getMyRecruitmentJobData(browser, url)
    } else if (url.includes("bamboo")) {
      jobData = await getBambooData(url);
    } else if (url.includes("swagapp")) {
      jobData = await getSwagappData(url)
    } else {
      // handle other types of URLs or throw an error if needed
      console.log("Unknown job board");
      let retrievedJobData = await findJobBoardFromUrl(browser, url)
      if (!retrievedJobData) {
        console.log("Job board unsupported")
      }
      jobData = retrievedJobData;
     } 

    console.log("Data retrieval complete");

    // Set jobData to the provided value or an empty array if not provided
    let inputJobData = Array.isArray(jobData) ? jobData : [];

    // Check that the jobData exists
    if (inputJobData.length > 0) {
        // Insert to MongoDB collection
        await finaliseDataEntry(inputJobData);
    } else {
      console.error(
        "Invalid job data: jobData is missing or empty."
      );
    }
    
  } catch (err) {
    await browser.close();
    console.error("Error fetching or saving data:", err);
  }
  await browser.close();
  //confirm end
  console.log("Cloud Run Job ended.");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
