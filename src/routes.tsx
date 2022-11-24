import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { UseWalletProvider } from './providers';
import { Primary } from './views';
import { MarketPlace } from './views/marketplace';
import { MarketList } from './views/primary/components/MarketList';
import { ActivityDetail } from './views/primary/ActivityDetail';
import { PrimaryDetails } from './views/primary/components/PrimaryDetails';
import { ProductionDetails } from './views/marketplace/ProductDetails';
import { HelpCenter } from './views/helpcenter';
import { ArticleType } from './views/helpcenter/ArticleType';
import { ArticleDetails } from './views/helpcenter/ArticleDetails';
import { Collection } from './views/collection';
import { Account } from './views/account';
import { Login } from './views/login';
import { UserSetting } from './views/userSetting';
import { HsHome } from './views/home';
import history from './utils/history';
import { Slider } from './components/Slider';
import { ChainIds } from './config/constants';

export function Routes() {
  return (
    <>
      <Router history={history}>
        <UseWalletProvider connectors={ChainIds}>
          <Switch>
            <Route exact path='/primary' component={() => <Primary />} />
            <Route exact path='/marketplace' component={() => <MarketPlace />} />
            <Route exact path='/marketlist/:id?/:status?' component={() => <MarketList />} />
            <Route exact path='/activityDetail' component={() => <ActivityDetail />} />
            <Route
              path='/primary-details/:id?/:status?/:blindStatus?/:tokenId?/:tags?/:metadataId?'
              component={() => <PrimaryDetails />}
            />
            <Route exact path='/product-details/:id' component={() => <ProductionDetails />} />
            <Route exact path='/helpcenter' component={() => <HelpCenter />} />
            <Route exact path='/article-type/:name/:id' component={() => <ArticleType />} />
            <Route exact path='/article-details/:name/:id' component={() => <ArticleDetails />} />
            <Route exact path='/login' component={() => <Login />} />
            <Route exact path='/account/:id?/:address?' component={() => <Account />} />
            <Route exact path='/collection/:id' component={() => <Collection />} />
            <Route exact path='/user-settings' component={() => <UserSetting />} />
            <Route exact path='/wallet' component={() => <Slider />} />
            <Route path='/' component={() => <HsHome />} />
          </Switch>
        </UseWalletProvider>
      </Router>
    </>
  );
}
