import React, { useEffect } from 'react'
import { Route, Switch, Router } from 'react-router-dom'
import { UseWalletProvider } from './providers'
import { Primary } from './views'
import { MarketPlace } from './views/marketplace'
import { MarketList } from './views/primary/components/MarketList'
import { ActivityDetail } from './views/primary/ActivityDetail'
import { PrimaryDetails } from './views/primary/components/PrimaryDetails'
import { ProductionDetails } from './views/marketplace/ProductDetails'
import { HelpCenter } from './views/helpcenter'
import { ArticleType } from './views/helpcenter/ArticleType'
import { ArticleDetails } from './views/helpcenter/ArticleDetails'
import { Account } from './views/account'
import { Login } from './views/login'
import { UserSetting } from './views/userSetting'
import { HsHome } from './views/home'
import history from './utils/history'
import { Slider } from './components/Slider'
import { ChainIds } from './config/constants'
import { GatherList } from './views/account/gatherList'
import { GatherDetail } from "./views/account/gatherDetail"
import { GatherEdit } from "./views/account/gatherEdit"
import { Privacy } from "./views/privacyPolicy"

import ScrollTop from './components/ScrollTop'

export function Routes() {
  return (
    <>
      <Router history={history}>
        <ScrollTop>
          <UseWalletProvider connectors={ChainIds}>
            <Switch>
              <Route exact path='/primary' component={() => <Primary />} />
              <Route exact path='/marketplace' component={() => <MarketPlace />} />
              <Route exact path='/marketlist/:id?/:status?' component={() => <MarketList />} />
              <Route exact path='/activityDetail' component={() => <ActivityDetail />} />
              {/* <Route
                path='/primary-details/:id?/:status?/:blindStatus?/:tokenId?/:tags?/:metadataId?'
                component={() => <PrimaryDetails />}
              /> */}
              <Route exact path='/product-details' component={() => <ProductionDetails />} />
              <Route exact path='/helpcenter' component={() => <HelpCenter />} />
              <Route exact path='/article-type/:name/:id' component={() => <ArticleType />} />
              <Route exact path='/article-details/:id' component={() => <ArticleDetails />} />
              <Route exact path='/login' component={() => <Login />} />
              <Route exact path='/account/:id?/:address?' component={() => <Account />} />
              <Route exact path='/gather' component={() => <GatherList />} />
              <Route exact path='/gather-detail/:link' component={() => <GatherDetail />} />
              <Route exact path='/gather-edit/:link' component={() => <GatherEdit />} />
              <Route exact path='/privacy' component={() => <Privacy />} />
              <Route exact path='/user-settings' component={() => <UserSetting />} />
              <Route exact path='/wallet' component={() => <Slider />} />
              <Route path='/' component={() => <HsHome />} />
            </Switch>
          </UseWalletProvider>
        </ScrollTop>
      </Router>
    </>
  )
}
