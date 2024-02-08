# Workable Scraper Job

Create a Cloud Run job to output Workable job board entries into a .json file.


# 1. Build the Docker image
docker build -t gcr.io/puppetscrape/workablescraper .

# 2. Push the Docker image to Google Container Registry
docker push gcr.io/puppetscrape/workablescraper

# 3. Deploy the image to Cloud Run
gcloud run deploy workablejob \
  --image gcr.io/puppetscrape/workablescraper \
  --platform managed \
  --region australia-southeast1 \
  --set-env-vars BUCKET_NAME=workable-puppetscrape \
  --service-account=scraper-sa@puppetscrape.iam.gserviceaccount.com
