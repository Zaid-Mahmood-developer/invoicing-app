import { Form, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { loginFields, validationSchema, initialValues } from "./dummyUtils";
import Spinner from "../utils/Spinner/Spinner";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePostApi } from "../../customhooks/usePostApi";
import { submitVals } from "../../redux/Slices/LoginValuesSlice";
const Login = () => {
    const postUrl = `${import.meta.env.VITE_API_URL}login`;
    const { registerUser, data, loading, error } = usePostApi(postUrl);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        await (registerUser({ ...values }));
    };

    useEffect(() => {
        if (data?.user) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data?.message
            })
        dispatch(submitVals(data))
            navigate("/home")
        } else if(error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.message || "Something went wrong!"
            }).then(() => {
                navigate("/")
            })
        }
    }, [data, error, navigate])

    return (
        <>
            {loading ?
              <Spinner/>
                :
                <div className="container-bg mx-auto text-center w-50 float-end align-content-center vh-100 container">
                    <div className="p-4 h-75">
                        <h2 className="my-4">Login Form</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched }) => (
                                <FormikForm>
                                    {loginFields.map((item, id) => (
                                        <Form.Group key={id} as={Row} className="mb-3">
                                            <Form.Label className="fs-5" column sm="2">
                                                {item.label}
                                            </Form.Label>
                                            <Col sm="10">
                                                <Field
                                                    as={Form.Control}
                                                    type={item.type}
                                                    name={item.name}
                                                    placeholder={item.placeholder}
                                                    isInvalid={touched[item.name] && !!errors[item.name]}
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    <ErrorMessage name={item.name} />
                                                </Form.Control.Feedback>
                                                <Link to={"forgot-password"} className="my-2 float-start text-dark">{item.subLabel}</Link>
                                            </Col>
                                        </Form.Group>
                                    ))}

                                    <Button className="w-25" variant="primary" type="submit" >
                                        Login
                                    </Button>

                                    <p>In case of signup</p>
                                    <Link to={"/signup"}>
                                        Signup
                                    </Link>
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            }
        </>
    );
};

export default Login;
