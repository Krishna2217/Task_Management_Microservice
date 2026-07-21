# Branch protection setup (manual, one-time)

These workflows only have teeth if `main` is configured to require them. GitHub Actions
can't set branch protection rules on itself, so do this once in the repo settings:

**Settings → Branches → Add branch protection rule** for `main`:

- [ ] Require a pull request before merging
- [ ] Require status checks to pass before merging, and require these checks:
  - `backend-ci / <module>` (one per matrix entry in `pr-checks.yml`'s `backend-ci` job)
  - `frontend-ci / build`
  - `trivy-scan / <service>` (one per matrix entry — this is what actually blocks a
    merge on a new HIGH/CRITICAL vulnerability, since `docker-publish.yml` itself only
    runs *after* a merge lands on `main`)
- [ ] Require branches to be up to date before merging

Without this, `pr-checks.yml` still runs and reports failures, but a PR can be merged
anyway - the checks are advisory until they're marked required here.
