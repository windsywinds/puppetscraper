
const fetch = require("node-fetch");

async function fetchSwagappData(companyName) {
  const jobEndpoint = `https://services.employmenthero.com/ats/api/v1/career_page/organisations/${companyName}/jobs?item_per_page=10&page_index=1`;
  try {
    const response = await fetch(jobEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err)
  }
}

module.exports = fetchSwagappData
