
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

    // Loop over each job in data array to add any additional data from each job's listing page
    for (const job of data) {
      console.log(`Merging job ${data.indexOf(job) + 1} of ${data.length}: ${String(job.id)}`);

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

export default fetchBambooFromAPI;
