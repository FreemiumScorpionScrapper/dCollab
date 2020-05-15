import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import theme from '../../util/theme'
import TodoApp from '../../containers/kanban'
import AddListButton from './addListButton'

const useStyles = makeStyles({
  root: {
    border: '4px solid rgba(0, 0, 0, 0.12)',
    borderRadius: theme.spacing(2),
    width: 400,
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const Kanban = props => {
  const classes = useStyles()
  return (
    <div>
      <TodoApp/>
      <AddListButton/>
    </div>
  )
}

export default Kanban