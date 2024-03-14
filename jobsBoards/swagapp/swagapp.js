const fetchSwagappData = require("./fetchSwagappData");

async function getCompanyName(url) {
  const companyName = url.match(/\/organisations\/([^/]+)/)[1]; //get the organization name and use to fetch
  return companyName
}

async function getSwagappData(url) {

    const companyName = await getCompanyName(url)
    const swagJobData = await fetchSwagappData(companyName);
    const swagData = swagJobData.data.items

    const jobData = swagData.map((job, index) => ({
      ...job.id ? { applyLink: `https://jobs.swagapp.com/jobs/${job.id}` } : {},
      ...job.title ? { title: job.title } : {},
      ...job.workplace_type ? { workStyle: job.workplace_type } : {},
      ...job.employment_type_name ? { workType: job.employment_type_name } : {},
      ...job.experience_level_name ? { seniority: job.experience_level_name } : {},
      ...job.vendor_location_name ? { locations: job.vendor_location_name } : {},
      ...job.description ? { description: job.description } : {},
    }))

    return jobData

}

module.exports = getSwagappData;
