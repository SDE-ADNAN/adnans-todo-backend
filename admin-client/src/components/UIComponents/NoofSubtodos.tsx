import { childTodo } from "../../medias"
import "./NoofSubTodos.scss"

interface NoofSubtodosProps{
    subTodoNumber:Number
}

const NoofSubtodos : React.FC<NoofSubtodosProps> = ({subTodoNumber})=>{
    return(
        <div title={`${subTodoNumber} sub-todos below`} className="NoofSubTodos_maindiv"><img src={childTodo} alt="child"></img>
        <div>{subTodoNumber.toLocaleString()}</div></div>
    )
}

export default NoofSubtodos;