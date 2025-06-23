@echo off
echo Building React app...
npm run build

echo Syncing to S3...
aws s3 sync ./build s3://channels.social --cache-control "no-cache"

echo Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id E4D8IH43J0YK8 --paths "/*"

echo ✅ Deployment complete!
