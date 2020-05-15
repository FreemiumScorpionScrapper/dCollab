import React from 'react'
import '../../css/kanban.css'

import { List, Paper } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Box from '@material-ui/core/Box'

import TodoItem from './todoItem'
import { useFormik } from 'formik'
import Typography from '@material-ui/core/Typography'

const EMPTY_STRING = ''

const AddTodo = props => {
  const formik = useFormik({
    initialValues: {
      text: EMPTY_STRING,
    },
    onSubmit: values => {
      props.onItemAdd(values.text)
      formik.resetForm()
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="row" alignItems="center" pt={2}>
        <Box flexGrow={1} pl={2}>
          <TextField
            name="text"
            placeholder="What're you going to do?"
            value={formik.values.text}
            onChange={formik.handleChange}
            fullWidth
            required
          />
        </Box>
        <Box>
          <IconButton type='submit'>
            <AddCircleIcon/>
          </IconButton>
        </Box>
      </Box>
    </form>
  )
}

const TodoList = props => (
  <List>
    {props.items.map((todo, idx) => (
      <TodoItem
        {...todo}
        key={todo.id}
        divider={idx !== props.items.length - 1}
        toggleTodo={id => props.toggleTodo(id)}
        removeTodo={id => props.removeTodo(id)}
        modifyTodo={(text) => props.modifyTodo(todo.id, text)}
      />
    ))}
  </List>
)

const TodoApp = props => (
  <Paper className='todoApp'>
    <Box mx={2} pt={4}>
      <Typography variant='h4'>Title</Typography>
    </Box>
    <AddTodo onItemAdd={text => props.addTodo(text)}/>
    <TodoList
      items={props.todos}
      toggleTodo={id => props.toggleTodo(id)}
      removeTodo={id => props.removeTodo(id)}
      modifyTodo={(id, text) => props.modifyTodo(id, text)}
    />
  </Paper>
)

export default TodoApp
