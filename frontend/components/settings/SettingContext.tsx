import React from 'react'
import Account from './Content/Account'
import Privacy from './Content/Privacy'
import Security from './Content/Security'
import Notification from './Content/Notification'
import Appearance from './Content/Appearance'

type Props = {
  activeTab:string;
}

const SettingContext = ({activeTab}:Props) => {
  if(activeTab === "account") {
    return <Account />
  }
  if(activeTab === "privacy")  {
    return <Privacy />
  }
  if(activeTab === "security")  {
    return <Security />
  }
  if(activeTab === "notifications")  {
    return <Notification />
  }
  if(activeTab === "appearence")  {
    return <Appearance />
  }
}

export default SettingContext