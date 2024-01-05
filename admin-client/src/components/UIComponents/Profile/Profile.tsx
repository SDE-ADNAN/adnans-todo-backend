import { useSelector } from "react-redux";
import "./Profile.scss";
import { RootState } from "../../../ReduxStore/store";
import { getUrl, includeDarkClass } from "../../../CONFIG";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentPage, setLoading } from "../../../ReduxStore/UISlice";
import { motion } from "framer-motion";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import UserProfile from "../../../medias/UserProfile";
import EditUserProfile from "../../../medias/EditUserProfile";
import Modal from "../Modal/Modal";

interface ProfileProps {
    fetchAllUserData: any;
    handleLogout: any;
}

const Profile: React.FC<ProfileProps> = ({ fetchAllUserData = () => { } ,handleLogout=() => { }}) => {
    const userProfile = useSelector((state: RootState) => state.User.allUserData);
    const darkMode = useSelector((state: RootState) => state.UI.theme.dark);
    const token = useSelector((state: RootState) => state.User.token);
    const [isOpen, setIsOpen] = useState(false)
    const [userName, setUserName] = useState(userProfile.userName);
    const [userEmail, setUserEmail] = useState(userProfile.email);
    const [userPicUrl, setUserPicUrl] = useState(userProfile.picUrl);


    const dispatch = useDispatch();

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if (userName && userName !== userProfile.userName) {
            formData.append('userName', userName)
        }
        if (userEmail && userEmail !== userProfile.email) {
            formData.append('email', userEmail)
        }
        if (userPicUrl && userPicUrl !== userProfile.picUrl) {
            formData.append('picUrl', userPicUrl)
        }
        console.log({
            userName: userName,
            email: userEmail,
            picUrl: userPicUrl
        })
        dispatch(setLoading(true))
        fetch(getUrl('/auth/profile'), {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `${token}`,
            }
        }).then(res => {
            if (res.ok) {
                console.log("user updated successfully")
                fetchAllUserData(token)
                setIsOpen(false)
            }
            console.log("error in updating user")
            return res.json()
        }).then((jsonRes) => {
            console.log(jsonRes)
        }).finally(() => {
            console.log("finally")
        })
        dispatch(setLoading(false))
    }
    useEffect(() => {
        dispatch(setCurrentPage("Your Profile Info"));
    }, [dispatch]);
    useEffect(() => {
        console.log("Profile component Called");
    }, []);

    useEffect(() => {
        if (userProfile) {
            setUserName(userProfile.userName);
            setUserEmail(userProfile.email);
            setUserPicUrl(userProfile.picUrl);
        }
    }, [userProfile]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0, duration: 1 }}
            className={includeDarkClass("profile_main_container", darkMode)}
        >
            {userProfile &&
                userProfile.userName &&
                userProfile.email &&
                userProfile.picUrl ? (
                <div className={includeDarkClass("profile_main_card", darkMode)}>
                    <div className={includeDarkClass("profile_pic_con", darkMode)}>
                    <div
                            className={includeDarkClass(
                                "dashboard_sidebar_logoutbtn",
                                darkMode
                            )}
                        >
                            <button
                                onClick={handleLogout}
                                className={includeDarkClass("logoutBtn", darkMode)}
                            >
                                {" "}
                                Logout
                            </button>
                        </div>
                            <div>
                                {userProfile.picUrl ? (
                                    <img src={userProfile.picUrl} alt="profile pic"></img>
                                ) : (
                                    <UserProfile />
                                )}

                                {/* </div> */}
                                <div className={includeDarkClass("header", darkMode)}>
                                    Profile Picture
                                </div>
                            </div>
                            <div
                                className={includeDarkClass("horizontal_divider", darkMode)}
                            ></div>
                            <div className={includeDarkClass("profile_userName_con", darkMode)}>
                                <div className={includeDarkClass("header", darkMode)}>
                                    UserName :&nbsp;
                                </div>
                                <div className={includeDarkClass("content", darkMode)}>
                                    {userProfile.userName}
                                </div>
                            </div>
                            <div
                                className={includeDarkClass("horizontal_divider", darkMode)}
                            ></div>
                            <div className={includeDarkClass("profile_email", darkMode)}>
                                <div className={includeDarkClass("header", darkMode)}>
                                    Email :&nbsp;
                                </div>
                                <div className={includeDarkClass("content", darkMode)}>
                                    {userProfile.email}
                                </div>
                            </div>
                            <div
                                className={includeDarkClass("horizontal_divider", darkMode)}
                            ></div>
                            <div className={includeDarkClass("profile_picUrl", darkMode)}>
                                <div className={includeDarkClass("header", darkMode)}>
                                    Profile Pic Url&nbsp;
                                </div>
                                <div className={includeDarkClass("content", darkMode)}>
                                    {userProfile.picUrl}
                                </div>
                            </div>
                        </div>
                        <div onClick={() => setIsOpen(!isOpen)} className={includeDarkClass("edit_profile_icon", darkMode)}>
                            <EditUserProfile />
                        </div>
                        {userProfile && userProfile.userName && userProfile.email && userProfile.picUrl ? <Modal mountOnPortal={false} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} heading="Edit Profile" >
                            <form onSubmit={(e) => handleProfileUpdate(e)}>
                                <div className={includeDarkClass("input_field", darkMode)}>
                                    <label htmlFor="userName">UserName</label>
                                    <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                </div>
                                <div className={includeDarkClass("input_field", darkMode)}>
                                    <label htmlFor="userEmail">UserEmail</label>
                                    <input id="userEmail" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                </div>
                                <div className={includeDarkClass("input_field", darkMode)}>
                                    <label htmlFor="userPicUrl">Profile pic url</label>
                                    <input id="userPicUrl" type="text" value={userPicUrl} onChange={(e) => setUserPicUrl(e.target.value)} />
                                </div>
                                {/* <label htmlFor="userName">UserName</label>
                            <input id="userName" type="text" value={userProfile.userName} /> */}
                                <div className={includeDarkClass("btn_grp", darkMode)}>
                                    <button onClick={(e) => handleProfileUpdate(e)}>SUBMIT</button>
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        setIsOpen(false)
                                    }}>CANCEL</button>
                                </div>
                            </form>
                        </Modal> : <></>}

                    </div>
            ) : (
                <LoaderComponent />
            )}
        </motion.div>
    );
};

export default Profile;
