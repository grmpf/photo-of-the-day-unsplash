## Cron Jobs

1. `.github/workflows/cron-1am.yaml`  
  Required to revalidate "/", "/2" and "/3" once a day.  
  Without this the pages would stay the same forever, or it would be required to set a timer (via "revalidate" in getStaticProps).

### Links
- [CronJob with Auth](https://vercel.com/docs/concepts/solutions/cron-jobs)
- [GitHub Workflows](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
