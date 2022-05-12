import '../styles/globals.css';
import '../lib/legacy/less/app.less';
import '../lib/legacy/less/bootstrap_repl.less';
import '../lib/legacy/less/chat.less';
import '../lib/legacy/less/tourney_app.less';
import '../lib/legacy/less/app_header.less'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;
