import Auth from '../api/auth'
import Channel from '../api/channel'
import Program from '../api/program'
import Reminder from '../api/reminder'
import Tune from '../api/tune'
import * as types from './mutation-types'

export const doLogin = ({dispatch, state}, cookie) => {
  let authPromise = Auth.doLogin(cookie)
  authPromise
    .then(response => {
      if (response.ok) {
        dispatch(types.LOGIN_OK, JSON.parse(response.body))
      } else {
        dispatch(types.LOGIN_FAIL, JSON.parse(response.body))
      }
    })
    .catch(err => {
      dispatch(types.LOGIN_FAIL, JSON.parse(err.body))
    })

  return authPromise
}

export const keepAlive = ({dispatch, state}) => {
  let keepAlivePromise = Auth.keepAlive(state.userInfo.access_token)
  keepAlivePromise
    .then(response => {
      dispatch(types.KEEP_ALIVE_OK, JSON.parse(response.body))
    })
    .catch(err => {
      dispatch(types.KEEP_ALIVE_FAIL, JSON.parse(err.body))
    })

  return keepAlivePromise
}

export const fetchChannels = ({dispatch, state}) => {
  // Validar la duración de todos los programas actuales, en caso de que se haya "vencido" volver a pegarle a la API si o si
  if (state.channels !== undefined) {
    if (state.channels.length > 0) {
      return new Promise((resolve, reject) => {
        resolve({
          data: state.channels
        })
      })
    }
  }
  let channelsPromise = Channel.getChannels(state.userInfo.access_token)
  channelsPromise
    .then(response => {
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data)
      }

      let orderedArr = response.data.map(channel => {
        return channel.number
      })
      dispatch(types.LOWER_CHANNEL, Math.min(...orderedArr))
      dispatch(types.HIGHER_CHANNEL, Math.max(...orderedArr))
      dispatch(types.CHANNELS_OK, response.data)
    })
    .catch(err => {
      dispatch(types.CHANNELS_FAIL, err)
    })

  return channelsPromise
}

export const setTimestamp = ({dispatch, state}, fromTimestamp, toTimestamp) => {
  dispatch(types.SET_FROM_TIMESTAMP, fromTimestamp)
  dispatch(types.SET_TO_TIMESTAMP, toTimestamp)
}

export const setPlayingChannel = ({dispatch, state}, playingChannel) => {
  dispatch(types.CHANGE_PLAYER_CHANNEL, playingChannel)
}

export const fetchPrograms = ({dispatch, state}, currentChannel, fromTimestamp, toTimestamp) => {
  dispatch(types.PROGRAMS_OK, [])
  let programsPromise = Program.getPrograms(state.userInfo.access_token, currentChannel.id, fromTimestamp, toTimestamp)
  programsPromise
    .then(response => {
      let program = JSON.parse(response.body)[0].Transmissions
      dispatch(types.PROGRAMS_OK, program)
    })
    .catch(err => {
      dispatch(types.PROGRAMS_FAIL, JSON.parse(err.body))
    })

  return programsPromise
}

export const fetchReminders = ({dispatch, state}) => {
  let reminderList = Reminder.getList(state.userInfo.access_token)
  return reminderList.then(
      response => {
        console.log(response)
      }
    ).catch(
      error => {
        console.log(error)
      }
    )
}

export const setReminder = ({dispatch, state}, idTransmission) => {
  let setReminder = Reminder.setReminder(state.userInfo.access_token, idTransmission)
  return setReminder.then(
    response => {
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data)
      }

      if (response.data.status === 201 && response.data.action === 'created') {
        dispatch(types.PROGRAM_REMINDER, idTransmission, true)
      }

      return true
    }
  ).catch(
    error => {
      console.log(error)

      return false
    }
  )
}

export const deleteReminder = ({dispatch, state}, idTransmission) => {
  let deleteReminder = Reminder.deleteReminder(state.userInfo.access_token, idTransmission)
  return deleteReminder.then(
    response => {
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data)
      }

      if (response.data.status === 200 && response.data.action === 'deleted') {
        dispatch(types.PROGRAM_REMINDER, idTransmission, false)
      }

      return true
    }
  ).catch(
    error => {
      console.log(error)

      return false
    }
  )
}

export const getTune = ({dispatch, state}, idTransmission) => {
  let getTune = Tune.getTune(state.userInfo.access_token, idTransmission)
  return getTune.then(
    response => {
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data)
      }

      if (response.status === 200) {
        dispatch(types.CHANGE_PLAYER_URL, response.data.url)
      }

      return true
    }
  ).catch(
    error => {
      console.log(error)

      return false
    }
  )
}

export const setCountry = ({dispatch, state}, country) => {
  dispatch(types.COUNTRY, country)
}

export const setPlayerVersion = ({dispatch, state}, playerVersion) => {
  dispatch(types.PLAYER_VERSION, playerVersion)
}

export const setVideoPlayer = ({dispatch, state}, player) => {
  dispatch(types.SET_VIDEO_PLAYER, player)
}

export const setIsMobile = ({dispatch, state}, isMobile) => {
  dispatch(types.IS_MOBILE, isMobile)
}
