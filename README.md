# Job Board Scraper

Create a Cloud Run job to insert job board entries into MongoDatabase

# Clone repo via shell

```sh
git clone https://github.com/account/repo.git
```

# Setup gcloud

```sh
PROJECT_ID=puppetscrape
REGION=australia-southeast1
gcloud config set core/project puppetscrape
```

# Enable APIs

```sh
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com
```

# CD into project dir

```sh
cd puppetscraper
```

# Create service account

```sh
gcloud iam service-accounts create jobscraper-sa --display-name="Job Scraper service account"
```

# Give service account access

```sh
gcloud projects add-iam-policy-binding puppetscrape \
  --role roles/storage.admin \
  --member serviceAccount:jobscraper-sa@puppetscrape.iam.gserviceaccount.com
```

# Create Cloud Run Job

The URL's in this list are examples that currently cover each job scraper.

```sh
gcloud beta run jobs deploy jobscraper \
  --source=. \
  --args="https://apply.workable.com/fergus/" \
  --tasks=1 \
  --task-timeout=5m \
  --region=australia-southeast1 \
  --set-env-vars=DATABASE_URL=database_connection_string \
  --service-account=jobscraper-sa@puppetscrape.iam.gserviceaccount.com
```

- Note: Change the value of DATABASE_URL to your database connection string.

# Run Cloud Run Job

```sh
gcloud run jobs execute jobscraper --region=australia-southeast1
```

# Update Job

```sh
gcloud run jobs update jobscraper \
  --args="url_1" \
  --args="url_2" \
  --region=australia-southeast1 \
  --tasks=2
```
