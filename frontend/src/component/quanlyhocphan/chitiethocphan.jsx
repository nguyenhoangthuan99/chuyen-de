import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, TextField } from "@material-ui/core";
import { Empty, Pagination } from "antd";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import subjectApi from "../../api/subjectApi";
import classApi from "../../api/classApi";
import { SCHOOL_ID_DEFAULT } from "../../dummydb/dataDefault";
import { listkhoavien } from "../../dummydb/khoavien";
import { headerStudent } from "../../dummydb/headerListStudentcsv";
import { headerClassList } from "../../dummydb/headerListClassscsv";
import { CSVLink } from "react-csv";
import "../style2.css";
import "../style3.css";
import AlertRemove from "../alertRemove";
function Chitiethocphan({ semesterDk }) {
  const { Id } = useParams();
  const [khoavien, setKhoavien] = useState(SCHOOL_ID_DEFAULT);
  const [subject, setSubject] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const schema = yup.object().shape({
    subjectName: yup.string().required("please enter your subjectName"),
    credit: yup.number().min(1, "Please enter at least 1 "),
    note: yup.string().required("please enter your note"),
    programsemester: yup.number().min(1, "Please enter at least 1 "),
  });
  const form = useForm({
    defaultValues: {
      subjectId: "",
      subjectName: "",
      credit: 0,
      schoolId: SCHOOL_ID_DEFAULT,
      note: "",
      programsemester: 0,
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  useEffect(() => {
    const setSubjects = async () => {
      //setValue Form
      setValue("subjectId", subject.subjectId);
      setValue("subjectName", subject.subjectName);
      setValue("credit", subject.credit);
      setValue("schoolId", subject.schoolId);
      setKhoavien(subject.schoolId);
      setValue("programsemester", subject.programsemester);
      setValue("note", subject.note);
    };
    setSubjects();
  }, [setValue, subject]);
  useEffect(() => {
    const fetchSubject = async () => {
      const params = {
        subjectId: Id,
      };
      const list = await subjectApi.get(params);
      setSubject(list.subject[0]);
    };
    fetchSubject();
  }, [Id]);
  const handleOnSubmit = async (value) => {
    try {
      const params = {
        subjectId: Id,
      };
      await subjectApi.update(value, params);
      enqueueSnackbar("Success", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.detail, {
        variant: "error",
      });
    }
  };

  const handleChangeKhoavien = (event) => {
    setKhoavien(event.target.value);
  };
  const handleBlock = async () => {
    try {
      const params = {
        subjectId: Id,
      };
      await subjectApi.lock(params);
      window.location.reload();
      enqueueSnackbar("Success", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.detail, {
        variant: "error",
      });
    }
  };
  const handleUnBlock = async () => {
    try {
      const params = {
        subjectId: Id,
      };
      await subjectApi.unlock(params);
      window.location.reload();
      enqueueSnackbar("Success", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.detail, {
        variant: "error",
      });
    }
  };

  return (
    <div className="thongtincanhan">
      <p className="thongtincanhan-title">1. Th??ng tin h???c ph???n</p>
      <div className="quanlysinhvien-content">
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <hr style={{ opacity: "0.3", width: "100%" }} />
          <br />
          {/* subjectId */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">M?? h???c ph???n :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("subjectId")}
                name="subjectId"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                disabled
              />
              <p></p>
            </div>
          </div>
          {/* T??n h???c ph???n */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">T??n h???c ph???n :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("subjectName")}
                name="subjectName"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                placeholder="Ch??a c???p nh???t"
              />
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="subjectName" />
              </p>
            </div>
          </div>
          {/* S??? t??n ch???*/}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">S??? t??n ch??? :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("credit")}
                name="credit"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                placeholder="Ch??a c???p nh???t"
                type="number"
              />
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="credit" />
              </p>
            </div>
          </div>
          {/* K?? h???c */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">K?? h???c :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("programsemester")}
                name="programsemester"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                placeholder="Ch??a c???p nh???t"
                type="number"
              />
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="programsemester" />
              </p>
            </div>
          </div>
          {/* Khoa vi???n  */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">Khoa/Vi???n :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("schoolId")}
                name="schoolId"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                select
                value={khoavien}
                onChange={handleChangeKhoavien}
              >
                {listkhoavien.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <p></p>
          {/*Note  */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">Ghi ch?? :</div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("note")}
                name="note"
                className="outlined-basic"
                variant="outlined"
                margin="dense"
                fullWidth
                placeholder="Ch??a c???p nh???t"
              />
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="note" />
              </p>
            </div>
          </div>
          <br />
          <div className="thongtincanhan-contents">
            <Button
              style={{
                width: "250px",
                marginTop: "40px",
                marginLeft: "0px",
                fontWeight: "400",
                background: "rgb(235, 43, 43)",
                color: "white",
              }}
              variant="contained"
              type="submit"
            >
              C???p nh???t h???c ph???n
            </Button>
          </div>
        </form>
        {subject.status === 1 && (
          <Button
            style={{
              width: "250px",
              float: "right",
              marginTop: "-35px",
              marginRight: "12px",
              fontWeight: "400",
              background: "rgb(235, 43, 43)",
              color: "white",
            }}
            variant="contained"
            onClick={handleOpen}
          >
            Kh??a h???c ph???n
          </Button>
        )}
        {subject.status === 0 && (
          <Button
            style={{
              width: "250px",
              float: "right",
              marginTop: "-35px",
              marginRight: "12px",
              fontWeight: "400",
              background: "rgb(235, 43, 43)",
              color: "white",
            }}
            variant="contained"
            onClick={handleOpen1}
          >
            M??? kh??a h???c ph???n
          </Button>
        )}
      </div>
      <AlertRemove
        open={open}
        handleCancel={handleClose}
        handleOk={handleBlock}
        message={`B???n c?? ch???c ch???n mu???n kh??a h???c ph???n ${Id}?`}
      ></AlertRemove>
      <AlertRemove
        open={open1}
        handleCancel={handleClose1}
        handleOk={handleUnBlock}
        message={`B???n c?? ch???c ch???n mu???n m??? kh??a h???c ph???n ${Id}?`}
      ></AlertRemove>
      <br />
      <br />
      <hr style={{ opacity: "0.3", width: "100%" }} />
      <p className="thongtincanhan-title">2. Th??ng tin l???p gi???ng d???y</p>
      <br />
      <Chitiethocphandangki1 semesterDk={semesterDk} subjectId={Id} />
      <br />
      <br />
      <hr style={{ opacity: "0.3", width: "100%" }} />
      <p className="thongtincanhan-title">3. Th??ng tin sinh vi??n ????ng k??</p>
      <br />
      <Chitiethocphandangki2 semesterDk={semesterDk} subjectId={Id} />
    </div>
  );
}

export default Chitiethocphan;

export const Chitiethocphandangki1 = ({ semesterDk, subjectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [datas, setDatas] = useState([]);
  const [datasExport, setDatasExport] = useState([]);
  const [counts, setCounts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const csvReport = {
    filename: "list_class.csv",
    headers: headerClassList,
    data: datasExport,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          status: 1,
          subjectId: subjectId,
          semester: semesterDk,
          limit: 99999,
          offset: 0,
        };
        const list = await classApi.getFilter(params);
        setDatasExport(list);
      } catch (error) {
        enqueueSnackbar(error.response.data.detail, {
          variant: "error",
        });
      }
    };
    fetchData();
  }, [limit, page, enqueueSnackbar, subjectId, semesterDk]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paramsCount = {
          status: 1,
          subjectId: subjectId,
          semester: semesterDk,
        };
        const params = {
          status: 1,
          subjectId: subjectId,
          semester: semesterDk,
          limit: limit,
          offset: page === 1 ? 0 : (page - 1) * limit,
        };
        const count = await classApi.count(paramsCount);
        setCounts(count);
        const list = await classApi.getFilter(params);
        setDatas(list);
      } catch (error) {
        enqueueSnackbar(error.response.data.detail, {
          variant: "error",
        });
      }
    };
    fetchData();
  }, [limit, page, enqueueSnackbar, subjectId, semesterDk]);
  const handleChangePageAndPageSize = (page, limit) => {
    setPage(page);
    setLimit(limit);
  };
  return (
    <div className="thongtindangkisv-bottom">
      {datas.length !== 0 && (
        <div className="table-dangki">
          <table style={{ width: "100%", padding: "10px" }}>
            <tr>
              <th>STT</th>
              <th>M?? l???p h???c</th>
              <th>T??n m??n h???c</th>
              <th>Ph??ng h???c</th>
            </tr>
            {datas.map((data, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{data.classId}</td>
                <td>{data.subjectName}</td>
                <td>{data.location}</td>
              </tr>
            ))}
          </table>
          <CSVLink {...csvReport}>
            <Button
              style={{
                width: "200px",
                marginTop: "35px",
                fontWeight: "400",
                background: "rgb(235, 43, 43)",
                color: "white",
              }}
              variant="contained"
            >
              Export file excel
            </Button>
          </CSVLink>
          <Pagination
            pageSize={limit}
            total={counts}
            page={page}
            onChange={handleChangePageAndPageSize}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            style={{ float: "right", marginTop: "40px" }}
          />
        </div>
      )}
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
    </div>
  );
};

export const Chitiethocphandangki2 = ({ semesterDk, subjectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [datas, setDatas] = useState([]);
  const [datasExport, setDatasExport] = useState([]);
  const [counts, setCounts] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const csvReport = {
    filename: "list_student.csv",
    headers: headerStudent,
    data: datasExport,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          subjectId: subjectId,
          semester: semesterDk,
          limit: 99999,
          offset: 0,
        };
        const list = await subjectApi.getAllStudenBySubjectId(params);
        setDatasExport(list);
      } catch (error) {
        enqueueSnackbar(error.response.data.detail, {
          variant: "error",
        });
      }
    };
    fetchData();
  }, [limit, page, enqueueSnackbar, subjectId, semesterDk]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paramsCount = {
          subjectId: subjectId,
          semester: semesterDk,
        };
        const params = {
          subjectId: subjectId,
          semester: semesterDk,
          limit: limit,
          offset: page === 1 ? 0 : (page - 1) * limit,
        };
        const count = await subjectApi.countAllStudenBySubjectId(paramsCount);
        setCounts(count);
        const list = await subjectApi.getAllStudenBySubjectId(params);
        setDatas(list);
      } catch (error) {
        enqueueSnackbar(error.response.data.detail, {
          variant: "error",
        });
      }
    };
    fetchData();
  }, [limit, page, enqueueSnackbar, semesterDk, subjectId]);
  const handleChangePageAndPageSize = (page, limit) => {
    setPage(page);
    setLimit(limit);
  };
  return (
    <div className="thongtindangkisv-bottom">
      {datas.length !== 0 && (
        <div className="table-dangki">
          <table style={{ width: "100%", padding: "10px" }}>
            <tr>
              <th>STT</th>
              <th>M?? sinh vi??n</th>
              <th>H??? v?? t??n</th>
              <th>Khoa vi???n</th>
            </tr>
            {datas.map((data, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{data.Id}</td>
                <td>{data.fullname}</td>
                <td>{data.schoolId}</td>
              </tr>
            ))}
          </table>
          <CSVLink {...csvReport}>
            <Button
              style={{
                width: "200px",
                marginTop: "35px",
                fontWeight: "400",
                background: "rgb(235, 43, 43)",
                color: "white",
              }}
              variant="contained"
            >
              Export file excel
            </Button>
          </CSVLink>
          <Pagination
            pageSize={limit}
            total={counts}
            page={page}
            onChange={handleChangePageAndPageSize}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            style={{ float: "right", marginTop: "40px" }}
          />
        </div>
      )}
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
    </div>
  );
};
