const fetchLeverPageData = require("./fetchLeverPageData");

async function getLeverCompanyName(url) {
  const organizationNameMatch = url.match(/jobs\.lever\.co\/([^/]+)/);
  const companyName = organizationNameMatch[1];

  return companyName;
}

//get the job listings
async function getLeverJobsData(browser, url) {
  console.log(`Using Lever URL: ${url}`)
  const companyName = await getLeverCompanyName(url);
  console.log(`Using Lever URL: ${companyName}`)
  const updatedJobs = await fetchLeverPageData(browser, companyName);

  return updatedJobs;
}

module.exports = getLeverJobsData;
