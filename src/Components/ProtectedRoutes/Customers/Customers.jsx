import { useState, useEffect } from "react";
import { inputBox, tableHeading } from "./dummyUtils";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

// ✅ Formatter functions
const formatNTN_CNIC = (value) => {
  let digits = value.replace(/\D/g, ""); // remove non-digits
  if (digits.length <= 8) {
    // NTN format #######-#
    return digits.replace(/(\d{7})(\d{0,1})/, "$1-$2");
  } else {
    // CNIC format #####-#######-#
    return digits
      .replace(/(\d{5})(\d{0,7})(\d{0,1}).*/, "$1-$2-$3")
      .replace(/-$/, ""); // prevent dangling dash
  }
};

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("92")) {
    digits = "92" + digits; // enforce +92
  }
  return "+92-" + digits.substring(2).replace(/(\d{3})(\d{0,7}).*/, "$1-$2");
};

export default function Customers() {
  const [totalCustomers, setTotalCustomers] = useState([]);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [editMode, setEditMode] = useState([false, null]);

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Only alphabets and spaces allowed")
      .max(30, "Maximum 30 characters allowed")
      .required("Customer name is required"),
    ntnCnic: Yup.string()
      .test(
        "ntn-cnic-format",
        "Must be a valid NTN (#######-#) or CNIC (#####-#######-#)",
        (value) => {
          if (!value) return false;
          const ntnPattern = /^[0-9]{7}-[0-9]{1}$/;
          const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
          return ntnPattern.test(value) || cnicPattern.test(value);
        }
      )
      .required("NTN or CNIC is required"),
    address: Yup.string()
      .matches(/^[A-Za-z0-9\s,.\-\/()]+$/, "Invalid characters in address")
      .required("Address is required"),
    contact: Yup.string()
      .matches(/^\+92-[0-9]{3}-[0-9]{7}$/, "Format must be +92-XXX-XXXXXXX")
      .required("Contact number is required"),
    product: Yup.string()
      .test(
        "not-default",
        "Please select a product",
        (value) =>
          value !== "Select preferred product" && value !== "" && value !== undefined
      )
      .required("Product is required"),
  });

  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      ntnCnic: "",
      address: "",
      contact: "",
      product: "Select preferred product",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (editMode[0]) {
        setTotalCustomers((prev) =>
          prev.map((item, index) => (index === editMode[1] ? values : item))
        );
        setEditMode([false, null]);
      } else {
        setTotalCustomers((prev) => [...prev, values]);
      }
      resetForm();
    },
  });

  const editCustomerFunc = (id) => {
    const findCustomer = totalCustomers.find((_, index) => index === id);
    formik.setValues(findCustomer);
    setEditMode([true, id]);
  };

  const delCustomerFunc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredCustomers = totalCustomers.filter(
          (_, index) => index !== id
        );
        setTotalCustomers(filteredCustomers);
        Swal.fire("Deleted!", "Customer has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setDynamicProducts(products);
  }, []);

  return (
    <div className="container-fluid p-4 main-dashboard vh-100">
      <h2 className="page-title mb-2">👤 Customer Management</h2>
      <div>
        <h3>{editMode[0] ? "✏️ Edit Customer" : "➕ Add Customer"}</h3>

        <form onSubmit={formik.handleSubmit}>
          <div className="container">
            <div className="row">
              {inputBox.map((input, id) => (
                <div key={id} className="col-md-4 col-sm-12">
                  {input.type === "dropdown" ? (
                    <div>
                      <label>{input.label}</label>
                      <select
                        name={input.name}
                        className={`form-select mb-3 ${
                          formik.touched.product && formik.errors.product
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.product}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="Select preferred product">
                          Select preferred product
                        </option>
                        {dynamicProducts.map((option, idx) => (
                          <option key={idx} value={option.description}>
                            {option.description}
                          </option>
                        ))}
                      </select>
                      {formik.touched.product && formik.errors.product && (
                        <div className="invalid-feedback">
                          {formik.errors.product}
                        </div>
                      )}
                    </div>
                  ) : input.name === "ntnCnic" ? (
                    <div>
                      <label>{input.label}</label>
                      <input
                        className={`form-control mb-3 ${
                          formik.touched.ntnCnic && formik.errors.ntnCnic
                            ? "is-invalid"
                            : ""
                        }`}
                        type="text"
                        name="ntnCnic"
                        placeholder={input.placeholder}
                        value={formik.values.ntnCnic}
                        onChange={(e) => {
                          const formatted = formatNTN_CNIC(e.target.value);
                          formik.setFieldValue("ntnCnic", formatted);
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.ntnCnic && formik.errors.ntnCnic && (
                        <div className="invalid-feedback">
                          {formik.errors.ntnCnic}
                        </div>
                      )}
                    </div>
                  ) : input.name === "contact" ? (
                    <div>
                      <label>{input.label}</label>
                      <input
                        className={`form-control mb-3 ${
                          formik.touched.contact && formik.errors.contact
                            ? "is-invalid"
                            : ""
                        }`}
                        type="text"
                        name="contact"
                        placeholder={input.placeholder}
                        value={formik.values.contact}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          formik.setFieldValue("contact", formatted);
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contact && formik.errors.contact && (
                        <div className="invalid-feedback">
                          {formik.errors.contact}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label>{input.label}</label>
                      <input
                        className={`form-control mb-3 ${
                          formik.touched[input.name] &&
                          formik.errors[input.name]
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
                      {formik.touched[input.name] &&
                        formik.errors[input.name] && (
                          <div className="invalid-feedback">
                            {formik.errors[input.name]}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`${editMode[0] ? "btn btn-success" : "btn btn-primary"} mt-3`}
          >
            {editMode[0] ? (
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
                  <th key={id} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {totalCustomers.map((item, id) => (
                <tr className="p-4" key={id}>
                  <th scope="row">{id + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.ntnCnic}</td>
                  <td>{item.address}</td>
                  <td>{item.contact}</td>
                  <td>{item.product}</td>
                  <td>
                    <button
                      onClick={() => editCustomerFunc(id)}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <MdModeEdit /> Edit
                    </button>
                    <button
                      onClick={() => delCustomerFunc(id)}
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
  );
}
