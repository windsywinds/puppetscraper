const fetch = require('node-fetch');

async function fetchBambooFromAPI(companyName) {
  const constructedUrl = `https://${companyName}.bamboohr.com/careers/list`;

  try {
    const response = await fetch(constructedUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();

    // Check if responseData.results is an array, if not, wrap it in an array
    const data = Array.isArray(responseData.result) ? responseData.result : [responseData.result];

    // Loop over each job in data array to add any additional data from each jobs listing page
    for (let index = 0; index < data.length; index++) {
      const job = data[index];
      console.log(`Merging job ${data.indexOf(job) + 1} of ${data.length}: ${String(job.id)}`);

      // Introduce a delay between each fetch request to prevent being rate limited
      //await new Promise(resolve => setTimeout(resolve, index * 1000));

      try {
        // Convert job.id to string before using it in the URL
        const jobResponse = await fetch(`https://${companyName}.bamboohr.com/careers/${String(job.id)}/detail`);
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          // Merge additional fields from the job details into the original job object
          Object.assign(job, jobData);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching job details:', error.message);
        // Continue with the loop even if there's an error fetching job details
      }
    }
    console.log("Merge complete")
    return data
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return null;
  }
}
module.exports = fetchBambooFromAPI;

