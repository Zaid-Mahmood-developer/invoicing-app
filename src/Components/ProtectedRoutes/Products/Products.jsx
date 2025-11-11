import { useState, useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Spinner from "../../utils/Spinner/Spinner";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { initialValues, validationSchema, products } from "./dummyUtils";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePutApi } from "../../../customhooks/usePutApi";
import { useDeleteApi } from "../../../customhooks/useDeleteApi";
import { useGetApi } from "../../../customhooks/useGetApi";
const Products = () => {
  const { token } = useSelector((state) => state?.submitStore?.loginVal)
  const [totalProducts, setTotalProducts] = useState([]);
  const [editMode, setEditMode] = useState({ active: false, id: null });
  const postUrl = `${import.meta.env.VITE_API_URL}products`;
  const currentProductId = editMode.id;
  const putUrl = currentProductId ? `${import.meta.env.VITE_API_URL}products/${currentProductId}` : null;
  const { data: getData, loading: getLoading, error: getError, fetchData } = useGetApi(postUrl, { Authorization: `Bearer ${token}` });
  const { registerUser, data: postData, loading: postLoading, error: postError } = usePostApi(postUrl);
  const { updateData, data: putData, loading: putLoading, error: putError } = usePutApi(putUrl);
  const { deleteUser, data: delData, loading: delLoading, error: delError } = useDeleteApi();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = { ...values };
      const headers = { Authorization: `Bearer ${token}` };

      if (editMode.active && currentProductId) {
        await updateData(payload, headers);
      } else {
        await registerUser(payload, headers);
      }
      resetForm();
    },
  });

  const editProduct = (id) => {
    const findProduct = totalProducts.find((item) => item._id === id);
    if (findProduct) {
      formik.setValues(findProduct);
      setEditMode({ active: true, id });
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const headers = { Authorization: `Bearer ${token}` }
        await deleteUser(`${import.meta.env.VITE_API_URL}products/${id}`, headers)
        const filteredProducts = totalProducts.filter((item) => {
          return item._id !== id
        });
        setTotalProducts(filteredProducts);
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

  useEffect(() => {
    if (postData?.success) {
      setTotalProducts((prev) => {
        const arrayPrev = Array.isArray(prev) ? prev : [];
        const exists = arrayPrev.some((item) => item._id === postData.data._id);
        if (exists) return arrayPrev;
        return [...arrayPrev, postData.data];
      });
      Swal.fire("Success", "Product has been added successfully", "success");
    }

    if (postError) {
      Swal.fire("Error", postError?.message || "Something went wrong", "error")
    }

  }, [postData, postError]);

  useEffect(() => {
    if (putData?.success) {
      setTotalProducts((prev) =>
        prev.map((item) => {
          if (item._id === currentProductId) {
            return { ...item, ...putData.product };
          }
          return item;
        })
      );
      Swal.fire("Success", "Product has been updated successfully", "success");
      setEditMode({ active: false, id: null });
      formik.resetForm();
    }
    if (putError) {
      Swal.fire("Error", putError?.message || "Something went wrong", "error")
    }
  }, [putData, putError])

  useEffect(() => {
    delData?.message ? Swal.fire("Success", delData?.message, "success") : delError ? Swal.fire("Error", delError?.message, "error") : null;
  }, [delData, delError])

  useEffect(() => {
    console.log(getData, "getDAta")
    if (getData?.success) {
      setTotalProducts(getData?.products);
    }
    if (getError) {
      Swal.fire("Error", getError.message || "Something went wrong", "error");
    }
  }, [getData, getError]);
console.log(totalProducts , "totalPro")
  return (
    <>
      {postLoading || putLoading || delLoading || getLoading ? (
        <Spinner />
      ) :
        (
          <div className="container-fluid p-4 main-dashboard vh-100">
            <h2 className="page-title mb-2">📦 Product Management</h2>
            <div>
              <h3>{editMode.active ? "✏️ Edit Product" : "➕ Add Product"}</h3>

              <form onSubmit={formik.handleSubmit}>
                <div className="container">
                  <div className="row">
                    {products.map((field, idx) => {
                      return (
                        <div className="col-md-4 col-sm-12 mb-3" key={idx}>
                          <label className={field.formLabelClass}>{field.labelName}</label>

                          {(field.type !== "dropdown" && field.type !== "dropdownUnit") && (
                            <input
                              className={field.inputClass}
                              type={field.type}
                              name={field.name}
                              placeholder={field.placeholder}
                              value={formik.values[field.name]}
                              onChange={
                                field.name === "hsCode"
                                  ? handleHsCodeChange
                                  : formik.handleChange
                              }
                              onBlur={formik.handleBlur}
                            />
                          )}

                          {field.type === "dropdownUnit" && (
                            <select
                              className="form-select"
                              name={field.name}
                              value={formik.values[field.name]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">Select {field.labelName}</option>
                              {field.options.map((option, i) => (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}

                          {field.type === "dropdown" && (
                            <select
                              className="form-select"
                              name={field.name}
                              value={formik?.values.taxType.descriptionType}
                              onChange={(e) => {
                                const selected = field.options.find(
                                  (opt) => opt.descriptionType === e.target.value
                                ) ||
                                  // { descriptionType: "", ScenarioId: "", taxValue: "" }
                                  { descriptionType: "", taxValue: "" }
                                  ;
                                formik.setFieldValue("taxType", selected);
                              }}
                              onBlur={formik.handleBlur}>
                              <option value="">Select {field.labelName}</option>
                              {field.options.map((option, i) => (
                                <option key={i} value={option?.descriptionType}>
                                  {option?.descriptionType}
                                </option>
                              ))}
                            </select>
                          )}

                          {field.type === "dropdown" ?
                            (formik.touched.taxType?.descriptionType &&
                              formik.errors.taxType?.descriptionType && (
                                <div className="text-danger small">
                                  {formik.errors.taxType.descriptionType}
                                </div>
                              ))
                            :
                            formik.touched[field.name] && formik.errors[field.name] && (
                              <div className="text-danger small">
                                {formik.errors[field.name]}
                              </div>
                            )
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>

                {editMode.active ? (
                  <button type="submit" className="btn btn-success mt-3">
                    <RxUpdate className="fs-5" /> Update Product
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <IoAddOutline className="fs-4" /> Add Product
                  </button>
                )}
              </form>

              <div className="table-responsive">
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
                    {totalProducts?.map((item, id) => {
                      return (
                        <tr className="p-4" key={item?._id}>
                          <th scope="row">{id + 1}</th>
                          <td>{item.hsCode}</td>
                          <td>{item.description}</td>
                          <td>{item.uom}</td>
                          <td>{item.taxType.descriptionType}</td>
                          <td>{item.qtyInHand}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => editProduct(item._id)}
                            >
                              <MdModeEdit /> Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteProduct(item._id)}
                            >
                              <MdDelete /> Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Products;
