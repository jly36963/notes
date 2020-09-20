// ------------
// formik
// ------------

// install
`
npm i --save formik
`

// useFormik hook
  // input properties
    // initialValues -- initial form values
    // onSubmit -- submit handler function
    // validationSchema -- yup validation
    // validate -- validation function
  // output properties
    // formik.values -- form values
    // formik.errors -- form errors
    // formik.touched -- whether or not a field has been visited
    // formik.handleChange -- change handler for each input/select/textarea
    // formik.handleSubmit -- submission handler

// ------------
// example (newsletter signup form) (with yup)
// ------------

// imports
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const SignupForm = () => {
  // useFormik hook
  const formik = useFormik({
    // initial values
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    // on submit function
    onSubmit: values => {
      console.log(values) // do something with the values
    },
    // validation
    validationSchema: yup.object({
      firstName: yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
  });

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.firstName}
      />
      {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
      <br/>
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.lastName}
      />
      {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
      <br/>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      {touched.email && errors.email && <div>{errors.email}</div>}
      <br/>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;


// ------------
// example (newsletter signup form) (normal validation)
// ------------

import React from 'react';
import { useFormik } from 'formik';

const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length > 20) {
    errors.lastName = 'Must be 20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

const SignupForm = () => {
  // useFormik hook
    // provide 
      // initialValues (initial form values) 
      // and onSubmit (submit handler function)
    // properties
      // formik.values -- form values
      // formik.errors -- form errors
      // formik.touched -- whether or not a field has been visited
      // formik.handleChange -- change handler for each input/select/textarea
      // formik.handleSubmit -- submission handler
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
    validate
  });

  const { values, errors, touched } = formik;
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName && <div>{formik.errors.firstName}</div>}
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName && <div>{formik.errors.lastName}</div>}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;


// Formik's handleChange works a lot like this:

// const [values, setValues] = React.useState({});
// const handleChange = e => {
//   setValues({
//     ...prevValues,
//     [e.target.name]: e.target.value
//   })
// }


// ------------
// withFormik (HOC)
// ------------

import React from 'react';
import { withFormik } from 'formik';

const MyForm = ({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        name="name"
      />
      {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

const MyEnhancedForm = withFormik({
  // map props to values
  mapPropsToValues: () => ({ name: '' }),
  // validation
  validate: values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    return errors;
  },
  // handle submit
  handleSubmit: async (values, { setSubmitting }) => {
    const apiResponse = await axios.post('/some/endpoint', values)
    const { id } = apiResponse.data;
    console.log(id);
    setSubmitting(false);
  },
  // display name
  displayName: 'BasicForm',
})(MyForm);

export default MyEnhancedForm;


// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------