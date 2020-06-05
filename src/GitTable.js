import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Icon, Menu, Table, Header } from "semantic-ui-react";

const getRepoListApi = (limit, pageNo) =>
  `http://localhost:8080/repositories?limit=${limit}&pageNo=${pageNo}`;
const INIT_PAGE = 1;
const MAX_RECORDS_PER_PAGE = 10;
const initPages = [1, 2, 3, 4, 5];

const getPagesNumbers = (prePages, pageNo, hasMore) => {
  const pages = [...prePages];
  /* if selected page is last page and it has more records the adding one more page. */
  if (pages[pages.length - 1] === pageNo && hasMore) {
    pages.shift();
    pages.push(pageNo + 1);
    /*if current page is first page and pageNo is not equal to 1 then adding page at start */
  } else if (pages[0] === pageNo && pageNo !== 1) {
    pages.unshift(pageNo - 1);
    pages.pop();
  }
  return pages;
};

function GitRepoTable() {
  const [repositories, setRepositories] = useState([]);
  const [pages, setPages] = useState(initPages);
  const [activePage, setActivePage] = useState(INIT_PAGE);

  const fetchRepos = (pageNo) => {
    axios
      .get(getRepoListApi(MAX_RECORDS_PER_PAGE, pageNo))
      .then((response) => {
        if (response.status === 200) {
          const newRepos = response.data;
          const newPages = getPagesNumbers(
            pages,
            pageNo,
            newRepos.length === MAX_RECORDS_PER_PAGE
          );
          setPages(newPages);
          setActivePage(pageNo);
          setRepositories(newRepos);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => fetchRepos(INIT_PAGE), []);

  return (
    <Container style={{ marginTop: "3em" }}>
      <Header textAlign="center">GitHub Repositories</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Language</Table.HeaderCell>
            <Table.HeaderCell>Starts</Table.HeaderCell>
            <Table.HeaderCell>Watchers</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {repositories.map((repo) => (
            <Table.Row>
              <Table.Cell>{repo.name}</Table.Cell>
              <Table.Cell>{repo.language}</Table.Cell>
              <Table.Cell>{repo.stargazers_count}</Table.Cell>
              <Table.Cell>{repo.watchers_count}</Table.Cell>
              <Table.Cell>{repo.html_url}</Table.Cell>
              <Table.Cell>{repo.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="6">
              <Menu floated="right" pagination>
                <Menu.Item
                  as="a"
                  disabled={pages[0] === 1}
                  icon
                  onClick={() => fetchRepos(pages[0])}
                >
                  <Icon name="chevron left" />
                </Menu.Item>
                {pages.map((pageNo) => (
                  <Menu.Item
                    active={pageNo === activePage}
                    onClick={() => fetchRepos(pageNo)}
                  >
                    {pageNo}
                  </Menu.Item>
                ))}
                <Menu.Item
                  as="a"
                  icon
                  onClick={() => fetchRepos(pages[pages.length - 1])}
                >
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  );
}
export default GitRepoTable;
