import { FormOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, TextField } from "@material-ui/core";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { Empty, Pagination } from "antd";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useForm } from "react-hook-form";
import { Link, useRouteMatch } from "react-router-dom";
import * as yup from "yup";
import subjectApi from "./../api/subjectApi";
import {
  LIMIT_PAGE_DEFAULT,
  SCHOOL_ID_DEFAULT,
  STATUS_DEFAULT,
} from "./../dummydb/dataDefault";
import { headerSubject } from "./../dummydb/headerSubjectCsv";
import { listkhoavien } from "./../dummydb/khoavien";
import { liststatus } from "./../dummydb/status";
import "./style2.css";

function Danhsachhocphan(props) {
  const [searchLike, setSearchLike] = useState("");
  const [valueStatus, setValueStatus] = useState(STATUS_DEFAULT);
  const [valueSchoolId, setValueSchoolId] = useState(SCHOOL_ID_DEFAULT);
  const { enqueueSnackbar } = useSnackbar();
  const [datas, setDatas] = useState([]);
  const [datasExport, setDatasExport] = useState([]);

  const [counts, setCounts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_PAGE_DEFAULT);
  const match = useRouteMatch();
  const csvReport = {
    filename: "subject.csv",
    headers: headerSubject,
    data: datasExport,
  };
  const handleExport = async () => {
    enqueueSnackbar("Success", {
      variant: "success",
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      if (searchLike === "") {
        try {
          const params = {
            status: valueStatus,
            schoolId: valueSchoolId,
            limit: 99999999,
            offset: 0,
          };
          const list = await subjectApi.getFilter(params);
          setDatasExport(list);
        } catch (error) {
          enqueueSnackbar(error.response.data.detail, {
            variant: "error",
          });
        }
      } else {
        const params = {
          subjectId: searchLike,
          limit: 99999999,
          offset: 0,
        };
        const list = await subjectApi.getLikeId(params);
        setDatasExport(list.subject);
      }
    };
    fetchData();
  }, [enqueueSnackbar, searchLike, valueSchoolId, valueStatus]);
  useEffect(() => {
    const fetchData = async () => {
      if (searchLike === "") {
        try {
          const paramsCount = {
            status: valueStatus,
            schoolId: valueSchoolId,
          };
          const params = {
            status: valueStatus,
            schoolId: valueSchoolId,
            limit: limit,
            offset: page === 1 ? 0 : (page - 1) * limit,
          };
          const count = await subjectApi.count(paramsCount);
          setCounts(count);
          const list = await subjectApi.getFilter(params);
          setDatas(list);
        } catch (error) {
          enqueueSnackbar("Error", {
            variant: "error",
          });
        }
      }
    };
    fetchData();
  }, [valueSchoolId, valueStatus, limit, page, searchLike, enqueueSnackbar]);

  //set page
  useEffect(() => {
    const fectchData = async () => {
      if (searchLike !== "") {
        const params = {
          subjectId: searchLike,
          limit: limit,
          offset: page === 1 ? 0 : (page - 1) * limit,
        };
        const list = await subjectApi.getLikeId(params);
        setDatas(list.subject);
      }
    };
    fectchData();
  }, [valueSchoolId, valueStatus, limit, page, searchLike, enqueueSnackbar]);
  const handleChangeStatus = (event) => {
    setValueStatus(event.target.value);
  };
  const handleChangeSchoolId = (event) => {
    setValueSchoolId(event.target.value);
  };
  const handleChangePageAndPageSize = (page, limit) => {
    setPage(page);
    setLimit(limit);
  };
  const schema = yup.object().shape({});
  const form = useForm({
    defaultValues: {
      subjectId: "",
    },
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit } = form;
  const handleOnSubmit = async (value) => {
    const params = {
      subjectId: value.subjectId,
      limit: limit,
      offset: page === 1 ? 0 : (page - 1) * limit,
    };
    const paramsCount = {
      subjectId: value.subjectId,
    };
    const count = await subjectApi.countLikeId(paramsCount);
    setCounts(count);
    const list = await subjectApi.getLikeId(params);
    setDatas(list.subject);
    setSearchLike(value.subjectId);
    setPage(1);
  };
  const handleResetSearch = () => {
    setSearchLike("");
    window.location.reload();
  };
  return (
    <div>
      <div className="quanlysinhvien-content">
        <div>
          <div className="filter-school">
            <div className="filter-school-left">
              <TextField
                name="status"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                select
                value={valueStatus}
                onChange={handleChangeStatus}
              >
                {liststatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="filter-school-right">
              <TextField
                name="schoolId"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                select
                value={valueSchoolId}
                onChange={handleChangeSchoolId}
              >
                {listkhoavien.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="filter-school-right2">
              <form onSubmit={handleSubmit(handleOnSubmit)}>
                <TextField
                  {...register("subjectId")}
                  variant="outlined"
                  margin="dense"
                  id="outlined-input"
                  placeholder="T??m ki???m theo m?? h???c ph???n"
                  type="text"
                  style={{
                    width: "180px",
                    marginLeft: "100px",
                    marginTop: "11px",
                  }}
                />
                {searchLike !== "" && (
                  <Button
                    style={{
                      width: "120px",
                      height: "39px",
                      marginTop: "12px",
                      marginLeft: "20px",
                      fontWeight: "400",
                      background: "rgb(235, 43, 43)",
                      color: "white",
                    }}
                    variant="contained"
                    onClick={handleResetSearch}
                  >
                    Reset
                  </Button>
                )}
                {searchLike === "" && (
                  <Button
                    style={{
                      width: "120px",
                      height: "39px",
                      marginTop: "12px",
                      marginLeft: "20px",
                      fontWeight: "400",
                      background: "rgb(235, 43, 43)",
                      color: "white",
                    }}
                    variant="contained"
                    type="submit"
                  >
                    T??m ki???m
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
        <br />
        {searchLike === "" && counts !== 0 && (
          <div style={{ display: "flex", margin: "12px", color: "blue" }}>
            <div>
              <OfflinePinIcon />
            </div>
            <div>T??m th???y {counts} k???t qu??? ch??nh x??c</div>
          </div>
        )}
        {searchLike !== "" && counts !== 0 && (
          <div style={{ display: "flex", margin: "12px", color: "blue" }}>
            <div>
              <OfflinePinIcon />
            </div>
            <div>T??m th???y {counts} k???t qu??? g???n ????ng</div>
          </div>
        )}
        <div className="table-dangki">
          <table style={{ width: "100%", padding: "10px" }}>
            {datas.length > 0 && (
              <tr>
                <th>M?? h???c ph???n</th>
                <th>T??n h???c ph???n</th>
                <th>S??? t??n ch???</th>
                <th>K??? h???c</th>
                <th>Ghi ch??</th>
              </tr>
            )}
            {datas &&
              datas.map((data, index) => (
                <tr>
                  <td>{data.subjectId}</td>
                  <td>{data.subjectName}</td>
                  <td>{data.credit}</td>
                  <td>{data.programsemester}</td>
                  <td>{data.note}</td>
                </tr>
              ))}
            {datas.length === 0 && (
              <Empty
                style={{
                  color: "red",
                  fontWeight: "600",
                  fontStyle: "italic",
                  fontSize: "13px",
                }}
                description="(Empty)"
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              />
            )}
          </table>
        </div>
        <br />
        <br />
        <br />
        {datas.length > 0 && (
          <Pagination
            pageSize={limit}
            total={counts}
            page={page}
            onChange={handleChangePageAndPageSize}
            pageSizeOptions={[5, 10, 15, 20]}
            style={{ float: "right", marginRight: "15px" }}
          />
        )}
      </div>
     
    </div>
  );
}

export default Danhsachhocphan;
