import Index from "./views"
import Proposes from "./views/proposes/index"
import ProposeAdd from "./views/proposes/add"
import ProposeEdit from "./views/proposes/edit"

var routes = [
    {
        path: "/index",
        name: "Anasayfa",
        component: Index,
        layout: "/admin"
    },
    {
        path: "/proposes/add",
        name: "Teklif Ekle",
        component: ProposeAdd,
        layout: "/admin"
    },
    {
        path: "/proposes/edit/:id",
        name: "Teklif Düzenle",
        component: ProposeEdit,
        layout: "/admin"
    },
    {
        path: "/proposes",
        name: "Teklifler",
        component: Proposes,
        layout: "/admin"
    }
];

export default routes;