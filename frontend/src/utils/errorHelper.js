export const extractFieldErrors = (errorResponse) => {
  
  console.log("error response :",errorResponse);
  if (errorResponse?.response?.data?.errors?.fieldErrors) {
    // console.log("error response :",errorResponse);
    const fieldErrors = errorResponse.response.data.errors.fieldErrors;
    const errors = {};
    for (const key in fieldErrors) {
      if (fieldErrors[key] && fieldErrors[key].length > 0) {
        errors[key] = fieldErrors[key][0];
      }
    }
    return errors;
  }
  return {};
};

export const extractFieldErrorsRegister = (errorResponse) => {
  if (errorResponse?.errors?.fieldErrors) {
    const fieldErrors = errorResponse.errors.fieldErrors;
    const errors = {};

    for (const key in fieldErrors) {
      if (fieldErrors[key]?.length) {
        errors[key] = fieldErrors[key][0];
      }
    }
    console.log("Returning errors:", errors);

    return errors;
  }

  return {};
};

export const getErrorMessage = (errorResponse, fallback = "Something went wrong") => {
  return errorResponse?.response?.data?.message || errorResponse?.message || fallback;
};
