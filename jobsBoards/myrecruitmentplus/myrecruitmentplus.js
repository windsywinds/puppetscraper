const fetchMyRecruitmentData = require("./fetchMyRecruitmentData");

async function getMyRecruitmentJobData(browser, url) {
  const jobData = await fetchMyRecruitmentData(browser, url);
  return jobData;
}

module.exports = getMyRecruitmentJobData;
