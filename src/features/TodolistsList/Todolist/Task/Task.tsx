import React, {ChangeEvent} from 'react'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {removeTask, updateTask} from "../../tasks-reducer";
import {useAppDispatch} from "app/store";
import s from '../../styles.module.css'

type TaskPropsType = {
    task: TaskType
    todolistId: string

}
export const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const removeTaskHandler = () => dispatch(removeTask({ taskId: task.id, todolistId }))

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTask({taskId: task.id, domainModel: {status}, todolistId}))
    }
    const changeTaskTitleHandler = (newTitle: string) => dispatch(updateTask({taskId: task.id, domainModel: {title: newTitle}, todolistId}))

    return <div className={`${s.task} ${task.status === TaskStatuses.Completed ? s.isDone : ''}`} key={task.id}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeTaskStatusHandler}
        />

        <EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
        <IconButton className={s.deleteTaskButton} onClick={removeTaskHandler}>
            <Delete fontSize='small'/>
        </IconButton>
    </div>
})

