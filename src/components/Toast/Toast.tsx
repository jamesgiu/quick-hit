import React from "react";
import { SemanticToastContainer, toast, ToastOptions } from "react-semantic-toasts-extended";
import "./Toast.css";

const TOAST_DEFAULT_OPTS = {
    animation: "bounce",
    time: 30000,
} as ToastOptions;

/**
 * QuickHit Toast
 */
function Toaster(): JSX.Element {
    return <SemanticToastContainer position="bottom-center" className={"quick-hit-toasts"} maxToasts={1} />;
}

export const makeSuccessToast = (title: string, message: string): void => {
    toast({
        ...TOAST_DEFAULT_OPTS,
        title: title,
        description: message,
        type: "success",
        icon: "checkmark",
    });
};

export const makeErrorToast = (title: string, message: string): void => {
    toast({
        ...TOAST_DEFAULT_OPTS,
        title: title,
        description: message,
        type: "error",
        icon: "warning",
    });
};

export const makeRefreshToast = (): void => {
    toast({
        time: 0,
        title: "New matches have been added",
        description: "Please refresh the application.",
        type: "error",
        icon: "warning",
    });
};

export default Toaster;
