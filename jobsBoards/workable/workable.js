const fetchWorkableFromAPI = require("./fetchWorkableData");

//find the name of the business
async function getWorkableCompanyName(url) {
  console.log("Extracting company name from url:", url);
  // identify job board name from url input
  url = url.replace(/\/+$/, "");
  const parts = url.split("/");
  const companyName = parts[parts.length - 1];

  return companyName;
}

//get the job listings from the API
async function getWorkableData(url) {
  //get data using api
  const companyName = getWorkableCompanyName(url)
  const workableJobData = await fetchWorkableFromAPI(companyName);
  const applyLink = "https://apply.workable.com/";

  const jobData = workableJobData.map((job, index) => ({
    ...job.shortcode ? { applyLink: applyLink + companyName + "/j/" + job.shortcode } : {},
    ...job.title ? { title: job.title } : {}, 
    ...job.workplace ? { workStyle: job.workplace } : {}, 
    ...job.type ? { workType: job.type } : {}, 
    ...job.location?.city ? { locations: job.location.city } : {},
    ...job.department ? { areas: job.department } : {},  
    ...job.description ? { description: job.description } : {}, 
  }));

  return jobData;
}

module.exports = getWorkableData ;
