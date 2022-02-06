//API для запросов к issues: https://docs.github.com/en/rest/reference/issues

const owner = "Maxxxnech";
const repo = "l10_t10_test_authorization";
const myUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;

// GitHub Personal access token for open reposб создан 24-фев-2020
const password = "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";

const auth = {
  Authorization: "Basic " + btoa(`${owner}:${password}`),
};

export function loadIssues(cbk) {
 //** ?state=all - затягиваем открытые и закрыте issues
 //** */ cache: "no-store" - не кешируем, иначе будет лагать
  fetch(myUrl + '?state=all', {
    cache: "no-store",
    headers: {
        "Content-Type": "application/json",
        ...auth,
      }, 
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(`Got data from ${myUrl}`);
      //async
      cbk && cbk(data);
    });
}

export function updateIssues(state, issue_number, cbk) {
  const issueUrl = myUrl + "/" + issue_number;

  fetch(issueUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...auth,
    },
    body: JSON.stringify({
      owner: `${owner}`,
      repo: `${repo}`,
      issue_number: issue_number,
      state: state,
    }),
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(`PATCH to ${issueUrl} : ${JSON.stringify(data)}`);
      //async
      cbk && cbk(data);
    });
}
