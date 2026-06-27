import { Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/react'
import PageLoader from "./components/PageLoader.jsx"
import Layout from './components/Layout.jsx';

import { Routes,Route  } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
function App() {
 
  const {isLoaded,isSignedIn}=useAuth();
  if(!isLoaded) return <PageLoader/>;

  return (
    <Layout>
   <Routes>
    <Route path="/" element={<HomePage/>} />
    <Route path="/cart" element={<CartPage/>} />
     <Route path='/orders' element={isSignedIn ? <OrdersPage/> : <Navigate to={"/"} replace />} />
   </Routes>
    </Layout>
  )
}

export default App
