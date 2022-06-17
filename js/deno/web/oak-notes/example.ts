const main = async () => {
  const baseUrl = "http://localhost:5000";
  let response: Response, data: string;

  // Basic get
  response = await fetch(baseUrl + "/api");
  if (response.status >= 400) {
    throw new Error();
  }

  // Basic post with body
  response = await fetch(baseUrl + "/api/greet", {
    method: "POST",
    body: JSON.stringify({ "name": "Hiruzen Sarutobi" }),
    headers: { "Content-Type": "application/json" },
  });
  data = await response.text();
  console.log(data);

  // Basic get with path param
  response = await fetch(
    baseUrl + "/api/user/f75a49fd-d3f0-4e6f-9a37-086a71523bde",
  );
  data = await response.text();
  console.log(data);

  // Basic get with query param
  response = await fetch(
    baseUrl +
      `/api/timeline/posts?${new URLSearchParams({
        limit: "5",
        offset: "10",
      })}`,
  );
  data = await response.text();
  console.log(data);

  // Basic get file
  response = await fetch(baseUrl + "/static/content.txt");
  data = await response.text();
  console.log(data);
};

main();
