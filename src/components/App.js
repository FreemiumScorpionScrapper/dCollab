import React from 'react'
import * as shortId from 'shortid'

import TopBar from './topBar'
import MainPanel from '../containers/mainPanel'
import { decodeFromHex, encodeToHex } from '../util/util'

import { INIT_CHAT, INIT_KANBAN, KANBAN_ACTION, SEND_MESSAGE } from '../const/messageType'
import {
  ADD_LIST,
  REMOVE_LIST,
  MODIFY_LIST_TITLE,
  ADD_TODO,
  REMOVE_TODO,
  MODIFY_TODO,
  TOGGLE_TODO
} from '../actions/kanban'


class App extends React.Component {

  componentDidMount () {
    if (this.props.config.isConfigured) {
      const filter = {
        topics: [this.props.config.topic],
        symKeyID: this.props.config.symKeyID,
      }
      this.props.shh.subscribe('messages', filter, this.onReceiveMessage)
      this.sendSignal(INIT_CHAT)
    }
  }

  onReceiveMessage = (error, notification, subscription) => {
    let msg = decodeFromHex(notification.payload)
    switch (msg.type) {
      case KANBAN_ACTION:
        // console.log('KANBAN_ACTION: ' + msg.actionType)
        switch (msg.actionType) {
          case (ADD_LIST):
            this.props.addList(msg.listId)
            break
          case (REMOVE_LIST):
            this.props.removeList(msg.listId)
            break
          case (MODIFY_LIST_TITLE):
            this.props.modifyListTitle(msg.listId, msg.text)
            break
          case (ADD_TODO):
            this.props.addTodo(msg.listId, msg.todoId, msg.text)
            break
          case (REMOVE_TODO):
            this.props.removeTodo(msg.listId, msg.todoId)
            break
          case (MODIFY_TODO):
            this.props.modifyTodo(msg.listId, msg.todoId, msg.text)
            break
          case (TOGGLE_TODO):
            this.props.toggleTodo(msg.listId, msg.todoId)
            break
          default:
            console.log('ERROR: Received unknown kanban action: ' + msg.actionType)
        }
        this.props.updateLastModifiedDate(msg.date)
        break
      case INIT_CHAT:
        this.props.setSubscriptionID(subscription.id)
        if (msg.sender !== this.props.config.username) {
          this.props.newMessage(msg)
        }
        this.sendSignal(INIT_KANBAN, this.props.kanban, this.props.kanbanMeta.lastModifiedDate)
        break
      case INIT_KANBAN:
        // TODO Check if other's kanban is latest
        if (msg.sender !== this.props.config.username) {
          console.log('Received new kanban from ' + msg.sender)
          if (msg.date >= this.props.kanbanMeta.lastModifiedDate) {
            this.props.initKanban(msg.text)
            this.props.updateLastModifiedDate(msg.date)
            console.log('*** Updated by new kanban from ' + msg.sender)
          }
        }
        break
      case SEND_MESSAGE:
        this.props.newMessage(msg)
        break
      default:
        break
    }
  }

  sendSignal = (type, text = null, date = new Date()) => {
    const msg = {
      id: shortId.generate(),
      type: type,
      text: text,
      sender: this.props.config.username,
      date: date,
    }

    const postData = {
      symKeyID: this.props.config.symKeyID,
      topic: this.props.config.topic,
      payload: encodeToHex(JSON.stringify(msg)),
      ttl: 60,
      powTarget: 1,
      powTime: 100
    };

    this.props.shh.post(postData);
  }


  render () {
    return (
      <div className='app'>
        <TopBar/>
        <MainPanel/>
      </div>
    )
  }

}

export default App;
