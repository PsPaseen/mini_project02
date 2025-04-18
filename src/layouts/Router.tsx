import { Route, Routes } from "react-router"
import { Layout } from "../components/Layout"
import { Homepage } from "../pages/Homepage"
import { ButtonPage } from "../pages/ButtonPage"
import { TablePage } from "../pages/TablePage"

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<Homepage />} />
                <Route path="/excel" element={<ButtonPage />} />
                <Route path="/table" element={<TablePage/>} />
            </Route>
        </Routes>
    )
}