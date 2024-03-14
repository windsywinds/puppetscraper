const checkAndUpdateJob = require("./checkAndUpdateJob");
const dataRationaliser = require('./rationaliseData/rationaliseData')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function finaliseDataEntry(inputJobData) {
  try {

    //Loop through inputJobData and create records for each item
    for (const job of inputJobData) {
     
      // rationalise data
      console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is getting itself RATIONALISED`);
      const rationalisedData = await dataRationaliser(job)

      // check if job exists and add or update
      console.log("Rationalisation complete, attempting to add to DB...")
      const eachjob = await checkAndUpdateJob(rationalisedData);
      if (eachjob) {
        if (eachjob === "Job Update") {
          console.log(
            `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length}, ${eachjob.title} has been updated in the database.`
          );
        }
        console.log(
          `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is already in the database.`
        );
      } else {
        const currentDate = new Date();
        const isoDateString = currentDate.toISOString();
        rationalisedData.createdAt = isoDateString; // add date to createdAt before saving to database
        rationalisedData.companyId = ""; // pass an empty string as of now, will link job to company model
        await prisma.jobs.create({
          data: rationalisedData, // Use individual job object
        });
        console.log(
          `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} has been added to the database: ${job.title ? job.title : ""}`
        );
      }
    }
  } catch (err) {
    console.error("ERROR with rationalisation or database functions:", err);
  }
}

module.exports = finaliseDataEntry;
