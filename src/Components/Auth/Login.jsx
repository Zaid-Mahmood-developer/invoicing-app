import { Form, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { loginFields, validationSchema, initialValues } from "./dummyUtils";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { submitVals } from "../../redux/Slices/LoginValuesSlice";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginValues, setLoginValues] = useState([]);
    const handleSubmit = (values) => {
        const matchValues = loginValues.find((item) => ((item.username === values.username) && (item.email === values.email) && (item.password === values.password)))
        if (matchValues) {
            dispatch(submitVals(values))
            localStorage.setItem("loggedValues" , JSON.stringify(values))
            navigate("/home")
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Username or Email or Password is incorrect!",
            });
        }

    };

    useEffect(() => {
        const signUpValues = JSON.parse(localStorage.getItem("submitValues"));
        setLoginValues((prev) => ([...prev, signUpValues]))
    }, [])


    return (
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
                                        <Link to={"#"} className="my-2 float-start text-dark">{item.subLabel}</Link>
                                    </Col>
                                </Form.Group>
                            ))}

                            <Button className="w-25" variant="primary" type="submit" >
                                Login
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
