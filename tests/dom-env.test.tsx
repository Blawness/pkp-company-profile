import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";

describe("test DOM environment", () => {
  test("screen queries bind to a live document", () => {
    render(<div>halo dunia</div>);
    expect(screen.getByText("halo dunia")).toBeInTheDocument();
  });
});
