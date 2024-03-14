import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAndUpdateJob(job) {
  try {
    // Find the job in the database based on title and applyLink
    const existingJob = await prisma.jobs.findFirst({
      where: {
        title: job.title,
        applyLink: job.applyLink,
      },
    });

    // If a job with the same title and applyLink exists
    if (existingJob) {
      // Check if the description is different
      if (
        existingJob.description !== job.description &&
        existingJob.applyLink === job.applyLink
      ) {
        // If the description is different, update the job
        await prisma.jobs.update({
          where: { id: existingJob.id },
          data: job,
        });
        return "Job Update";
      } else {
        // If the description is the same, return the existing job
        return existingJob;
      }
    } else {
      // If no job with the same title and applyLink exists, return null
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default checkAndUpdateJob;
