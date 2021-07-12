import React, { useState, useRef } from "react";
import { Table, Input, Button, Space } from "antd";
import ReactCountryFlag from "react-country-flag";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import "./CountriesTable.css";

const CountriesTable = ({ countriesData = [] }) => {
  const data = [];
  const continents = new Set();

  for (let country of countriesData) {
    data.push({
      ...country,
      key: country.code,
      continent: country.continent.name,
      flag: <ReactCountryFlag countryCode={country.code} />,
    });
    continents.add(country.continent.name);
  }

  const continentsFilter = Array.from(continents).map((continent) => {
    return {
      text: continent,
      value: continent,
    };
  });

  let searchInput = useRef();
  const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: "" });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
  
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    
    render: text =>
    search.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[search.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
  });

  const columns = [
    {
      title: "ISO code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => (a.code > b.code ? 1 : -1),
      ...getColumnSearchProps("code"),
    },
    {
      title: "Country name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name > b.name ? 1 : -1),
      ...getColumnSearchProps("name"),
    },
    { title: "Country flag", dataIndex: "flag", key: "flag" },
    {
      title: "Continent",
      dataIndex: "continent",
      key: "continent",
      sorter: (a, b) => (a.continent > b.continent ? 1 : -1),
      filters: continentsFilter,
      onFilter: (value, record) => record.continent.indexOf(value) === 0,
    },
  ];

  return (
    <div className="countries-table">
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CountriesTable;
