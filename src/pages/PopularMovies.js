import React, { useState, useEffect, useRef } from "react";

import { Table, Input, Button, Space, Row, Col } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import API from '../utilities/api';

function PopularMovies() {
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let randomNumber = Math.floor(Math.random() * 500) + 1;
    setPageNumber(randomNumber);
    console.log(pageNumber)
  }, []);

  const [movieData, setMovieData] = useState([]);

  const changeMovies = () => {

    let randomNumber = Math.floor(Math.random() * 500) + 1;

    console.log(pageNumber);
    setPageNumber(randomNumber);
    console.log(pageNumber);
    API.getMovies(pageNumber).then((movies) => {
      setMovieData(movies.data.results);
    });
    console.log(movieData);
  }

  const [searchState, setSearchState] = useState({ searchText: '', searchedColumn: '' })
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchState({ searchText: '' });
  };

  // adapted from antd table search, as well as stack overflow showing how to convert to functional https://stackoverflow.com/questions/69356379/how-to-do-column-level-search-in-ant-design-using-function-component
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.current && searchInput.current.select());
      }
    },
    render: text =>
      searchState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster_path',
      render: posterURL => <img width="100px" height="200px" src={`https://image.tmdb.org/t/p/original${posterURL}`}></img>
    }, {
      title: 'Title',
      dataIndex: "original_title",
      ...getColumnSearchProps('original_title'),
    }, {
      title: 'Release',
      dataIndex: "release_date",
      width: "100px",
      sorter: (a, b) => a.release_date.split('-')[0] - b.release_date.split('-')[0]
    }, {
      title: 'Rating',
      dataIndex: "vote_average",
      sorter: (a, b) => a.vote_average - b.vote_average,
    }, {
      title: 'Description',
      dataIndex: "overview",
    }
  ]

  return (
    <>
      <h2>Movie Information</h2>
      <Table dataSource={movieData} columns={columns} rowKey={movieData.id} pagination={{ pageSize: 5 }} />
      <Button onClick={() => changeMovies()}>Random Popular 20 Movies From TMDB API</Button>
    </>
  );
}

export default PopularMovies;
