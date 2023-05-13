import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Link } from "react-router-dom";
import router from "./routes";
import "./App.css";
import { Navbar, Content, Footer } from "./components/index";



export default function App({ routes }) {
  return (
    <>
    <RouterProvider router={router}/>
    </>

  );
}
