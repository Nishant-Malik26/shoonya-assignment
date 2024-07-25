import React, { useEffect, useState } from "react";
import Card from "./Card";

const LandingPage = () => {
  const [allRetreats, setAllRetreats] = useState([]);
  const [page, setPage] = useState(1);
  const [typeOptions, setTypeOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [title, setTitle] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (allRetreats.length < 1) {
      fetch("https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats")
        .then((res) => res.json())
        .then((data) => setAllRetreats(data))
        .catch((err) => console.log(err));
    }
    allRetreats.forEach((retreat) => {
      if (typeOptions.indexOf(retreat?.type) === -1) {
        setTypeOptions([...typeOptions, retreat?.type]);
      }
      //   console.log(new Date(retreat.date * 1000).getFullYear());
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

  //   useEffect(() => {
  //     if (typeFilter !== "default") {
  //       setFilteredData((prev) =>
  //         allRetreats.filter((val) => val.type === typeFilter)
  //       );
  //     } else {
  //       setFilteredData(allRetreats);
  //     }
  //   }, [typeFilter, allRetreats]);

  //   useEffect(() => {
  //     if (!!dateFilter || !!typeFilter || !!title) {
  //       setFilteredData((prev) =>
  //         allRetreats.filter((val) => {
  //           //   console.log(
  //           //     val,
  //           //     dateFilter.substring(0, 4),
  //           //     new Date(val.date * 1000).getFullYear().toString()
  //           //   );
  //           console.log(val.title, title, val.title.includes(title));
  //           return (
  //             !!dateFilter &&
  //             new Date(val.date * 1000).getFullYear().toString() ===
  //               dateFilter.substring(0, 4) &&
  //             !!typeFilter &&
  //             val.type === typeFilter &&
  //             !!title &&
  //             val.title.includes(title)
  //           );
  //         })
  //       );
  //     } else {
  //       setFilteredData(allRetreats);
  //     }
  //     // new Date(.date * 1000).getFullYear
  //   }, [dateFilter, allRetreats, title, typeFilter]);

  useEffect(() => {
    let url = "https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?";
    if (typeFilter && title && typeFilter !== "Filter By Type") {
      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${typeFilter}&title=${title}`;
    } else if (typeFilter && typeFilter !== "Filter By Type") {
      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${typeFilter}`;
    } else if (title) {
      url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?title=${title}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => setFilteredData(res))
      .catch((err) => console.log(err));
  }, [typeFilter, title]);

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
    }
    console.log(dateFilter);
  }, [dateFilter]);

  const handleSelectType = (e) => {
    setTypeFilter(e.target.value);
    console.log("🚀 ~ handleSelectType ~ e.target.value:", e.target.value);
  };
  const handleSelectDate = (e) => {
    if (typeFilter === "Filter By Type" || !title) {
      setFilteredData(allRetreats);
    }
    setDateFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevious = () => {
    setPage((prev) => prev - 1);
  };

  console.log(dateFilter);
  console.log(filteredData);

  //   console.log(typeOptions);

  return (
    <div>
      {/* {typeOptions} */}
      <header className="headerBar">Wellness Retreats</header>
      <div className="card">
        <div className="cardImage"></div>
        {/* <img
          className="cardImage"
          alt="yoga"
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHwyfHxZb2dhJTIwfGVufDF8fHx8MTcyMTc1MzMzNXww&ixlib=rb-4.0.3&q=80&w=1080"
        ></img> */}
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
        {!Array.isArray(filteredData) && <div>{filteredData}</div>}
        {Array.isArray(filteredData) &&
          filteredData
            .slice((page - 1) * 3, (page - 1) * 3 + 3)
            .map((retreat) => <Card key={retreat?.id} {...retreat} />)}
      </div>
      {/* {if (page <2)} */}
      <div className="pagination">
        {Array.isArray(filteredData) &&
          (page > 1 || filteredData.length > 3) && (
            <button onClick={handlePrevious}>Previous</button>
          )}
        {Array.isArray(filteredData) && page < filteredData.length / 3 && (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
      <div className="footer">
        © 2024 Wellness Retreats. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
