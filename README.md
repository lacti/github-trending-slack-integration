# GitHub trending over Slack

Send the GitHub trending of your favorite languages into your Slack channel!

## Quick start

```bash
SLACK_HOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" yarn ts-node src/report.ts javascript today
```

You should install [Incoming Webhooks](https://api.slack.com/incoming-webhooks) first to get a slack hook url.

If you can use [`envrc`](https://direnv.net/), please check an example file: `.envrc.example`.

## Schedule

Add a new `schedule.json` file copied from `schedule.example.json` file to set that to `SCHEDULE` environment variable.

```json
{
  "dayOfWeek": {
    "trendings": [{ "language": "language", "period": "period" }],
    "owners": ["owner-name"]
  }
}
```

`dayOfWeek` is a string and it is one of `mon`, `tue`, `wed`, `thu`, `fri`, `sat` and `sun`. For example, you can set like this if you want to receive the `c++ weekly` trend and `Microsoft`'s repositories that have changed over the past day in every Monday.

```json
{
  "mon": {
    "trendings": [{ "language": "c++", "period": "weekly" }],
    "owners": ["microsoft"]
  }
}
```

Of course, you can use `all` of `dayOfWeek` to schedule something for all days.

```json
{
  "all": {
    "trendings": [{ "language": "golang", "period": "weekly" }],
    "owners": ["google"]
  }
}
```

And then run a `scheduler.js` script with `SLACK_HOOK_URL`.

```bash
SLACK_HOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" node scheduler.js
```

### AWS Lambda

If you don't think about a machine to run this script as a cron job, you can choose the AWS Lambda. It can run a lambda function periodically with CloudWatch's scheduler tick. I set to launch this function at every 10AM (KST) into `functions.reportToday.events.schedule` at `serverless.yml`.

You can deploy this into your lambda with your `AWS_PROFILE` environment variable by [`serverless`](https://serverless.com/).

1. Check your AWS credentials, for example, `AWS_PROFILE` env.
2. Install `serverless` with `yarn` command.
3. Check your `SLACK_HOOK_URL`, `SLACK_TRENDING_CHANNEL`, `SLACK_OWNER_CHANNEL` and `SCHEDULE` environment variables with referencing `.envrc.example` file and `schedule.example.json` file.
4. Check the cron expression in `serverless.yml` file.
5. `yarn deploy` to deploy.

It contains an API Gateway endpoint to call it manually, so you use `curl` to test it.

```bash
curl -XPOST "https://YOUR-APIID.execute-api.AWS-REGION.amazonaws.com/production/trending/LANGUAGE/PERIOD"
curl -XPOST "https://YOUR-APIID.execute-api.AWS-REGION.amazonaws.com/production/owner/LANGUAGE/PERIOD"
```

Or, you can call all things in the schedule using this endpoint.

```bash
curl -XPOST "https://YOUR-APIID.execute-api.AWS-REGION.amazonaws.com/production/"
```
