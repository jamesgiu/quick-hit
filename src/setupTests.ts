// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as nodeCrypto from "crypto";

window.crypto = {
    getRandomValues: function (buffer): NodeJS.ArrayBufferView {
        return nodeCrypto.randomFillSync(buffer);
    },
};

window.matchMedia = jest.fn();
