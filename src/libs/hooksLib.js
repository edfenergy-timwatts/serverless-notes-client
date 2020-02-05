// React Hook for getting/setting state
import { useState } from "react";

// Define custom React Hook capturing all form fields and providing a single function to handle any changes in values
export function useFormFields(initialState) {

// Get application state, with initial values set by parameter
  const [fields, setValues] = useState(initialState);

// Use event object to reset state, ensuring values reflect onChange triggers from the form
  return [
    fields,
    function(event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
}
