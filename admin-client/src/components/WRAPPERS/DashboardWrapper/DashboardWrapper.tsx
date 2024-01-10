import React, { ReactNode, useState } from "react";
import "./DashboardWrapper.scss";
import logo from "../../../medias/logo.png";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../ReduxStore/store";
import { useDispatch } from "react-redux";
import {
    setLoading,
    setSideBarActiveTab,
    toggleMobSidebar,
    toogleDarkLight,
} from "../../../ReduxStore/UISlice";
import Modal from "../../UIComponents/Modal/Modal";
import AddIcon from "../../UIComponents/AddIcon/AddIcon";
import { getUrl, includeDarkClass } from "../../../CONFIG";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MenuButton } from "../../UIComponents/MenuButton/MenuButton";
import UserProfile from "../../../medias/UserProfile";

interface DashboardWrapperProps {
    handleLogout: any;
    children?: ReactNode;
    heading: string;
    fetchAllUserData: any;
}

const lightModeSvgContent =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" x="0px" y="0px"><path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM6.75 12C6.75 9.1005 9.1005 6.75 12 6.75C14.8995 6.75 17.25 9.1005 17.25 12C17.25 14.8995 14.8995 17.25 12 17.25C9.1005 17.25 6.75 14.8995 6.75 12Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.75C12.4142 1.75 12.75 2.08579 12.75 2.5V5C12.75 5.41421 12.4142 5.75 12 5.75C11.5858 5.75 11.25 5.41421 11.25 5V2.5C11.25 2.08579 11.5858 1.75 12 1.75ZM12 18.25C12.4142 18.25 12.75 18.5858 12.75 19V21.5C12.75 21.9142 12.4142 22.25 12 22.25C11.5858 22.25 11.25 21.9142 11.25 21.5V19C11.25 18.5858 11.5858 18.25 12 18.25Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M4.75213 4.75216C5.04503 4.45926 5.5199 4.45926 5.81279 4.75216L7.58056 6.51992C7.87345 6.81282 7.87345 7.28769 7.58056 7.58058C7.28767 7.87348 6.81279 7.87348 6.5199 7.58058L4.75213 5.81282C4.45924 5.51992 4.45924 5.04505 4.75213 4.75216ZM16.4194 16.4194C16.7123 16.1265 17.1872 16.1265 17.4801 16.4194L19.2478 18.1872C19.5407 18.4801 19.5407 18.955 19.2478 19.2478C18.9549 19.5407 18.4801 19.5407 18.1872 19.2478L16.4194 17.4801C16.1265 17.1872 16.1265 16.7123 16.4194 16.4194Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2479 4.75216C19.5408 5.04506 19.5408 5.51993 19.2479 5.81282L17.4801 7.58059C17.1872 7.87348 16.7123 7.87348 16.4194 7.58059C16.1265 7.2877 16.1265 6.81282 16.4194 6.51993L18.1872 4.75216C18.4801 4.45927 18.955 4.45927 19.2479 4.75216ZM7.5806 16.4194C7.87349 16.7123 7.87349 17.1872 7.5806 17.4801L5.81283 19.2479C5.51994 19.5407 5.04506 19.5407 4.75217 19.2479C4.45928 18.955 4.45928 18.4801 4.75217 18.1872L6.51994 16.4194C6.81283 16.1265 7.2877 16.1265 7.5806 16.4194Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M22.25 12C22.25 12.4142 21.9142 12.75 21.5 12.75L19 12.75C18.5858 12.75 18.25 12.4142 18.25 12C18.25 11.5858 18.5858 11.25 19 11.25L21.5 11.25C21.9142 11.25 22.25 11.5858 22.25 12ZM5.75 12C5.75 12.4142 5.41421 12.75 5 12.75L2.5 12.75C2.08579 12.75 1.75 12.4142 1.75 12C1.75 11.5858 2.08579 11.25 2.5 11.25L5 11.25C5.41421 11.25 5.75 11.5858 5.75 12Z" fill="black" /></svg>';

