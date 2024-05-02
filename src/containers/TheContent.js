import { CContainer, CFade } from '@coreui/react'
import React from 'react'
import {
  Route, Switch
} from 'react-router-dom'
// routes config
import routes from '../routes'


const TheContent = () => {
  return (
    <main className="c-main">
      <CContainer fluid style={{ height: "100%" }}>
        {/* <Router>
          <Suspense fallback={loading}>
            <Switch>
              <Route path="/overview" name="Home" render={props => <Dashboard {...props} />} />
              <Route path="/engagement" exact name="Engagement" render={props => <Engagement {...props} />} />
              <Route path="/mentalHealth" exact name="MentalHealth" render={props => <MentalHealth {...props} />} />
              <Route path="/safety" exact name="Safety" render={props => <Safety {...props} />} />
            </Switch>
          </Suspense>
        </Router> */}
        <Switch>
          {routes.map((route, idx) => {
            {/* console.log(route) */}
            return route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                  <CFade>
                    <route.component {...props} />
                  </CFade>
                )} />
            )
          })}
          {/* <Redirect from="/" to="/overview" /> */}
        </Switch>

      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
