#!/bin/bash

#   case $1 in
# 	'dev')
# 		AWS_KEY=$AWS_KEY_DEV
#         AWS_SECRET=$AWS_SECRET_DEV
# 		;;
# 	'sandbox')
# 		AWS_KEY=$AWS_KEY_STAGING
#         AWS_SECRET=$AWS_SECRET_STAGING
# 		;;
# 	'prod')
# 		AWS_KEY=$AWS_KEY_PROD
#         AWS_SECRET=$AWS_SECRET_PROD
# 		break
# 		;;
#   esac


# export AWS_KEY
# export AWS_SECRET

# echo "KEY: $AWS_KEY"

# aws configure --profile privally set aws_access_key_id $AWS_KEY
# aws configure --profile privally set aws_secret_access_key $AWS_SECRET
# aws configure set aws_access_key_id $AWS_KEY
# aws configure set aws_secret_access_key $AWS_SECRET

# npm install

for p in $(cat ./services.txt)
do
    echo "folder: $p"
    echo "stage: $1"

    cd $p
    npm install
    SLS_DEBUG=* serverless deploy --stage $1 -v

    cd ..
done