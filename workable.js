//This version will run locally and save a .json file and .png image 
//use node workable.js
const fs = require('fs');
const puppeteer = require("puppeteer");

async function run() {
  try {
    const workableURL = 'https://apply.workable.com';
    const inputURL = 'https://apply.workable.com/fergus/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('Launching browser...');
    
    await page.goto(inputURL);
    console.log('Navigating to:', inputURL);

    // Wait for the job listings to load to ensure data exists
    await page.waitForSelector('ul[data-ui="list"]');

    //capture the Company Name fromm the page title
    const companyName = await page.$eval('meta[property="og:title"]', element => element.getAttribute('content'))

    

    //make sure that the job entries exist before collecting data
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

    //confirm the data has been collected
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
    //Confirm the descriptions are now also collected
    console.log('Scraped data with descriptions:', jobs);

    //create filename convention
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const formattedDate = date.toISOString().replace(/:/g, '_');
    const filename = `${formattedDate}-${companyName}-jobs.json`;

    //take a snapshot of the page - this does not capture the job entries for unknown reasons
    await page.screenshot({ path: `${companyName}-screenshot.png`, fullPage: true });
    // Save data to JSON file
    fs.writeFile(filename, JSON.stringify(jobs, null, 2), (err) => {
      if (err) throw err;
      console.log('Data saved to', filename);
    });

    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
