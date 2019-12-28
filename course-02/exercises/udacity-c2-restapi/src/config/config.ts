export const config = {
  "dev": {
    "username": process.env.POSTGRESS_USERNAME,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRESS_DATABASE,
    "dialect": process.env.POSTGRESS_DIALECT,
    "host": process.env.UDACITY_AWS_HOST,
    "aws_region": process.env.UDACITY_AWS_REGION,
    "aws_profile": process.env.UDACITY_AWS_PROFILE,
    "aws_media_bucket": process.env.UDACITY_AWS_BUCKET,
    "aws_secret_access_key": process.env.UDACITY_AWS_ACCESS_KEY,
    "aws_access_key_id": process.env.UDACITY_AWS_ACCESS_KEY_ID,
    "aws_session_token": process.env.UDACITY_AWS_SESSION_TOKEN,
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}
