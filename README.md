# GitHub trending to Slack

Send the GitHub trending of your favorite languages into your Slack channel!

## Quick start

```bash
SLACK_HOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" node report.js javascript today
```

You should install [Incoming Webhooks](https://api.slack.com/incoming-webhooks) first to get a slack hook url.

If you can use [`envrc`](https://direnv.net/), please check an example file: `.envrc.example`.

## Schedule

Fix a `defaultTable` in `scheduler.js` or set a `SCHEDULE` to env with this expression.

```json
{"dayOfWeek":["language period", ...], ...}
```

For example, you can set like this if you want to receive the `c++ weekly` trend in every monday.

```json
{ "1": ["c++ weekly"] }
```

And then run a `scheduler.js` script with `SLACK_HOOK_URL`.

```bash
SLACK_HOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" node scheduler.js
```

### AWS Lambda

If you don't think about a machine to run this script as a cron job, you can choose the AWS Lambda. It can run a lambda function periodically with CloudWatch's scheduler tick. I set to launch this function at every 9AM into `functions.report.events.schedule` at `serverless.yml`.

You can deploy this into your lambda with your `AWS_PROFILE` environment variable by [`serverless`](https://serverless.com/).

1. Check your AWS credentials, for example, `AWS_PROFILE` env.
2. Install `serverless` with `yarn` command.
3. Check your `SLACK_HOOK_URL` and `SCHEDULE` environment variables with referencing a `.envrc.example` file.
4. Check the cron expression in `serverless.yml` file.
5. `yarn deploy:lambda` to deploy.

It contains an API Gateway endpoint to call it manually, so you use `curl` to test it.

```bash
curl -XPOST "https://YOUR-APIID.execute-api.AWS-REGION.amazonaws.com/production/LANGUAGE/PERIOD"
```

## Thanks to

- [github-trending-api](https://github.com/huchenme/github-trending-api)
