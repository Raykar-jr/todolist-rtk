import React, {ChangeEvent} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '../../../../api/todolists-api'
import {removeTaskTC, updateTaskTC} from "../../tasks-reducer";
import {useAppDispatch} from "../../../../app/store";


type TaskPropsType = {
    task: TaskType
    todolistId: string

}
export const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const removeTask = () => dispatch(removeTaskTC(task.id, todolistId))

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        const thunk = updateTaskTC(task.id, {status}, todolistId)
        dispatch(thunk)
    }
    const changeTaskTitle = (newTitle: string) => dispatch(updateTaskTC(task.id, {title: newTitle}, todolistId))

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeTaskStatus}
        />

        <EditableSpan value={task.title} onChange={changeTaskTitle}/>
        <IconButton onClick={removeTask}>
            <Delete/>
        </IconButton>
    </div>
})
