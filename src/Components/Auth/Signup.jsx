import { Form, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { signupFields, signupInitialValues, signupValidationSchema } from "./dummyUtils";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
   localStorage.setItem("submitValues" , JSON.stringify(values))
    navigate("/");
  };

  return (
    <div className="container-bg mx-auto text-center w-50 float-end align-content-center p-4 container">
      <div>
        <h2 className="my-4">Signup Form</h2>
        <Formik
          initialValues={signupInitialValues}
          validationSchema={signupValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue}) => (
            <FormikForm>
              {signupFields.map((item, id) => (
                <Form.Group key={id} as={Row} className="mb-3">
                  <Form.Label className="fs-5" column sm="2">
                    {item.label}
                  </Form.Label>
                  <Col sm="10">
                    {item.type === "dropdown" ? (
                      <Field
                        as="select"
                        name={item.name}
                        className={`form-select ${
                          touched[item.name] && errors[item.name]
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="Select province">Select province</option>
                        {item.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    ) : (
                      <Field
                        as={Form.Control}
                        type={item.type}
                        name={item.name}
                        placeholder={item.placeholder}
                        isInvalid={touched[item.name] && !!errors[item.name]}
                        onInput={(e) => {
                          if (item.name === "ntncninc") {
                            let value = e.target.value;
                            value = value.replace(/\D/g, "").slice(0, 7);
                            setFieldValue(item.name, value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (item.name === "ntncninc") {
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Tab" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight"
                            ) {
                              e.preventDefault();
                            }
                          }
                        }}
                      />
                    )}

                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name={item.name} />
                    </Form.Control.Feedback>

                    {item.subLabel && (
                      <Link to="#" className="my-2 float-start text-dark">
                        {item.subLabel}
                      </Link>
                    )}
                  </Col>
                </Form.Group>
              ))}

              <Button className="w-25" variant="primary" type="submit">
                Register
              </Button>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
