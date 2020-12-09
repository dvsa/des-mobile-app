#!/bin/sh
# Obtains an API key for submitting logs to a given environment's logs service POST endpoint.
# Takes the key an puts it into environment.ts ready to be built into the app.
# 
# You MUST:
# * Assume a role capable of obtaining the API key
# * Provide the name of the env as the only argument to the script

if [ $# -ne 1 ]; then
  echo "Please provide an env name"
  echo "Example: $0 dev"
  exit 1
fi

ENV=$1
API_KEY_NAME="mes-${ENV}-api-api-key-logs-post"
API_KEY_ID=$(aws apigateway get-api-keys --name-query ${API_KEY_NAME} | jq -r '.items[0].id')

if [ $API_KEY_ID == "null" ]; then
  echo "Failed to find API key with name ${API_KEY_NAME}"
  exit 1
fi

API_KEY_VALUE=$(aws apigateway get-api-key --api-key ${API_KEY_ID} --include-value | jq -r '.value')
ENVIRONMENT_FILE="$(dirname $0)/../src/environment/environment.ts"
sed -i "" "s/\(logsPostApiKey: \)\('.*'\)/\1'${API_KEY_VALUE}'/" ${ENVIRONMENT_FILE}

echo "API key has been put into environment.ts"