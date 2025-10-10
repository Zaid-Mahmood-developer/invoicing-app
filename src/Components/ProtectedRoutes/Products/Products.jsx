import { useState, useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const Products = () => {
  const [totalProducts, setTotalProducts] = useState([]);
  const [editMode, setEditMode] = useState([false, null]);

  // ✅ Load products from localStorage on first render
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setTotalProducts(storedProducts);
  }, []);

  // ✅ Sync localStorage whenever totalProducts changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(totalProducts));
  }, [totalProducts]);

  const validationSchema = Yup.object({
    hsCode: Yup.string()
      .matches(/^\d{4}\.\d{4}$/, "HS Code must be in ####.#### format")
      .required("HS Code is required"),
    description: Yup.string()
      .max(60, "Description must be at most 60 characters")
      .required("Description is required"),
    uom: Yup.string().required("Unit of Measure is required"),
    taxType: Yup.string().required("Tax Type is required"),
    qtyInHand: Yup.number()
      .moreThan(0, "Quantity must be greater than 0")
      .required("Quantity is required"),
  });

  const formik = useFormik({
    initialValues: {
      hsCode: "",
      description: "",
      uom: "Numbers",
      taxType: "Goods at Standard Rates (Default)",
      qtyInHand: 0,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (editMode[0]) {
        // ✅ Update specific product
        setTotalProducts((prev) =>
          prev.map((item, index) => (index === editMode[1] ? values : item))
        );
        setEditMode([false, null]);
      } else {
        // ✅ Add new product
        setTotalProducts((prev) => [...prev, values]);
      }
      resetForm();
    },
  });

  const editProduct = (id) => {
    const findProduct = totalProducts.find((_, index) => index === id);
    formik.setValues(findProduct);
    setEditMode([true, id]);
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Delete specific product
        const filteredProducts = totalProducts.filter((_, index) => index !== id);
        setTotalProducts(filteredProducts);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  const handleHsCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length > 4) {
      value = value.slice(0, 4) + "." + value.slice(4);
    }

    formik.setFieldValue("hsCode", value);
  };

  return (
    <div className="container-fluid p-4 main-dashboard vh-100 ">
      <div className="form-section w-100">
        <h3>Add / Edit Product</h3>

        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3 mb-3">
            {/* HS Code */}
            <div className="col-md-4 col-sm-12">
              <label className="form-label">HS Code:</label>
              <input
                className="form-control"
                type="text"
                name="hsCode"
                placeholder="HS Code (####.####)"
                value={formik.values.hsCode}
                onChange={handleHsCodeChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.hsCode && formik.errors.hsCode && (
                <div className="text-danger small">{formik.errors.hsCode}</div>
              )}
            </div>

            <div className="col-md-4 col-sm-12">
              <label className="form-label">Product Description:</label>
              <input
                className="form-control"
                type="text"
                name="description"
                placeholder="Product Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger small">{formik.errors.description}</div>
              )}
            </div>

            <div className="col-md-4 col-sm-12">
              <label className="form-label">Unit of Measure (UoM):</label>
              <select
                className="form-select"
                name="uom"
                value={formik.values.uom}
                onChange={formik.handleChange}
              >
                <option value="Numbers">Numbers</option>
                <option value="KG">KG</option>
                <option value="PKTs">PKTs</option>
              </select>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <label className="form-label">Tax Type:</label>
            <select
              className="form-select"
              name="taxType"
              value={formik.values.taxType}
              onChange={formik.handleChange}
            >
              <option value="Goods at Standard Rates (Default)">
                Goods at Standard Rates (Default)
              </option>
              <option value="Goods at Reduced Rates">
                Goods at Reduced Rates
              </option>
              <option value="3rd Schedule Goods">3rd Schedule Goods</option>
            </select>
          </div>

          <div className="col-md-6 col-sm-12">
            <label className="form-label">Quantity in Hand:</label>
            <input
              className="form-control"
              type="number"
              name="qtyInHand"
              placeholder="Quantity in Hand"
              value={formik.values.qtyInHand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.qtyInHand && formik.errors.qtyInHand && (
              <div className="text-danger small">{formik.errors.qtyInHand}</div>
            )}
          </div>

          <button
            type="submit"
            className={`${editMode[0] ? "btn btn-success" : "btn btn-primary"} mt-3`}
          >
            {editMode[0] ? (
              <>
                <RxUpdate className="fs-5" /> Update Product
              </>
            ) : (
              <>
                <IoAddOutline className="fs-4" /> Add Product
              </>
            )}
          </button>
        </form>
      </div>

      <table className="table my-4 text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">HS Code</th>
            <th scope="col">Product Description</th>
            <th scope="col">Unit of Measure (UOM)</th>
            <th scope="col">Tax Type</th>
            <th scope="col">Quantity in hand</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {totalProducts.map((item, id) => (
            <tr className="p-4" key={id}>
              <th scope="row">{id + 1}</th>
              <td>{item.hsCode}</td>
              <td>{item.description}</td>
              <td>{item.uom}</td>
              <td>{item.taxType}</td>
              <td>{item.qtyInHand}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => editProduct(id)}
                >
                  <MdModeEdit /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(id)}
                >
                  <MdDelete /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
