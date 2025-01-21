import {ColorModeProvider} from '@/components/ui/color-mode'
import {Provider} from '@/components/ui/provider'
// import {useRoutePaths, useSession} from "@render/hooks";
import {emitCustomEvent} from 'react-custom-events'
import {HashRouter} from 'react-router-dom'
import {AuthProvider} from './providers'
import {Router} from './router'

function App() {
  window.electron.onIpcMessage((message) => {
    console.log(`[App] emit custom event ${message.name}`)
    emitCustomEvent(message.name || 'unknown-message', message.data)
  })

  // const { isAuthenticated, user, signOut, signIn } = useSession()

  return (
    <Provider>
      <ColorModeProvider>
        <HashRouter>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </HashRouter>
      </ColorModeProvider>
    </Provider>
  )
}

export default App
