import { Form, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { loginFields , validationSchema , initialValues } from "./dummyUtils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { submitVals } from "../../redux/Slices/LoginValuesSlice";
const Login = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
    const handleSubmit = (values) => {
       if(values){
            dispatch(submitVals(values))
            navigate("/home")
       }
    };

    return (
        <div className="mx-auto text-center w-75 align-content-center vh-100">
            <div className="container-bg p-4 border rounded">
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
                                    </Col>
                                </Form.Group>
                            ))}

                            <Button className="w-25" variant="primary" type="submit" >
                                Submit
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