const darkModeSvgContent =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" x="0px" y="0px"><path d="M14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7C13.5523 7 14 7.44772 14 8Z" fill="black"/><path d="M17.5 18C18.3284 18 19 17.3284 19 16.5C19 15.6716 18.3284 15 17.5 15C16.6716 15 16 15.6716 16 16.5C16 17.3284 16.6716 18 17.5 18Z" fill="black"/><path d="M13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19Z" fill="black"/><path d="M19 10C19.5523 10 20 9.55228 20 9C20 8.44772 19.5523 8 19 8C18.4477 8 18 8.44772 18 9C18 9.55228 18.4477 10 19 10Z" fill="black"/><path d="M13 14.5C13 14.7761 12.7761 15 12.5 15C12.2239 15 12 14.7761 12 14.5C12 14.2239 12.2239 14 12.5 14C12.7761 14 13 14.2239 13 14.5Z" fill="black"/><path d="M14.5 13C14.7761 13 15 12.7761 15 12.5C15 12.2239 14.7761 12 14.5 12C14.2239 12 14 12.2239 14 12.5C14 12.7761 14.2239 13 14.5 13Z" fill="black"/><path d="M10 4.5C10 4.77614 9.77614 5 9.5 5C9.22386 5 9 4.77614 9 4.5C9 4.22386 9.22386 4 9.5 4C9.77614 4 10 4.22386 10 4.5Z" fill="black"/><path d="M15.5 6C15.7761 6 16 5.77614 16 5.5C16 5.22386 15.7761 5 15.5 5C15.2239 5 15 5.22386 15 5.5C15 5.77614 15.2239 6 15.5 6Z" fill="black"/><path d="M6 7.5C6 7.77614 5.77614 8 5.5 8C5.22386 8 5 7.77614 5 7.5C5 7.22386 5.22386 7 5.5 7C5.77614 7 6 7.22386 6 7.5Z" fill="black"/><path d="M5.5 16C5.77614 16 6 15.7761 6 15.5C6 15.2239 5.77614 15 5.5 15C5.22386 15 5 15.2239 5 15.5C5 15.7761 5.22386 16 5.5 16Z" fill="black"/><path d="M8 18.5C8 18.7761 7.77614 19 7.5 19C7.22386 19 7 18.7761 7 18.5C7 18.2239 7.22386 18 7.5 18C7.77614 18 8 18.2239 8 18.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.5C10 12.8807 8.88071 14 7.5 14C6.11929 14 5 12.8807 5 11.5C5 10.1193 6.11929 9 7.5 9C8.88071 9 10 10.1193 10 11.5ZM8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="black"/></svg>';

