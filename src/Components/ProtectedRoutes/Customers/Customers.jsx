import { useState, useEffect } from "react";
import { inputBox, tableHeading, initialValues, validationSchema } from "./dummyUtils";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Spinner from "../../utils/Spinner/Spinner";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePutApi } from "../../../customhooks/usePutApi";
import { useDeleteApi } from "../../../customhooks/useDeleteApi";
import { useGetApi } from "../../../customhooks/useGetApi";

export default function Customers() {
  const { token } = useSelector((state) => state?.submitStore?.loginVal);
  const [totalCustomers, setTotalCustomers] = useState([]);
  const [editMode, setEditMode] = useState({ active: false, id: null });

  const apiUrl = `${import.meta.env.VITE_API_URL}customer`;
  const currentCustomerId = editMode.id;
  const putUrl = currentCustomerId ? `${apiUrl}/${currentCustomerId}` : null;

  const { data: getData, loading: getLoading, error: getError, fetchData } = useGetApi(apiUrl, { Authorization: `Bearer ${token}` });
  const { registerUser, data: postData, loading: postLoading, error: postError } = usePostApi(apiUrl);
  const { updateData, data: putData, loading: putLoading, error: putError } = usePutApi(putUrl);
  const { deleteUser, data: delData, loading: delLoading, error: delError } = useDeleteApi();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const headers = { Authorization: `Bearer ${token}` };

      if (editMode.active && currentCustomerId) {
        await updateData(values, headers);
      } else {
        await registerUser(values, headers);
      }
      resetForm();
    },
  });

  const editCustomerFunc = (id) => {
    const findCustomer = totalCustomers.find((item) => item._id === id);
    if (findCustomer) {
      formik.setValues(findCustomer);
      setEditMode({ active: true, id });
    }
  };

  const delCustomerFunc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const headers = { Authorization: `Bearer ${token}` };
        await deleteUser(`${apiUrl}/${id}`, headers);
      }
    });
  };

  useEffect(() => {
    if (postData?.success) {
      Swal.fire("Success", "Customer has been added successfully", "success");
      fetchData(); // refresh
    }
    if (postError) {
      Swal.fire("Error", postError?.message || "Something went wrong", "error");
    }
  }, [postData, postError]);

  useEffect(() => {
    if (putData?.success) {
      Swal.fire("Success", "Customer has been updated successfully", "success");
      setEditMode({ active: false, id: null });
      formik.resetForm();
      fetchData(); // refresh
    }
    if (putError) {
      Swal.fire("Error", putError?.message || "Something went wrong", "error");
    }
  }, [putData, putError]);

  useEffect(() => {
    if (delData?.message) {
      Swal.fire("Deleted!", delData?.message, "success");
      fetchData(); // refresh
    }
    if (delError) {
      Swal.fire("Error", delError?.message || "Something went wrong", "error");
    }
  }, [delData, delError]);

  useEffect(() => {
    if (getData?.success) {
      setTotalCustomers(getData.data);
    }
    if (getError) {
      Swal.fire("Error", getError.message || "Something went wrong", "error");
    }
  }, [getData, getError]);

  return (
    <>
      {postLoading || putLoading || delLoading || getLoading ? (
        <Spinner />
      ) : (
        <div className="container-fluid p-4 main-dashboard vh-100">
          <h2 className="page-title mb-2">👤 Customer Management</h2>
          <div>
            <h3>{editMode.active ? "✏️ Edit Customer" : "➕ Add Customer"}</h3>

            <form onSubmit={formik.handleSubmit}>
              <div className="container">
                <div className="row">
                  {inputBox.map((input, id) => (
                    <div key={id} className="col-md-4 col-sm-12">
                      <label>{input.label}</label>

                      {input.type === "dropdown" ? (
                        <select
                          name={input.name}
                          className={`form-select mb-3 ${formik.touched[input.name] && formik.errors[input.name]
                              ? "is-invalid"
                              : ""
                            }`}
                          value={formik.values[input.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">{input.placeholder}</option>
                          {input.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className={`form-control mb-3 ${formik.touched[input.name] && formik.errors[input.name]
                              ? "is-invalid"
                              : ""
                            }`}
                          type={input.type}
                          name={input.name}
                          placeholder={input.placeholder}
                          value={formik.values[input.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      )}

                      {formik.touched[input.name] && formik.errors[input.name] && (
                        <div className="invalid-feedback">{formik.errors[input.name]}</div>
                      )}
                    </div>
                  ))}

                </div>
              </div>

              <button
                type="submit"
                className={`${editMode.active ? "btn btn-success" : "btn btn-primary"} mt-3`}
              >
                {editMode.active ? (
                  <>
                    <RxUpdate className="fs-5" /> Update Customer
                  </>
                ) : (
                  <>
                    <IoAddOutline className="fs-4" /> Add Customer
                  </>
                )}
              </button>
            </form>

            <div className="table-responsive">
              <table className="table my-4 text-center">
                <thead>
                  <tr>
                    {tableHeading.map((heading, id) => (
                      <th key={id} scope="col">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {totalCustomers?.map((item, id) => (
                    <tr key={item._id}>
                      <th scope="row">{id + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.ntnCnic}</td>
                      <td>{item.address}</td>
                      <td>{item.contact}</td>
                      <td>{item.province}</td>
                      <td>{item.customertype}</td>
                      <td>
                        <button
                          onClick={() => editCustomerFunc(item._id)}
                          className="btn btn-sm btn-primary me-2"
                        >
                          <MdModeEdit /> Edit
                        </button>
                        <button
                          onClick={() => delCustomerFunc(item._id)}
                          className="btn btn-sm btn-danger"
                        >
                          <MdDelete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
