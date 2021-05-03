import React from 'react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

const TOAST_DEFAULT_OPTS = {
    duration: 30000,
}

/**
 * QuickHit Toast
 */
function Toaster() {
    return (
        <SemanticToastContainer position="bottom-center" />
    );
}

export const makeSuccessToast = (title: string, message: string) : void => {
    toast({
        ...TOAST_DEFAULT_OPTS,
        title: title,
        description: message,
        type: "success",
        icon: "checkmark"
    });
}

export const makeErrorToast = (title: string, message: string) : void => {
    toast({
        ...TOAST_DEFAULT_OPTS,
        title: title,
        description: message,
        type: "error",
        icon: "warning"
    });
}

export default Toaster;