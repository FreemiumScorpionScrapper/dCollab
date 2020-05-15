import React from 'react'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'

const EMPTY_STRING = ''

export const SettingsDialog = (props) => {

  const [open, setOpen] = React.useState(!props.config.isConfigured);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const configWhisper = (values) => {
    if (values.dcGroupId.length < 3) {
      alert("Group ID should be at least 3 characters!");
      return false;
    }
    if (!values.dcUsername || values.dcUsername.length === 0) {
      alert("Please pick a username!");
      return false;
    }
    props.shh.generateSymKeyFromPassword(values.dcGroupId).then(symKeyID => {
      props.setSymKeyId(symKeyID)
      props.shh.getSymKey(symKeyID).then(symKey => {
        props.setWhisper({
          topic: symKey.substring(0, 10),
          symKey: symKey,
          symPassword: values.dcGroupId,
          isConfigured: true,
          username: values.dcUsername,
        })
        window.location.reload()
      })
    })
  }

  const isValuesEqual = (values) =>
    values.dcGroupId === props.config.symPassword &&
    values.dcUsername === props.config.username &&
    values.dcGroupId !== EMPTY_STRING &&
    values.dcUsername !== EMPTY_STRING;

  const formik = useFormik({
    initialValues: {
      dcGroupId: props.config.symPassword,
      dcUsername: props.config.username,
    },
    onSubmit: values => {
      if (isValuesEqual(values)) {
        return handleClose()
      }
      if (configWhisper(values) !== false) {
        return handleClose()
      }
    },
  });

  return (
    <div>
      <Button color="inherit" onClick={handleClickOpen} style={{textTransform: 'none'}}>
        {!props.config.isConfigured
          ? "SETTINGS"
          : props.config.username + ' @ ' + props.config.symPassword}
      </Button>
      <Dialog open={open} onClose={formik.handleSubmit} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Please enter Group ID and your username to join a group.
            </DialogContentText>
            <TextField
              name="dcGroupId"
              margin="dense"
              label='Group ID'
              value={formik.values.dcGroupId}
              onChange={formik.handleChange}
              fullWidth
              required
            />
            <TextField
              name="dcUsername"
              label='Username'
              value={formik.values.dcUsername}
              onChange={formik.handleChange}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button type='submit' color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
