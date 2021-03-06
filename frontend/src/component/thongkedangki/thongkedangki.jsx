import React, { Suspense, useEffect, useState } from "react";
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import classApi from "../../api/classApi";
import Loading from "../Loading";
import NotFound from "../NotFound";
import "../style2.css";
const Thongketheovien = React.lazy(() => import("./thongketheovien"));
const Thongketheongay = React.lazy(() => import("./thongketheongay"));

function Thongkedangki({ semesterDk }) {
  const [semesters, setSemesters] = useState([]);
  const match = useRouteMatch();
  useEffect(() => {
    const fectchData = async () => {
      const list1 = await classApi.getAllSemester();
      setSemesters(list1);
    };
    fectchData();
  }, []);
  return (
    <div>
      <hr style={{ width: "100%", margin: "10px auto" }} className="hr-style" />
      <div className="quanlysinhvien-top">
        <div className="quanlysinhvien-bt">
          <NavLink
            style={{ textDecoration: "none" }}
            to={`${match.url}/thongketheongay`}
            activeStyle={{
              fontWeight: "bold",
              color: "rgb(161, 11, 11)",
              transition: "0.1s",
            }}
          >
            Thống kê theo ngày
          </NavLink>
        </div>
        <div className="quanlysinhvien-bt">
          <NavLink
            style={{ textDecoration: "none" }}
            to={`${match.url}/thongketheovien`}
            activeStyle={{
              fontWeight: "bold",
              color: "rgb(161, 11, 11)",
              transition: "0.1s",
            }}
          >
            Thống kê theo viện
          </NavLink>
        </div>
      </div>
      <div className="quanlysinhvien-content">
        <Suspense fallback={<Loading />}>
          <Switch>
            <Redirect
              exact
              from={`${match.path}`}
              to={`${match.path}/thongketheongay`}
            />
            <Route exact path={`${match.path}/thongketheongay`}>
              <Thongketheongay semesters={semesters} semesterDk={semesterDk} />
            </Route>
            <Route path={`${match.path}/thongketheovien`}>
              <Thongketheovien semesters={semesters} semesterDk={semesterDk} />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

export default Thongkedangki;
