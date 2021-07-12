import React from "react";
import CountriesTable from "./Table/CountriesTable";
import { GraphQLClient, gql } from "graphql-request";
import { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import "antd/dist/antd.css";
import "./App.css";

const URL = "https://countries.trevorblades.com/";

const COUNTRIES_QUERY = gql`
  {
    countries {
      code
      name
      continent {
        name
      }
    }
  }
`;

const client = new GraphQLClient(URL);

const App = () => {
  const [countriesData, setData] = useState();
  const [loadingState, setState] = useState({
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setState({ isLoading: true, isError: false });
        const responce = await client.request(COUNTRIES_QUERY);
        setData(responce);
      } catch {
        setState({ isLoading: false, isError: true });
      }
    }
    fetchData().then(() => {
      setState({ isLoading: false, isError: false });
    });
  }, [setData]);

  if (loadingState.isLoading || loadingState.isError || !countriesData) {
    return loadingState.isLoading ? (
      <Spin className="loading" tip="Loading"></Spin>
    ) : (
      <Alert
        className ="loading"
        type="error"
        message="Can't loading data from internet"
        description="Please, check you internet connection and reboot this page"
      />
    );
  }

  return (
    <div className="App">
      <CountriesTable countriesData={countriesData.countries} />
    </div>
  );
};

export default App;
