#!/bin/bash

COLOR_RESET="\033[0m"
COLOR_RED="\033[38;5;9m"
COLOR_LIGHTCYAN="\033[1;36m"

ROOT=$(cd $(dirname $0)/../.. ; pwd)
BIFROST_TS_RELEASE=${BIFROST_TS_RELEASE:-$(sed -nE "s/\"version\": \"([0-9\.]*)\",$/\1/p" ${ROOT}/package.json | tr -d '[:space:]')}
GITLAB_PROJECTS_API_URI="https://gitlab.eng.vmware.com/api/v4/projects/"
WORKING_DIR="/tmp/portal-ui"
WORKING_BRANCH="automation/${BIFROST_TS_RELEASE}"
TARGET_BRANCH="master"
COMMIT_MSG="Upgrade Bifrost TS to ${BIFROST_TS_RELEASE}"

error() {
    echo -e "${COLOR_RED}ERROR: $1${COLOR_RESET}" >&2
    exit 1
}

warn() {
    echo -e "${COLOR_RED}WARNING: $1${COLOR_RESET}"
}

info() {
    echo -e "${COLOR_LIGHTCYAN}$1${COLOR_RESET}"
}

success() {
    echo -e "${COLOR_LIGHTGREEN}$1${COLOR_RESET}"
}

_trap() {
  error interrupted
}

trap '_trap' SIGINT SIGTERM

if [ -z "${BIFROST_TS_RELEASE}" ] ; then
    error "BIFROST_TS_RELEASE not specified!"
fi

if [ -z "${GITLAB_ACCESS_TOKEN}" ] ; then
    error "GITLAB_ACCESS_TOKEN not specified!"
fi

# check out portal-ui
rm -rf ${WORKING_DIR} >/dev/null 2>&1
git clone https://oauth2:${GITLAB_ACCESS_TOKEN}@${PROJECT_REPO} ${WORKING_DIR}
git config --global user.name "${GIT_AUTHOR_NAME}"
git config --global user.email "${GIT_AUTHOR_EMAIL}"
cd ${WORKING_DIR}/ui

# upgrade bifrost TS and file a new MR into the target repo
set -x
git checkout -b ${WORKING_BRANCH}
npm install --save @vmw/bifrost@${BIFROST_TS_RELEASE}
set +x
git add package.json package-lock.json
git commit -m "${COMMIT_MSG}"
if [ $? -gt 0 ] ; then
    warn "Bifrost TS already up to date. Doing nothing."
    exit 0
fi

set -e
git push -u origin ${WORKING_BRANCH}

GITLAB_API_BODY="{
    \"id\": ${CI_PROJECT_ID},
    \"source_branch\": \"${WORKING_BRANCH}\",
    \"target_branch\": \"${TARGET_BRANCH}\",
    \"remove_source_branch\": true,
    \"title\": \"${COMMIT_MSG}\",
    \"description\": \"${COMMIT_MSG}\"
}"

curl -X POST "${GITLAB_PROJECTS_API_URI}${PROJECT_ID}/merge_requests" \
     --header "PRIVATE-TOKEN: ${GITLAB_ACCESS_TOKEN}" \
     --header "Content-Type: application/json" \
     --data "${GITLAB_API_BODY}"
