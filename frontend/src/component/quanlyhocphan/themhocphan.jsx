import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, TextField } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import subjectApi from "../../api/subjectApi";
import { SCHOOL_ID_DEFAULT, STATUS_DEFAULT } from "../../dummydb/dataDefault";
import { listkhoavien } from "../../dummydb/khoavien";
import { liststatus } from "../../dummydb/status";
import "../style2.css";
import "../style3.css";

function Themhocphan(props) {
  const [khoavien, setKhoavien] = useState(SCHOOL_ID_DEFAULT);
  const [valueStatus, setValueStatus] = useState(STATUS_DEFAULT);
  const { enqueueSnackbar } = useSnackbar();
  const schema = yup.object().shape({
    subjectId: yup.string().required("please enter your subjectId"),
    subjectName: yup.string().required("please enter your subjectName"),
    credit: yup.number().min(0, "Please enter at least 0 "),
    note: yup.string().required("please enter your note"),
    programsemester: yup.number().min(1, "Please enter at least 1 "),
  });
  const form = useForm({
    defaultValues: {
      subjectId: "",
      subjectName: "",
      credit: 0,
      schoolId: SCHOOL_ID_DEFAULT,
      status: STATUS_DEFAULT,
      note: "",
      programsemester: 0,
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const handleOnSubmit = async (value) => {
    try {
      await subjectApi.add(value);
      enqueueSnackbar("Success", {
        variant: "success",
      });
      form.reset();
      setKhoavien(SCHOOL_ID_DEFAULT);
      setValueStatus(STATUS_DEFAULT)

    } catch (error) {
      enqueueSnackbar(error.response.data.detail, {
        variant: "error",
      });
    }
  };
  const handleChangeStatus = (event) => {
    setValueStatus(event.target.value);
  };
  const handleChangeKhoavien = (event) => {
    setKhoavien(event.target.value);
  };

  return (
    <div>
      <div className="quanlysinhvien-content">
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <p className="thongtincanhan-title">Nh???p th??ng tin h???c ph???n</p>
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
                placeholder="Ch??a c???p nh???t"
              />
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="subjectId" />
              </p>
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
          {/*Status */}
          <div className="thongtincanhan-contents">
            <div className="thongtincanhan-contents-label">
              Tr???ng th??i h???c ph???n :
            </div>
            <div className="thongtincanhan-contents-input">
              <TextField
                {...register("status")}
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
              <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
                <ErrorMessage errors={errors} name="status" />
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
              Th??m h???c ph???n
            </Button>
          </div>
        </form>
      </div>
      <ImportFile></ImportFile>
    </div>
  );
}

export default Themhocphan;

export const ImportFile = () => {
  const { register, handleSubmit } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const handleImport = async (value) => {
    console.log(value.file);
    try {
      const data = new FormData();
      data.append('file', value.file[0]);
      await subjectApi.import(data);
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
    <>
      <form onSubmit={handleSubmit(handleImport)}>
        <div className="thongtincanhan-contents">
          <div className="thongtincanhan-contents-input">
            <Button
              style={{
                width: "250px",
                marginTop: "40px",
                fontWeight: "400",
                background: "rgb(235, 43, 43)",
                color: "white",
              }}
              variant="contained"
              type="submit"
            >
              Import
            </Button>
          </div>
          <div className="thongtincanhan-contents-file">
            <TextField
              {...register("file")}
              type="file"
              variant="outlined"
              margin="dense"
              name="file"
            />
          </div>
        </div>
      </form>
    </>
  );
};
