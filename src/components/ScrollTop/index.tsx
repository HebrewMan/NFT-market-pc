
import { withRouter } from 'react-router-dom'

function BasicLayout(props: any) {
  // if (props.location?.pathname !== props.location.pathname) {
  window.scrollTo(0, 0)
  // }
  return props.children
}

export default withRouter(BasicLayout)