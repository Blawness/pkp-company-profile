/* eslint-disable @typescript-eslint/no-require-imports */
import "./setup";
const rtl = require("@testing-library/react");
export const { render, screen, fireEvent, waitFor, cleanup } = rtl;
