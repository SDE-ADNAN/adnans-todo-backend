import React, { useEffect } from "react";
import './TodosListContainer.scss'
import TodoItem from "../TodoItem/TodoListItem";
import { useDispatch } from "react-redux";
// import { setLoading } from "../../../../ReduxStore/UISlice";
import LoaderComponent from "../../LoaderComponent/LoaderComponent";
import { setCurrentPage } from "../../../../ReduxStore/UISlice";
import { includeDarkClass } from "../../../../CONFIG";
import { useSelector } from "react-redux";
import { RootState } from "../../../../ReduxStore/store";

interface TodoListContainerProps {
    todosArray: {
        createdAt: string;
        title: string;
        todo: any[];
        updatedAt: string;
        user: string;
        __v: number;
        _id: string;
    }[],
    isAllTodosContainer: boolean;
    fetchAllUserData: any;
    isSubTodoContainer?: boolean;
    parentTodoId?: string;
    fetchParentTodo?: any;
    className?: string;
    title?: string;
    hideParent?: boolean;
}

// const NoTodosSvg: any = () => <div>dsfdsvsd</div>

export const Container: React.FC<Partial<TodoListContainerProps>> = ({hideParent=false, title = '', className = '', todosArray = [], isSubTodoContainer = false, parentTodoId = '', fetchAllUserData = () => { }, fetchParentTodo = () => { } }) => {
    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
    return (
        <div className={includeDarkClass(`status_container ${ hideParent ? 'hideParent' : ''} ${className}`, darkMode)}>
            <div className={includeDarkClass(`title`, darkMode)}>{title}</div>
            <div className={includeDarkClass(`all_todos`, darkMode)}>
                {todosArray && todosArray.length === 0 ? 'NoTodosSvg' : todosArray ? todosArray.map((item, index) => {
                    return (
                        <>
                            <TodoItem isSubTodo={isSubTodoContainer} parentTodoId={parentTodoId} key={item._id} item={item} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} />
                        </>
                    )
                })
                    :
                    <LoaderComponent />}
            </div>
        </div>
    )
};

const TodosListContainer: React.FC<Partial<TodoListContainerProps>> = ({ isAllTodosContainer, todosArray, fetchAllUserData, isSubTodoContainer, parentTodoId = "", fetchParentTodo = () => { } }) => {

    const dispatch = useDispatch()

    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
    const User = useSelector((state: RootState) => state.User.allUserData)

    useEffect(() => {
        if (isSubTodoContainer) {
            dispatch(setCurrentPage('Task Details'))
        } else {
            dispatch(setCurrentPage('All Tasks'))
        }
    }, [dispatch, isSubTodoContainer])
    return (
        <div className={includeDarkClass(`todoListItems_container`, darkMode)}>
            {
            isAllTodosContainer && todosArray ? 
            <Container title={'All tasks'} hideParent={true} className={'Sub-Todos'} todosArray={todosArray} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
            : isSubTodoContainer && todosArray ?
                <Container title={'Sub-Tasks'} className={'Sub-Todos'} todosArray={todosArray} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
                : <>
                    {User && User.statusFiltered && User.statusFiltered.__filteredTodos ?
                        <Container title={'Task'} className={'Todo'} todosArray={User.statusFiltered.__filteredTodos} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
                        : <></>
                    }
                    {User && User.statusFiltered && User.statusFiltered.__filteredInProgress ?
                        <Container title={'InProgress'} className={'InProgress'} todosArray={User.statusFiltered.__filteredInProgress} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
                        : <></>
                    }
                    {User && User.statusFiltered && User.statusFiltered.__filteredCompleted ?
                        <Container title={'Completed'} className={'Completed'} todosArray={User.statusFiltered.__filteredCompleted} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
                        : <></>
                    }
                    {User && User.statusFiltered && User.statusFiltered.__filteredOnHold ?
                        <Container title={'OnHold'} className={'OnHold'} todosArray={User.statusFiltered.__filteredOnHold} isSubTodoContainer={isSubTodoContainer} parentTodoId={parentTodoId} fetchAllUserData={fetchAllUserData} fetchParentTodo={fetchParentTodo} /> 
                        : <></>
                    }
                </>}

        </div>
    )
}

export default TodosListContainer