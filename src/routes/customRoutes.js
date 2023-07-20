import { Route, Routes } from "react-router-dom";
import Home from '../pages/home'

export default function CustomRoutes (){
    return(
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="home" element={<Home/>} />
        </Routes>
    )
}