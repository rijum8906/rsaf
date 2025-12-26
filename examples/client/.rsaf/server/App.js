import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function App() {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Test React App" }),
    /* @__PURE__ */ jsx("h2", { children: count }),
    /* @__PURE__ */ jsx("button", { onClick: () => setCount(count + 1), children: "+" }),
    /* @__PURE__ */ jsx("button", { onClick: () => setCount(count - 1), children: "-" })
  ] });
}
export {
  App
};
