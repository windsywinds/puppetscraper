const fetch = require("node-fetch");

async function fetchGreenhouseFromAPI(companyName) {
  const constructedUrl = `https://boards-api.greenhouse.io/v1/boards/${companyName}/jobs`;

  try {
    const response = await fetch(constructedUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();

    // Check if responseData.results is an array, if not, wrap it in an array
    const data = Array.isArray(responseData.jobs)
      ? responseData.jobs
      : [responseData.jobs];

    // Loop over each job in data array to add any additional data from each jobs listing page
    for (let index = 0; index < data.length; index++) {
      const job = data[index];
      console.log(
        `Merging job ${data.indexOf(job) + 1} of ${data.length}: ${String(job.id)}`,
      );
      try {
        // convert job.id to string before using it in the URL
        const jobResponse = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${companyName}/jobs/${String(job.id)}`,
        );
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          // Merge additional fields from the job details into the original job object
          Object.assign(job, jobData);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching job details:", error.message);
        // Continue with the loop even if there's an error fetching job details
      }
    }
    console.log("Merge complete");
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
}
module.exports = fetchGreenhouseFromAPI;
