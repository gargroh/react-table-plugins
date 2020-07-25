import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useTable } from "react-table";

// ToDO
import { useColumnSummary } from "../useColumnSummary";

const title = "Hello React";

function App() {
  return <div>{title}</div>;
}

describe("Column Summary Plugin", () => {
  test("should assert", () => {
    expect(1).toBe(1);
  });

  test("renders App component", () => {
    render(<App />);

    screen.debug();
  });
});
