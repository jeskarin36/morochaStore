import { Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/react'
import PageLoader from "./components/PageLoader.jsx"
import Layout from './components/Layout.jsx';
function App() {
 
  const {isLoaded}=useAuth();
  if(!isLoaded) return <PageLoader/>;

  return (
    <Layout>
     <header >
        <Show when="signed-out">
          <SignInButton mode='modal'/>
          <SignUpButton  mode='modal'/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>

      <button className='text-amber-950 font-bold bg-blue-950'>CLick</button>
    </Layout>
  )
}

export default App