const sideBarData = [
    { name: "Tasks", url: "/tasks" },
    { name: null, url: null },
    { name: "All Tasks", url: "/all-tasks" },
    { name: "Profile", url: "/profile" },
];
const navLinks = [
    { name: null, url: null },
];

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({
    children,
    fetchAllUserData,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [todoTitleInput, setTodoTitleInput] = useState<string | null>(null);
    const [todoDescInput, setTodoDescInput] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('Todo');

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setSelectedStatus(newStatus);
        // onChange(newStatus);
    };
    const [selectedPriority, setSelectedPriority] = useState('Medium');

    const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setSelectedPriority(newStatus);
        // onChange(newStatus);
    };


    const navigate = useNavigate();
    const params = useParams();
    const token = useSelector((state: RootState) => state && state.User && state.User.token);
    const allUserData = useSelector((state: RootState) => state && state.User && state.User.allUserData);
    const currentPage = useSelector((state: RootState) => state && state.UI && state.UI.currentPage);
    const currSideBarIdx = useSelector((state: RootState) => state && state.UI && state.UI.sideBarActiveTab)
    const theme = useSelector((state: RootState) => state && state.UI && state.UI.theme);
    const darkMode = useSelector((state: RootState) => state && state.UI && state.UI.theme.dark);
    const isMobSidebarOpen = useSelector(
        (state: RootState) => state && state.UI && state.UI.isMobSidebarOpen
    );
    const isDarkMode = () => {
        const localStorageDarkMode = localStorage && localStorage.getItem("darkMode");

        if (
            (localStorageDarkMode != null && localStorageDarkMode === "True") ||
            (theme.dark && theme.dark === true)
        ) {
            return true;
        }
        return false;
    };

    const dispatch = useDispatch();

    const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setLoading(true));
        if (todoTitleInput && todoDescInput) {
            const formData = new FormData();
            formData.append("title", todoTitleInput ? todoTitleInput : 'Your title');
            formData.append("description", todoDescInput ? todoDescInput : 'Your desc');
            formData.append("status", selectedStatus ? selectedStatus : 'your status');
            formData.append("priority", selectedPriority ? selectedPriority : 'priority');

            try {
                if (token !== null) {
                    const response = await fetch(getUrl("/admin/postTodo"), {
                        method: "POST",
                        body: formData,
                        headers: {
                            Authorization: token,
                        },
                    });
                    if (!response.ok) {
                        dispatch(setLoading(false));

                        setIsOpen(false);
                        throw new Error("Request failed");
                    }
                    // const jsonData = await response.json();
                    dispatch(setLoading(false));
                    setIsOpen(false);
                    dispatch(setLoading(true));
                    fetchAllUserData(token);
                    dispatch(setLoading(false));
                    // console.log(jsonData)
                }
            } catch (err) {
                console.error("Error:", err);
                dispatch(setLoading(false));
                setIsOpen(false);
            }
        }
    };
    return (
        <div className={includeDarkClass("main_dashboard_container", darkMode)}>
            <div className={includeDarkClass("dashboard_navbar", darkMode)}>
                <div className={includeDarkClass("menu_btn", darkMode)}>
                    <MenuButton
                        strokeWidth={5}
                        color={`${darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.7)"}`}
                        lineProps={{ strokeLinecap: "round" }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        width={20}
                        height={20}
                    />
                </div>
                <div className={includeDarkClass("logo_image", darkMode)}>
                    <img src={logo} alt="logo"></img>
                </div>
                <div className={includeDarkClass("navbar_heading", darkMode)}>
                    Task Master
                </div>
                <div className={includeDarkClass("navbar_void", darkMode)}></div>
                <div className={includeDarkClass("navbar_navlinks", darkMode)}>
                    {navLinks && navLinks.length !== 0 && navLinks.map((item, index) => {
                        return (
                            <div
                                key={`${item}_${index}`}
                                className={includeDarkClass("navbar_navlink_item", darkMode)}
                            >
                                {item && item.url && item.name && <Link to={item.url}>{item.name}</Link>}
                            </div>
                        );
                    })}
                </div>
                <div className={includeDarkClass("navbar_right", darkMode)}>
                    <div
                        onClick={() => navigate("/profile")}
                        className={includeDarkClass("profile_pic", darkMode)}
                    >
                        {allUserData && allUserData.picUrl ?
                            <img onClick={() => dispatch(setSideBarActiveTab(sideBarData && sideBarData.length && sideBarData.length - 1))} src={allUserData.picUrl} alt="profile pic" /> :
                            <UserProfile />
                        }
                    </div>
                </div>
                <div className={includeDarkClass("theme_toggle", darkMode)}>
                    {isDarkMode() ? (
                        <div
                            onClick={() => dispatch(toogleDarkLight())}
                            className={includeDarkClass(" ", darkMode)}
                            dangerouslySetInnerHTML={{ __html: darkModeSvgContent }}
                        ></div>
                    ) : (
                        <div
                            onClick={() => dispatch(toogleDarkLight())}
                            className={includeDarkClass(" ", darkMode)}
                            dangerouslySetInnerHTML={{ __html: lightModeSvgContent }}
                        ></div>
                    )}
                </div>
            </div>
            <div
                className={includeDarkClass("dashboard_sidebar_and_contents", darkMode)}
            >
                <div
                    className={includeDarkClass(
                        `dashboard_sidebar ${isMobSidebarOpen ? "open" : ""}`,
                        darkMode
                    )}
                >
                    <div
                        className={includeDarkClass("dashboard_sidebar_contents", darkMode)}
                    >
                        {sideBarData && sideBarData.length !== 0 && sideBarData.map((Item, index) => {
                            return (
                                <>{
                                    Item && Item.name && Item.name !== null ? <div
                                        key={`${Item}_${index}`}
                                        className={includeDarkClass(
                                            'sidebar_item_container',
                                            darkMode
                                        )}
                                        onClick={() => dispatch(setSideBarActiveTab(index))}
                                    >
                                        <div className={includeDarkClass(`sidebar_item ${currSideBarIdx === index ?
                                            'selected' : ''}`, darkMode)}>
                                            {Item && Item.url && Item.name && <Link
                                                onClick={() => dispatch(toggleMobSidebar())}
                                                to={Item.url}
                                            >
                                                {Item.name}
                                            </Link>}
                                        </div>
                                        {index !== sideBarData.length - 1 ? <div
                                            className={includeDarkClass("horizontal_divider", darkMode)}
                                        /> : <></>}
                                    </div> : <></>}
                                </>
                            );
                        })}
                    </div>
                </div>
                <div
                    className={includeDarkClass(
                        "dashboard_contents_main_container",
                        darkMode
                    )}
                >
                    <div className={includeDarkClass("contents_header", darkMode)}>
                        <div
                            className={includeDarkClass(
                                "contents_header_container",
                                darkMode
                            )}
                        >
                            <h1 id="header_">{currentPage}</h1>
                            {!params.parentTodo_id ? (
                                <div className={includeDarkClass("button_wrapper", darkMode)}>
                                    <button onClick={() => setIsOpen(!isOpen)}>
                                        <div className={includeDarkClass("btn_text", darkMode)}>
                                            Add task
                                        </div>
                                        <AddIcon showToolTip={false} size={20} />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className={includeDarkClass("contents_container", darkMode)}>
                        {children}
                        {/* FOR rendering the underlying children <Route/> components */}
                        <Outlet />
                    </div>
                    <Modal
                        heading="Add a new Todo"
                        isOpen={isOpen}
                        onClose={() => setIsOpen(!isOpen)}
                    >
                        <div
                            className={includeDarkClass("addTodo_form_container", darkMode)}
                        >
                            <form onSubmit={handleAddTodo}>
                                <input
                                    required
                                    onChange={(e) => setTodoTitleInput(e.target.value)}
                                    type="text"
                                    placeholder="Title for your new Todo ."
                                />
                                <input
                                    required
                                    onChange={(e) => setTodoDescInput(e.target.value)}
                                    type="textarea"
                                    placeholder="Description for your new Todo ."
                                />
                                <div>
                                    <label htmlFor="status">Status:</label>
                                    <select id="status" name="status" value={selectedStatus} onChange={handleStatusChange}>
                                        <option value="Todo">Todo</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        {/* <option value="OnHold">On Hold</option> */}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="Priority">Priority:</label>
                                    <select id="Priority" name="Priority" value={selectedPriority} onChange={handlePriorityChange}>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <button>Submit</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default DashboardWrapper;
