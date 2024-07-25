import React, { useEffect, useState } from "react";
import Card from "./Card";
import Loader from "../Utils/Loader";

const LandingPage = () => {
  const [allRetreats, setAllRetreats] = useState([]);
  const [page, setPage] = useState(1);
  const [typeOptions, setTypeOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [title, setTitle] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch retreats data on page loading
  useEffect(() => {
    if (allRetreats.length < 1) {
      fetch("https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats")
        .then((res) => res.json())
        .then((data) => {
          setAllRetreats(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
    // Setting dropdown option for date and type as per data
    allRetreats.forEach((retreat) => {
      if (typeOptions.indexOf(retreat?.type) === -1) {
        setTypeOptions([...typeOptions, retreat?.type]);
      }

      if (
        dateOptions.indexOf(
          `${new Date(retreat.date * 1000).getFullYear()}-${
            new Date(retreat.date * 1000).getFullYear() + 1
          } `
        ) === -1
      ) {
        setDateOptions([
          ...dateOptions,
          `${new Date(retreat.date * 1000).getFullYear()}-${
            new Date(retreat.date * 1000).getFullYear() + 1
          } `,
        ]);
      }
      new Date(retreat.date * 1000).getFullYear();
    });
  }, [allRetreats]);

  // fetch filtered data
  // due to lack of clarity and visiblity i have fetched filtered data like this
  // for scaling purpose Redux stored can be used and parameters can be sent more dynamically if i had the access to api architechture
  useEffect(() => {
    let url = "https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?";
    if (typeFilter && title && typeFilter !== "Filter By Type") {
      setIsLoading(true);
      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${typeFilter}&title=${title}`;
    } else if (typeFilter && typeFilter !== "Filter By Type") {
      setIsLoading(true);

      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${typeFilter}`;
    } else if (title) {
      setIsLoading(true);

      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?title=${title}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setFilteredData(res);
        setIsLoading(false);
        setPage(1);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [typeFilter, title]);

  // filter by date is done locally as i could not find any related parameter in doc provided
  useEffect(() => {
    if (dateFilter === "Filter By Date") {
      return;
    } else if (dateFilter) {
      setFilteredData((prev) =>
        prev.filter(
          (val) =>
            new Date(val.date * 1000).getFullYear().toString() ===
            dateFilter.substring(0, 4)
        )
      );
      setPage(1);
    }
  }, [dateFilter]);
  // type select handler
  const handleSelectType = (e) => {
    setTypeFilter(e.target.value);
  };
  // data select handler
  const handleSelectDate = (e) => {
    if (typeFilter === "Filter By Type" || !title) {
      setFilteredData(allRetreats);
    }
    setDateFilter(e.target.value);
  };
  // title input handler
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };
  // pagination handlers
  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevious = () => {
    setPage((prev) => prev - 1);
  };

  // while fetching data loader is shown
  return (
    <div>
      {isLoading && <Loader />}
      <header className="headerBar">Wellness Retreats</header>
      <div className="card">
        <div className="cardImage"></div>

        <span className="subheading">Discover Your Inner Peace</span>
        <span className="finetext">
          Join us for a series of wellness retreats designed to help you find
          tranquility and rejuvenation.
        </span>
      </div>
      <div className="filterContainers">
        <div className="selectContainer">
          <select value={dateFilter} onChange={handleSelectDate} name="date">
            <option value={null} selected>
              Filter By Date
            </option>
            {dateOptions.map((date) => (
              <option value={date}>{date}</option>
            ))}
          </select>
          <select value={typeFilter} onChange={handleSelectType} name="type">
            <option value={null} selected>
              Filter By Type
            </option>
            {typeOptions.map((type) => (
              <option value={type}>{type}</option>
            ))}
          </select>
        </div>

        <input
          placeholder="Search retreats by title"
          name="searchin"
          value={title}
          onChange={handleInputChange}
        ></input>
      </div>

      <div className="retreatCardContainer">
        {!Array.isArray(filteredData) && (
          <div
            style={{
              display: "block",
              height: "23rem",
            }}
          >
            {filteredData}
          </div>
        )}
        {Array.isArray(filteredData) &&
          filteredData
            .slice((page - 1) * 3, (page - 1) * 3 + 3)
            .map((retreat) => <Card key={retreat?.id} {...retreat} />)}
      </div>
      {Array.isArray(filteredData) && (
        <div className="pagination">
          {page > 1 && [...filteredData]?.length > 3 && (
            <button onClick={handlePrevious}>Previous</button>
          )}
          {page < [...filteredData]?.length / 3 && (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
      )}
      <div className="footer">
        © 2024 Wellness Retreats. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
