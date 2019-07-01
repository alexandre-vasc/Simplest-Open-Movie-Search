/**
 * Colection of utilitary methods
 */

module.exports = app => {
    /** 
     * Do the basic validation of the user input.
     * return null if no error was found
     * return a error message otherwise
     * @param fieldName:    the display name of the field
     * @param fieldValue:   the input value of the field
     * @param expectedType: the field type (string, int etc)
     * @param minLenValue:  the minimum number of character allowed
     *                      if the field is a string, the minimum value
     *                      if the value is a number
     * @param maxLenValue:  same as minLenValue
     * @param required:      whenever this value can be undefined
    */
    const validateField =  (fieldName, fieldValue, expectedType, 
                  minLenValue = 1, maxLenValue = 256, required = true) => {
        if (required && fieldValue == null)
            throw formatedError(`The field ${fieldName} is mandatory but haven't been specified`)
        else if (!required && fieldValue == null)
            return 
        
        if (expectedType === "number")
            fieldValue = Number.parseInt(fieldValue)

        if (typeof fieldValue !== expectedType || 
            (typeof fieldValue === "number" &&  isNaN(fieldValue))) {
            throw formatedError(`The field ${fieldName} should be an ${expectedType}`)
        }
        
        if (typeof fieldValue === "string" && 
            (fieldValue.length < minLenValue
                 || fieldValue.length > maxLenValue))
        {
            throw formatedError(`The field ${fieldName} should have between` +
                    ` ${minLenValue} and ${maxLenValue} characters`)
        }
        else if (typeof fieldValue === "number" &&
                 (fieldValue < minLenValue || fieldValue > maxLenValue)) 
        {
            throw formatedError(`${fieldValue} is not avalid value for field ${fieldName}` +
                                 ` it should range between ${minLenValue} and ${maxLenValue}`)
        }
        // all OK
    }


    const validateFieldNotRequired = (fieldName, fieldValue, expectedType, 
        minLenValue = 1, maxLenValue = 256) => {
            validateField(fieldName, fieldValue, expectedType, 
                          minLenValue = 1, maxLenValue = 256, false)
    }

    /**
     * Format a string message to json
     * @param {string} errorMessage   user friendly error message
     */
    const formatedError = (errorMessage) => {
        return {
            error: errorMessage
        }
    }

    return {validateField, validateFieldNotRequired, formatedError}
}