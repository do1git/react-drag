import { useEffect, useState } from "react";

export const useMainScroll = (triggerFunc: Function) => {
  console.log("UUUU");
  const main = document.querySelector<any>("#mainDnd");
  const [state, setState] = useState({
    x: 0,
    y: 0,
  });
  const onscroll = () => {
    console.log(window.scrollY);
    setState({ y: window.scrollY, x: window.scrollX });
    triggerFunc();
  };
  useEffect(() => {
    window.addEventListener("scroll", onscroll);
    return () => window.removeEventListener("scroll", onscroll);
  }, []);
  return state;
};
