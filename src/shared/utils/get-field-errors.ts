interface ErrorResponse {
    formErrors: string[];
    fieldErrors: {
        [key: string]: string[];
    };
}

export const getFieldErrorsAsString = (errors: ErrorResponse): string => {
    const fieldErrors = errors.fieldErrors;
    const errorMessages: string[] = [];

    for (const field in fieldErrors) {
        if (fieldErrors.hasOwnProperty(field)) {
            const messages = fieldErrors[field].join(", ");
            errorMessages.push(messages);
        }
    }

    if (errorMessages.length > 1) {
        return `<ul>${errorMessages.map(msg => `<li>${msg}</li>`).join("")}</ul>`;
    } else {
        return errorMessages.join(", ");
    }
}